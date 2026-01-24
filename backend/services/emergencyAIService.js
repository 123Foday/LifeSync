import axios from 'axios';

/**
 * AI Emergency Call Assistant Service
 * Handles intelligent conversation, question routing, and emergency assessment
 */

// Fallback responses when AI is not available
const fallbackResponses = {
    greeting: "This is the LifeSync AI Emergency Assistant. I'm here to help. Please describe your emergency.",
    askName: "Can you please tell me your name?",
    askLocation: "Where are you located right now? Please provide your address or location.",
    askDetails: "Can you provide more details about the emergency?",
    askContact: "What is the best phone number to reach you?",
    routing: "I understand this is urgent. I'm connecting you to a human emergency agent now. Please stay on the line.",
    confirm: "I have your information. Help is being dispatched. Is there anything else I should know?"
};

/**
 * Analyze emergency conversation using AI (OpenAI or fallback)
 * @param {Array} conversation - Array of {sender, text, timestamp} objects
 * @param {String} userMessage - Latest user message
 * @returns {Object} - {response, shouldRoute, priority, extractedInfo}
 */
const analyzeEmergencyConversation = async (conversation, userMessage) => {
    try {
        // Check if OpenAI API key is available
        const openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (!openaiApiKey) {
            // Fallback to rule-based system
            return fallbackAnalysis(conversation, userMessage);
        }

        // Use OpenAI API for intelligent conversation
        const conversationHistory = conversation.map(msg => ({
            role: msg.sender === 'User' ? 'user' : 'assistant',
            content: msg.text
        }));

        const systemPrompt = `You are an AI Emergency Call Assistant for LifeSync. Your role is to:
1. Calmly gather essential information: caller's name, location, emergency type, and details
2. Assess the urgency and priority of the situation
3. Extract key medical information (symptoms, medications, allergies)
4. Determine when to route to a human agent (for critical cases or when user requests)
5. Be empathetic, clear, and professional

Guidelines:
- Ask one question at a time
- For critical emergencies (heart attack, severe bleeding, unconsciousness), route immediately
- Extract: name, location, emergency type, symptoms, contact number
- Keep responses concise (1-2 sentences)
- Show empathy and reassurance

Respond in JSON format:
{
    "response": "Your response to the user",
    "shouldRoute": true/false,
    "priority": "Low/Medium/High/Critical",
    "extractedInfo": {
        "name": "extracted name or null",
        "location": "extracted location or null",
        "emergencyType": "Medical/Accident/Fire/Other",
        "symptoms": ["symptom1", "symptom2"],
        "contactNumber": "extracted number or null"
    },
    "sentiment": "calm/panicked/urgent/distressed",
    "urgencyScore": 1-10
}`;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini', // Using cost-effective model
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory,
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        const aiResponse = JSON.parse(response.data.choices[0].message.content);
        
        return {
            response: aiResponse.response || fallbackResponses.askDetails,
            shouldRoute: aiResponse.shouldRoute || false,
            priority: aiResponse.priority || 'High',
            extractedInfo: aiResponse.extractedInfo || {},
            sentiment: aiResponse.sentiment || 'calm',
            urgencyScore: aiResponse.urgencyScore || 5
        };

    } catch (error) {
        console.error('AI Service Error:', error.message);
        // Fallback to rule-based system
        return fallbackAnalysis(conversation, userMessage);
    }
};

/**
 * Fallback rule-based analysis when AI is unavailable
 */
const fallbackAnalysis = (conversation, userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const conversationStep = conversation.filter(c => c.sender === 'User').length;
    
    // Detect critical keywords
    const criticalKeywords = ['heart attack', 'unconscious', 'not breathing', 'severe bleeding', 'choking', 'stroke', 'seizure'];
    const isCritical = criticalKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Extract information using simple patterns
    const extractedInfo = {
        name: extractName(conversation, userMessage),
        location: extractLocation(conversation, userMessage),
        emergencyType: extractEmergencyType(lowerMessage),
        symptoms: extractSymptoms(lowerMessage),
        contactNumber: extractPhoneNumber(userMessage)
    };

    // Determine response based on conversation step
    let response = fallbackResponses.askDetails;
    let shouldRoute = false;
    
    if (conversationStep === 0) {
        response = fallbackResponses.greeting;
    } else if (!extractedInfo.name && conversationStep === 1) {
        response = fallbackResponses.askName;
    } else if (!extractedInfo.location && conversationStep === 2) {
        response = fallbackResponses.askLocation;
    } else if (isCritical || conversationStep >= 4) {
        response = fallbackResponses.routing;
        shouldRoute = true;
    } else {
        response = fallbackResponses.askDetails;
    }

    // Determine priority
    let priority = 'High';
    if (isCritical) {
        priority = 'Critical';
    } else if (lowerMessage.includes('urgent') || lowerMessage.includes('immediate')) {
        priority = 'High';
    }

    return {
        response,
        shouldRoute: shouldRoute || isCritical,
        priority,
        extractedInfo,
        sentiment: isCritical ? 'panicked' : 'calm',
        urgencyScore: isCritical ? 10 : 7
    };
};

// Helper functions for extraction
const extractName = (conversation, message) => {
    // Simple pattern: "my name is X" or "I'm X" or "this is X"
    const patterns = [
        /(?:my name is|i'm|i am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/
    ];
    
    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) return match[1].trim();
    }
    
    return null;
};

const extractLocation = (conversation, message) => {
    // Look for location indicators
    const locationKeywords = ['at', 'located', 'address', 'near', 'in'];
    const hasLocationKeyword = locationKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    if (hasLocationKeyword || message.length > 10) {
        // Return the message if it seems like a location
        return message.trim();
    }
    
    return null;
};

const extractEmergencyType = (message) => {
    if (message.includes('accident') || message.includes('crash') || message.includes('collision')) {
        return 'Accident';
    } else if (message.includes('fire') || message.includes('smoke')) {
        return 'Fire';
    } else if (message.includes('medical') || message.includes('sick') || message.includes('pain')) {
        return 'Medical';
    }
    return 'Other';
};

const extractSymptoms = (message) => {
    const commonSymptoms = [
        'chest pain', 'shortness of breath', 'dizziness', 'nausea', 'vomiting',
        'fever', 'headache', 'bleeding', 'unconscious', 'seizure', 'stroke'
    ];
    
    return commonSymptoms.filter(symptom => message.includes(symptom));
};

const extractPhoneNumber = (message) => {
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = message.match(phonePattern);
    return match ? match[0] : null;
};

/**
 * Generate a summary of the emergency call
 */
const generateSummary = (conversation, extractedInfo) => {
    const callerName = extractedInfo.name || 'Anonymous';
    const location = extractedInfo.location || 'Unknown';
    const emergencyType = extractedInfo.emergencyType || 'Medical';
    const symptoms = extractedInfo.symptoms?.join(', ') || 'Not specified';
    
    return `Emergency reported by ${callerName}. Type: ${emergencyType}. Location: ${location}. Symptoms: ${symptoms}. Contact: ${extractedInfo.contactNumber || 'Not provided'}`;
};

export {
    analyzeEmergencyConversation,
    generateSummary,
    fallbackResponses
};
