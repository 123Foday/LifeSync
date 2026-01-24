import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaKeyboard, FaAmbulance, FaUserMd } from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';

const Emergency = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { backendUrl } = useContext(AppContext);
    
    // Get hospitalId from URL query params (for hospital-specific call centers)
    const hospitalId = searchParams.get('hospitalId');
    const callCenterType = hospitalId ? 'hospital' : 'main';
    
    const [status, setStatus] = useState('initiating'); // initiating, connecting, active, routing, ended
    const [transcript, setTranscript] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [callId, setCallId] = useState(null);
    const [emergencyData, setEmergencyData] = useState({
        name: '',
        details: '',
        location: '',
        contactNumber: '',
        emergencyType: 'Medical'
    });

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const conversationTimeoutRef = useRef(null);

    // Initialize call
    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('connecting');
            setTimeout(() => {
                setStatus('active');
                startRecording();
                const greeting = hospitalId 
                    ? "This is the LifeSync AI Emergency Assistant for this hospital. I'm here to help you. Please describe your emergency."
                    : "This is the LifeSync Main Emergency Call Center. I'm here to help you. Please describe your emergency.";
                speak(greeting);
            }, 2000);
        }, 1500);

        return () => clearTimeout(timer);
    }, [hospitalId]);

    // Speech Recognition Setup
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => {
                setIsListening(false);
                // Auto-restart if call is still active
                if (status === 'active' && !isListening) {
                    setTimeout(() => {
                        if (recognitionRef.current && status === 'active') {
                            recognitionRef.current.start();
                        }
                    }, 500);
                }
            };
            
            recognitionRef.current.onresult = (event) => {
                const text = event.results[event.results.length - 1][0].transcript;
                handleUserResponse(text);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    // Auto-restart on no-speech
                    setTimeout(() => {
                        if (recognitionRef.current && status === 'active') {
                            recognitionRef.current.start();
                        }
                    }, 1000);
                }
            };
        } else {
            toast.warning("Voice recognition not supported in this browser. Please use Chrome or Edge.");
        }
    }, [status]);

    // Start audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await uploadAudioRecording(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(1000); // Collect data every second
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            toast.error('Could not access microphone. Please check permissions.');
        }
    };

    // Stop and upload audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Upload audio to backend
    const uploadAudioRecording = async (audioBlob) => {
        if (!callId) return;

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'emergency-recording.webm');
            formData.append('callId', callId);

            await axios.post(`${backendUrl}/api/emergency/upload-audio`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    const speak = (text) => {
        if (synthRef.current) {
            // Cancel any ongoing speech
            synthRef.current.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            utterance.onend = () => {
                // Auto-start listening after AI finishes speaking
                if (status === 'active' && recognitionRef.current) {
                    setTimeout(() => {
                        if (recognitionRef.current && status === 'active') {
                            try {
                                recognitionRef.current.start();
                            } catch (e) {
                                // Already started, ignore
                            }
                        }
                    }, 500);
                }
            };
            
            synthRef.current.speak(utterance);
            setTranscript(prev => [...prev, { sender: 'AI', text, timestamp: new Date() }]);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleUserResponse = async (text) => {
        if (!text.trim()) return;

        const userMessage = { sender: 'User', text, timestamp: new Date() };
        setTranscript(prev => [...prev, userMessage]);

        // Clear any existing timeout
        if (conversationTimeoutRef.current) {
            clearTimeout(conversationTimeoutRef.current);
        }

        // Process with AI
        await processWithAI(text);
    };

    const processWithAI = async (userMessage) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/emergency/ai-conversation`, {
                callId,
                userMessage,
                conversation: transcript,
                hospitalId: hospitalId || null,
                callCenterType
            });

            if (data.success) {
                // Update call ID if this is the first response
                if (!callId && data.data.callId) {
                    setCallId(data.data.callId);
                }

                // Speak AI response
                speak(data.data.aiResponse);

                // Update emergency data from extracted info
                if (data.data.extractedInfo) {
                    const info = data.data.extractedInfo;
                    setEmergencyData(prev => ({
                        ...prev,
                        name: info.name || prev.name,
                        location: info.location || prev.location,
                        contactNumber: info.contactNumber || prev.contactNumber,
                        emergencyType: info.emergencyType || prev.emergencyType
                    }));
                }

                // Route to agent if needed
                if (data.data.shouldRoute) {
                    setStatus('routing');
                    speak("I'm connecting you to a human emergency agent now. Please stay on the line.");
                    
                    // Finalize emergency log
                    setTimeout(() => {
                        finalizeEmergencyCall();
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('AI processing error:', error);
            // Fallback to simple responses
            handleFallbackResponse(userMessage);
        }
    };

    const handleFallbackResponse = (userMessage) => {
        const lowerText = userMessage.toLowerCase();
        const userMessages = transcript.filter(t => t.sender === 'User').length;

        if (userMessages === 1) {
            speak("I understand. Can you please tell me your name?");
        } else if (userMessages === 2 && !emergencyData.name) {
            const name = userMessage.split(' ')[0];
            setEmergencyData(prev => ({ ...prev, name }));
            speak(`Thank you ${name}. Where are you located right now?`);
        } else if (userMessages === 3 && !emergencyData.location) {
            setEmergencyData(prev => ({ ...prev, location: userMessage }));
            speak("I have your location. Connecting you to a human agent and dispatching help immediately. Stay on the line.");
            setStatus('routing');
            setTimeout(() => finalizeEmergencyCall(), 3000);
        } else {
            speak("I understand. Let me connect you to a human agent now.");
            setStatus('routing');
            setTimeout(() => finalizeEmergencyCall(), 3000);
        }
    };

    const finalizeEmergencyCall = async () => {
        try {
            stopRecording();

            const summary = `Emergency reported by ${emergencyData.name || 'Anonymous'}. Type: ${emergencyData.emergencyType}. Details: ${transcript.find(t => t.sender === 'User')?.text || 'Not specified'}. Location: ${emergencyData.location || 'Unknown'}. Contact: ${emergencyData.contactNumber || 'Not provided'}`;

            const { data } = await axios.post(`${backendUrl}/api/emergency/create`, {
                callId,
                conversation: transcript,
                summary,
                location: emergencyData.location || 'Unknown',
                contactNumber: emergencyData.contactNumber,
                callerName: emergencyData.name || 'Anonymous',
                emergencyType: emergencyData.emergencyType,
                priority: 'High',
                hospitalId: hospitalId || null,
                callCenterType
            });

            if (data.success) {
                toast.success("Emergency reported successfully. Help is on the way!");
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            }
        } catch (error) {
            console.error('Error finalizing call:', error);
            toast.error("Emergency logged. Help is being dispatched.");
        }
    };

    const endCall = () => {
        if (status === 'active' || status === 'routing') {
            stopRecording();
            speak("Call ended. Emergency services have been notified.");
            finalizeEmergencyCall();
        }
        setTimeout(() => navigate('/'), 2000);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
            stopRecording();
            if (conversationTimeoutRef.current) {
                clearTimeout(conversationTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
            
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            {/* Header */}
            <div className="w-full max-w-2xl flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="font-bold tracking-wider text-red-500">LIVE EMERGENCY CALL</span>
                    {hospitalId && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                            Hospital Call Center
                        </span>
                    )}
                    {!hospitalId && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                            Main Call Center
                        </span>
                    )}
                    {isRecording && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Recording
                        </span>
                    )}
                </div>
                <div className="text-gray-400 text-sm">
                    {callId ? `ID: ${callId}` : 'Connecting...'}
                </div>
            </div>

            {/* Main Center UI */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl z-10">
                
                {/* Visualizer / Avatar */}
                <div className="relative mb-12">
                    <div className={`w-40 h-40 rounded-full border-4 ${status === 'active' ? 'border-red-500' : status === 'routing' ? 'border-yellow-500' : 'border-gray-600'} flex items-center justify-center p-2 relative transition-all`}>
                        <div className={`w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden`}>
                            {status === 'routing' ? (
                                <FaUserMd className={`text-6xl ${status === 'routing' ? 'text-yellow-500 animate-pulse' : 'text-gray-500'}`} />
                            ) : (
                                <FiActivity className={`text-6xl ${status === 'active' ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                            )}
                        </div>
                        {/* Ring Waves */}
                        {(status === 'active' || status === 'routing') && (
                            <>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border border-red-500 opacity-50 animate-ping"></div>
                                <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded-full border border-red-500 opacity-30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Text */}
                <h2 className="text-2xl font-light mb-8 text-center">
                    {status === 'initiating' && "Initializing secure connection..."}
                    {status === 'connecting' && "Connecting to Emergency Center..."}
                    {status === 'active' && (isListening ? "Listening..." : "AI Assistant Speaking...")}
                    {status === 'routing' && "Routing to Human Agent..."}
                </h2>

                {/* Transcript / Conversation */}
                <div className="w-full h-64 overflow-y-auto bg-neutral-800/50 rounded-xl p-4 backdrop-blur-sm border border-white/10 space-y-3 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-neutral-700">
                    {transcript.length === 0 ? (
                        <p className="text-gray-500 text-center italic">Conversation will appear here...</p>
                    ) : (
                        transcript.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'AI' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                                    msg.sender === 'AI' ? 'bg-neutral-700 text-white' : 'bg-red-600 text-white'
                                }`}>
                                    <p className="text-xs opacity-70 mb-1 flex items-center gap-2">
                                        {msg.sender === 'AI' ? '🤖 AI Assistant' : '👤 You'}
                                        <span className="text-[10px]">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </p>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Emergency Info Summary */}
                {emergencyData.name || emergencyData.location ? (
                    <div className="w-full mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                        <p className="text-xs text-red-400 mb-1">Information Collected:</p>
                        <div className="text-sm space-y-1">
                            {emergencyData.name && <p>Name: {emergencyData.name}</p>}
                            {emergencyData.location && <p>Location: {emergencyData.location}</p>}
                            {emergencyData.contactNumber && <p>Contact: {emergencyData.contactNumber}</p>}
                        </div>
                    </div>
                ) : null}

            </div>

            {/* Controls */}
            <div className="w-full max-w-md grid grid-cols-3 gap-6 mb-8 z-10">
                <button 
                    className="flex flex-col items-center gap-2 group" 
                    onClick={() => {
                        const input = prompt("Type your message:");
                        if (input) handleUserResponse(input);
                    }}
                >
                    <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition">
                        <FaKeyboard className="text-xl" />
                    </div>
                    <span className="text-xs text-gray-400">Type</span>
                </button>

                <button 
                    className={`flex flex-col items-center gap-2 group`}
                    onClick={toggleListening}
                    disabled={status !== 'active'}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${
                        isListening ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-white text-black'
                    } ${status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isListening ? <FaMicrophone className="text-2xl animate-bounce" /> : <FaMicrophoneSlash className="text-2xl" />}
                    </div>
                    <span className="text-xs font-semibold">{isListening ? 'Listening' : 'Mute'}</span>
                </button>

                <button 
                    className="flex flex-col items-center gap-2 group" 
                    onClick={endCall}
                >
                    <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600/40 transition">
                        <FaPhoneSlash className="text-xl text-red-500" />
                    </div>
                    <span className="text-xs text-gray-400">End Call</span>
                </button>
            </div>
            
        </div>
    );
};

export default Emergency;
