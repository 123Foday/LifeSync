import React, { useContext, useEffect, useState, useRef } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Phone, PhoneOff, PhoneIncoming, PhoneCall, 
  User, MapPin, Clock, AlertTriangle, 
  Play, Pause, Volume2, VolumeX,
  MessageSquare, FileText, Headphones,
  CheckCircle, X, Search, Filter,
  Radio, RadioIcon
} from 'lucide-react';

const EmergencyCallCenter = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const { theme } = useTheme();
  
  const [emergencyLogs, setEmergencyLogs] = useState([]);
  const [activeCalls, setActiveCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [isViewingCall, setIsViewingCall] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [audioPlaying, setAudioPlaying] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (aToken) {
      fetchEmergencyLogs();
      const interval = setInterval(fetchEmergencyLogs, 5000); // Poll every 5 seconds for real-time updates
      return () => clearInterval(interval);
    }
  }, [aToken]);

  const fetchEmergencyLogs = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/emergency/all', {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setEmergencyLogs(data.data);
        // Filter active calls (Pending, In Progress, Routed to Agent)
        setActiveCalls(data.data.filter(log => 
          ['Pending', 'In Progress', 'Routed to Agent'].includes(log.status)
        ));
      }
    } catch (error) {
      console.error("Failed to fetch emergency logs", error);
    }
  };

  const handleAnswerCall = async (callId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/emergency/update-status/${callId}`, {
        status: 'In Progress',
        agentId: 'admin' // In real implementation, use actual agent ID
      }, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success("Call answered");
        fetchEmergencyLogs();
        setSelectedCall(data.data);
        setIsViewingCall(true);
      }
    } catch (error) {
      toast.error("Failed to answer call");
    }
  };

  const handleEndCall = async (callId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/emergency/update-status/${callId}`, {
        status: 'Resolved'
      }, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success("Call resolved");
        fetchEmergencyLogs();
        setIsViewingCall(false);
        setSelectedCall(null);
      }
    } catch (error) {
      toast.error("Failed to end call");
    }
  };

  const handleUpdateStatus = async (callId, newStatus) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/emergency/update-status/${callId}`, {
        status: newStatus
      }, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success("Status updated");
        fetchEmergencyLogs();
        if (selectedCall && selectedCall._id === callId) {
          setSelectedCall(data.data);
        }
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleViewCall = async (callId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/emergency/${callId}`, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setSelectedCall(data.data);
        setIsViewingCall(true);
      }
    } catch (error) {
      toast.error("Failed to load call details");
    }
  };

  const toggleAudio = (audioUrl) => {
    if (audioPlaying === audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAudioPlaying(null);
    } else {
      setAudioPlaying(audioUrl);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  };

  const filteredLogs = emergencyLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.callerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.callId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || log.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Routed to Agent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className='p-6 bg-gray-50 dark:bg-[#121212] min-h-screen transition-all duration-300'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3'>
              <div className='relative'>
                <PhoneCall className='text-red-500' size={32} />
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping'></div>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></div>
              </div>
              Main Emergency Call Center
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-2'>Real-time IVR & AI Assistant Management</p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>Active Calls</div>
              <div className='text-2xl font-bold text-red-500'>{activeCalls.length}</div>
            </div>
            <div className='bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>Total Calls</div>
              <div className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{emergencyLogs.length}</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <div className='flex-1 min-w-[300px]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
              <input
                type='text'
                placeholder='Search by caller name, location, or call ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-500'
          >
            <option value='all'>All Status</option>
            <option value='Pending'>Pending</option>
            <option value='In Progress'>In Progress</option>
            <option value='Routed to Agent'>Routed to Agent</option>
            <option value='Resolved'>Resolved</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className='px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-500'
          >
            <option value='all'>All Priorities</option>
            <option value='Critical'>Critical</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Active Calls Queue */}
        <div className='lg:col-span-2 space-y-4'>
          {/* Active Calls Section */}
          {activeCalls.length > 0 && (
            <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900/20 overflow-hidden'>
              <div className='bg-red-100 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-900/30'>
                <div className='flex items-center gap-2'>
                  <PhoneIncoming className='text-red-600 animate-pulse' size={20} />
                  <h2 className='font-bold text-red-700 dark:text-red-400'>Active Calls Queue</h2>
                  <span className='ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full'>{activeCalls.length}</span>
                </div>
              </div>
              <div className='divide-y divide-gray-100 dark:divide-zinc-800 max-h-[400px] overflow-y-auto'>
                {activeCalls.map((call) => (
                  <div
                    key={call._id}
                    className='p-4 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition cursor-pointer'
                    onClick={() => handleViewCall(call._id)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(call.priority)} animate-pulse`}></div>
                          <span className='font-bold text-gray-800 dark:text-gray-100'>{call.callerName || 'Anonymous'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(call.status)}`}>
                            {call.status}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{call.summary}</p>
                        <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                          <span className='flex items-center gap-1'>
                            <MapPin size={12} />
                            {call.location || 'Unknown'}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock size={12} />
                            {new Date(call.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswerCall(call._id);
                        }}
                        className='ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2'
                      >
                        <Phone size={16} />
                        Answer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Calls List */}
          <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200 dark:border-zinc-800'>
              <h2 className='font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2'>
                <FileText size={20} />
                All Emergency Calls
              </h2>
            </div>
            <div className='divide-y divide-gray-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto'>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((call) => (
                  <div
                    key={call._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition cursor-pointer ${
                      selectedCall?._id === call._id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleViewCall(call._id)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(call.priority)}`}></div>
                          <span className='font-bold text-gray-800 dark:text-gray-100'>{call.callerName || 'Anonymous'}</span>
                          <span className='text-xs text-gray-500'>#{call.callId}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(call.status)}`}>
                            {call.status}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>{call.summary}</p>
                        <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                          <span className='flex items-center gap-1'>
                            <MapPin size={12} />
                            {call.location || 'Unknown'}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock size={12} />
                            {new Date(call.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        {call.audioRecordingUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAudio(call.audioRecordingUrl);
                            }}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition'
                          >
                            {audioPlaying === call.audioRecordingUrl ? (
                              <Pause size={18} className='text-blue-500' />
                            ) : (
                              <Play size={18} className='text-gray-500' />
                            )}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCall(call._id);
                          }}
                          className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition'
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
                  No emergency calls found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Details Panel */}
        <div className='lg:col-span-1'>
          {isViewingCall && selectedCall ? (
            <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 sticky top-6'>
              <div className='bg-red-100 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-900/30 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Radio className='text-red-600 animate-pulse' size={20} />
                  <h3 className='font-bold text-red-700 dark:text-red-400'>Live Call</h3>
                </div>
                <button
                  onClick={() => {
                    setIsViewingCall(false);
                    setSelectedCall(null);
                  }}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <X size={20} />
                </button>
              </div>

              <div className='p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto'>
                {/* Call Info */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Call ID</p>
                      <p className='font-mono text-sm font-bold'>{selectedCall.callId}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedCall.priority)} animate-pulse`}></div>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Status</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedCall.status)}`}>
                        {selectedCall.status}
                      </span>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Priority</p>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${selectedCall.priority === 'Critical' ? 'red' : selectedCall.priority === 'High' ? 'orange' : 'yellow'}-100 text-${selectedCall.priority === 'Critical' ? 'red' : selectedCall.priority === 'High' ? 'orange' : 'yellow'}-800`}>
                        {selectedCall.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caller Info */}
                <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <User size={16} />
                    Caller Information
                  </h4>
                  <div className='space-y-2 text-sm'>
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>Name</p>
                      <p className='font-medium'>{selectedCall.callerName || 'Anonymous'}</p>
                    </div>
                    {selectedCall.contactNumber && (
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Contact</p>
                        <p className='font-medium flex items-center gap-1'>
                          <Phone size={14} />
                          {selectedCall.contactNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>Location</p>
                      <p className='font-medium flex items-center gap-1'>
                        <MapPin size={14} />
                        {selectedCall.location || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Transcript */}
                <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <MessageSquare size={16} />
                    Live Conversation
                  </h4>
                  <div className='space-y-2 max-h-64 overflow-y-auto'>
                    {selectedCall.conversation && selectedCall.conversation.length > 0 ? (
                      selectedCall.conversation.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs ${
                            msg.sender === 'AI' 
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200' 
                              : msg.sender === 'Agent'
                              ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-200'
                          }`}
                        >
                          <div className='flex items-center justify-between mb-1'>
                            <span className='font-semibold'>
                              {msg.sender === 'AI' ? '🤖 AI' : msg.sender === 'Agent' ? '👨‍⚕️ Agent' : '👤 Caller'}
                            </span>
                            <span className='text-[10px] opacity-70'>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p>{msg.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className='text-gray-500 text-center py-4 text-xs'>No conversation yet</p>
                    )}
                  </div>
                </div>

                {/* Audio Recording */}
                {selectedCall.audioRecordingUrl && (
                  <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                    <h4 className='font-semibold mb-3 flex items-center gap-2'>
                      <Headphones size={16} />
                      Call Recording
                    </h4>
                    <audio
                      ref={audioRef}
                      controls
                      className='w-full'
                      onEnded={() => setAudioPlaying(null)}
                    >
                      <source src={selectedCall.audioRecordingUrl} type="audio/webm" />
                      <source src={selectedCall.audioRecordingUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}

                {/* AI Analysis */}
                {selectedCall.aiAnalysis && (
                  <div className='bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg'>
                    <h4 className='font-semibold mb-3 flex items-center gap-2'>
                      <AlertTriangle size={16} />
                      AI Analysis
                    </h4>
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Sentiment</p>
                        <p className='capitalize font-medium'>{selectedCall.aiAnalysis.sentiment || 'N/A'}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Urgency</p>
                        <p className='font-medium'>{selectedCall.aiAnalysis.urgencyScore || 'N/A'}/10</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className='space-y-2'>
                  {selectedCall.status !== 'Resolved' && (
                    <>
                      {selectedCall.status === 'Pending' && (
                        <button
                          onClick={() => handleAnswerCall(selectedCall._id)}
                          className='w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 font-semibold'
                        >
                          <Phone size={18} />
                          Answer Call
                        </button>
                      )}
                      {selectedCall.status === 'In Progress' && (
                        <button
                          onClick={() => handleEndCall(selectedCall._id)}
                          className='w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 font-semibold'
                        >
                          <CheckCircle size={18} />
                          Resolve Call
                        </button>
                      )}
                      <div className='grid grid-cols-2 gap-2'>
                        <button
                          onClick={() => handleUpdateStatus(selectedCall._id, 'In Progress')}
                          className='px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition'
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedCall._id, 'Resolved')}
                          className='px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition'
                        >
                          Resolve
                        </button>
                      </div>
                    </>
                  )}
                  {selectedCall.status === 'Resolved' && (
                    <div className='bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center justify-center gap-2'>
                      <CheckCircle size={18} />
                      Call Resolved
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 text-center'>
              <PhoneCall className='mx-auto text-gray-300 dark:text-gray-600 mb-4' size={48} />
              <p className='text-gray-500 dark:text-gray-400'>Select a call to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default EmergencyCallCenter;
