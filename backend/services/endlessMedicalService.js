import axios from "axios";
import https from "https";

class EndlessMedicalService {
  constructor() {
    // Try alternative endpoints if main one fails
    this.baseURL = "https://api.endlessmedical.com/v1/dx";
    this.alternativeBaseURL = "https://endlessmedical.com/api/v1/dx"; // Alternative endpoint
    this.sessions = new Map(); // Store active sessions;
    
    // Create axios instance with SSL workaround for expired certificates
    // WARNING: This bypasses SSL verification - use only as temporary workaround
    // TODO: Remove this when EndlessMedical renews their SSL certificate
    console.warn("⚠️  WARNING: SSL certificate verification is disabled for EndlessMedical API due to expired certificate. This is a temporary workaround.");
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Temporarily bypass SSL verification
      }),
      timeout: 30000,
      validateStatus: function (status) {
        // Don't throw for any status, we'll handle it manually
        return status >= 200 && status < 600;
      },
    });
  }

  /**
   * Initialize a new diagnostic session
   * @param {string} userId - User ID to track session
   * @returns {Promise<{success: boolean, sessionId: string}>}
   */
  async initSession(userId, useAlternative = false) {
    const baseURL = useAlternative ? this.alternativeBaseURL : this.baseURL;
    
    try {
      console.log(`Attempting to initialize EndlessMedical session (${useAlternative ? 'alternative' : 'primary'} endpoint)...`);
      const response = await this.axiosInstance.post(
        `${baseURL}/InitSession`,
        {},
        {
          timeout: 30000,
        }
      );

      console.log("InitSession response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataType: typeof response.data,
        headers: response.headers
      });

      // Check for error status codes
      if (response.status >= 400) {
        let errorMsg = `HTTP ${response.status} ${response.statusText || ''}`;
        
        // Try to extract error message from response
        if (response.data) {
          if (typeof response.data === 'string') {
            errorMsg = response.data;
          } else if (response.data.Error) {
            errorMsg = response.data.Error;
          } else if (response.data.error) {
            errorMsg = response.data.error;
          } else if (response.data.message) {
            errorMsg = response.data.message;
          } else {
            errorMsg = JSON.stringify(response.data);
          }
        }
        
        // Try alternative endpoint if primary fails with server error (but not for 502/503 as they indicate service is down)
        if (!useAlternative && response.status >= 500 && response.status !== 502 && response.status !== 503) {
          console.log("Primary endpoint failed with server error, trying alternative endpoint...");
          try {
            return await this.initSession(userId, true);
          } catch (altError) {
            // If alternative also fails, throw original error
            throw new Error(`EndlessMedical API returned error ${response.status}: ${errorMsg}. Both primary and alternative endpoints failed.`);
          }
        }
        
        // For 502/503, don't retry alternative as service is clearly down
        if (response.status === 502 || response.status === 503) {
          throw new Error(`The medical assessment service is currently unavailable (${response.status}). The service provider's servers appear to be down. Please try again later.`);
        }
        
        throw new Error(`EndlessMedical API returned error ${response.status}: ${errorMsg}`);
      }

      if (!response.data) {
        throw new Error("Empty response from EndlessMedical API");
      }

      // Handle different response formats
      const sessionId = response.data.SessionID || response.data.sessionID || response.data.SessionId;
      
      if (!sessionId) {
        console.error("Response data:", JSON.stringify(response.data, null, 2));
        throw new Error(`Invalid response from EndlessMedical API: Missing SessionID. Response: ${JSON.stringify(response.data)}`);
      }

      // Store session with expiry
      this.sessions.set(userId, {
        sessionId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
      });

      console.log("Medical session initialized successfully:", sessionId);
      return { success: true, sessionId };
    } catch (error) {
      const errorDetails = {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
      };
      
      console.error("Session initialization failed - Full error details:", JSON.stringify(errorDetails, null, 2));
      
      // Handle SSL certificate errors
      if (error.code === 'CERT_HAS_EXPIRED' || error.message.includes('certificate has expired')) {
        throw new Error("The medical assessment service certificate has expired. This is a service provider issue. Please contact support or try again later.");
      } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || error.code === 'CERT_SIGNATURE_FAILURE') {
        throw new Error("Unable to verify the medical assessment service certificate. Please try again later.");
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error("Cannot connect to medical assessment service. The service may be down. Please try again later.");
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error("Connection to medical assessment service timed out. Please try again.");
      } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
        throw new Error("Cannot resolve medical assessment service hostname. Please check your internet connection.");
      } else if (error.response?.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      } else if (error.response?.status === 404) {
        throw new Error("Medical assessment service endpoint not found. The API may have changed.");
      } else if (error.response?.status === 502) {
        throw new Error("The medical assessment service is currently unavailable (502 Bad Gateway). The service provider's servers appear to be down or unreachable. Please try again later or contact support.");
      } else if (error.response?.status === 503) {
        throw new Error("The medical assessment service is temporarily unavailable (503 Service Unavailable). The service may be under maintenance. Please try again later.");
      } else if (error.response?.status >= 500) {
        // Try to extract more detailed error information
        let errorMsg = "Unknown server error";
        if (error.response?.data) {
          if (typeof error.response.data === 'string') {
            // Check if it's an HTML error page (like 502 Bad Gateway)
            if (error.response.data.includes('<html>') || error.response.data.includes('Bad Gateway')) {
              errorMsg = "Service unavailable - server error";
            } else {
              errorMsg = error.response.data.substring(0, 200); // Limit length
            }
          } else if (error.response.data.Error) {
            errorMsg = error.response.data.Error;
          } else if (error.response.data.error) {
            errorMsg = error.response.data.error;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else {
            errorMsg = "Server error - service may be down";
          }
        }
        throw new Error(`Medical assessment service error (${error.response.status}): ${errorMsg}. The service may be experiencing issues. Please try again later.`);
      } else if (error.response?.status >= 400) {
        const errorMsg = error.response?.data?.Error || error.response?.data?.error || error.response?.data?.message || "Bad request";
        throw new Error(`Medical assessment service returned an error: ${errorMsg}`);
      } else if (error.response) {
        throw new Error(`Unexpected response from medical assessment service: ${error.response.status} ${error.response.statusText}`);
      }
      
      throw new Error(`Failed to initialize medical session: ${error.message}`);
    }
  }

  /**
   * Accept EndlessMedical API terms of use
   * @param {string} sessionId - Active session ID
   * @returns {Promise<{success: boolean}>}
   */
  async acceptTerms(sessionId) {
    try {
      const params = new URLSearchParams({
        SessionID: sessionId,
        passphrase:
          "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI.",
      });

      const response = await this.axiosInstance.post(`${this.baseURL}/AcceptTermsOfUse`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Check for error in response
      if (response.data && response.data.Error) {
        throw new Error(response.data.Error);
      }

      console.log("Terms accepted for session:", sessionId);
      return { success: true };
    } catch (error) {
      console.error("Terms acceptance failed:", {
        message: error.message,
        response: error.response?.data,
        sessionId
      });
      throw new Error(`Failed to accept terms: ${error.response?.data?.Error || error.message}`);
    }
  }

  /**
   * Update a feature (symptom, demographic, etc.)
   * @param {string} sessionId - Active session ID
   * @param {string} featureName - Name of feature (e.g., 'Age', 'Headache')
   * @param {string} featureValue - Value of feature (e.g., '35', 'true')
   * @returns {Promise<{success: boolean}>}
   */
  async updateFeature(sessionId, featureName, featureValue) {
    try {
      const params = new URLSearchParams({
        SessionID: sessionId,
        name: featureName,
        value: String(featureValue),
      });

      const response = await this.axiosInstance.post(`${this.baseURL}/UpdateFeature`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Check for error status codes
      if (response.status >= 400) {
        const errorMsg = response.data?.Error || response.data?.error || response.data?.message || response.statusText || `HTTP ${response.status}`;
        throw new Error(`Failed to update ${featureName}: ${errorMsg}`);
      }

      // Check for error in response data
      if (response.data && response.data.Error) {
        console.warn(`Feature update warning for ${featureName}:`, response.data.Error);
        // Don't throw for warnings, but log them
      }

      return { success: true };
    } catch (error) {
      console.error(`Feature update failed for ${featureName}:`, {
        message: error.message,
        response: error.response?.data,
        featureName,
        featureValue
      });
      
      // If it's an invalid feature name, provide helpful message
      if (error.response?.data?.Error && error.response.data.Error.includes("Invalid")) {
        throw new Error(`Invalid symptom or feature: "${featureName}". Please use standard medical symptom names.`);
      }
      
      throw new Error(`Failed to update ${featureName}: ${error.response?.data?.Error || error.message}`);
    }
  }

  /**
   * Analyze symptoms and get preliminary diagnoses
   * @param {string} sessionId - Active session ID
   * @param {number} numberOfResults - Number of diagnoses to return (default: 10)
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async analyze(sessionId, numberOfResults = 10) {
    try {
      const params = new URLSearchParams({
        SessionID: sessionId,
        NumberOfResults: String(numberOfResults),
      });

      const response = await this.axiosInstance.post(`${this.baseURL}/Analyze`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 60000, // Increased timeout for analysis
      });

      console.log("Analyze response:", {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data
      });

      // Check for error status codes
      if (response.status >= 400) {
        const errorMsg = response.data?.Error || response.data?.error || response.data?.message || response.statusText || `HTTP ${response.status}`;
        throw new Error(`Analysis failed: ${errorMsg}`);
      }

      // Check for error in response data
      if (response.data && response.data.Error) {
        throw new Error(response.data.Error);
      }

      // Validate response structure
      if (!response.data || (!response.data.Diseases && !Array.isArray(response.data.Diseases))) {
        console.warn("Unexpected response structure:", response.data);
        // Return empty diseases array if structure is unexpected
        return { 
          success: true, 
          data: { 
            Diseases: [],
            ...response.data 
          } 
        };
      }

      console.log("Analysis completed for session:", sessionId);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Analysis failed:", {
        message: error.message,
        response: error.response?.data,
        sessionId
      });
      
      if (error.response?.data?.Error) {
        throw new Error(`Analysis failed: ${error.response.data.Error}`);
      }
      
      throw new Error(`Failed to analyze symptoms: ${error.message}`);
    }
  }

  /**
   * Get detailed diagnosis information
   * @param {string} sessionId - Active session ID
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async getDiagnosis(sessionId) {
    try {
      const params = new URLSearchParams({
        SessionID: sessionId,
      });

      const response = await this.axiosInstance.post(
        `${this.baseURL}/GetDiagnosis`,
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Diagnosis retrieval failed:", error.message);
      throw new Error("Failed to get diagnosis");
    }
  }

  /**
   * Complete workflow: Initialize, accept terms, add patient data, analyze
   * @param {string} userId - User ID
   * @param {Object} patientData - Patient information
   * @param {number} patientData.age - Patient age
   * @param {string} patientData.gender - Patient gender ('Male' or 'Female')
   * @param {string[]} patientData.symptoms - Array of symptom names
   * @returns {Promise<Object>} Assessment results
   */
  async completeAssessment(userId, patientData) {
    let sessionId = null;

    try {
      console.log("Starting medical assessment for user:", userId);

      // Step 1: Initialize session
      const session = await this.initSession(userId);
      sessionId = session.sessionId;

      // Step 2: Accept terms
      await this.acceptTerms(sessionId);

      // Step 3: Update demographics
      if (patientData.age) {
        await this.updateFeature(sessionId, "Age", patientData.age);
      }

      if (patientData.gender) {
        await this.updateFeature(sessionId, "Gender", patientData.gender);
      }

      // Step 4: Add symptoms (normalize symptom names)
      if (patientData.symptoms && patientData.symptoms.length > 0) {
        for (const symptom of patientData.symptoms) {
          // Normalize symptom name: capitalize first letter, handle spaces
          const normalizedSymptom = symptom
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          try {
            await this.updateFeature(sessionId, normalizedSymptom, "true");
          } catch (symptomError) {
            // Log but continue with other symptoms
            console.warn(`Failed to add symptom "${symptom}":`, symptomError.message);
            // Try with original case if normalized failed
            if (normalizedSymptom !== symptom) {
              try {
                await this.updateFeature(sessionId, symptom, "true");
              } catch (retryError) {
                console.warn(`Failed to add symptom "${symptom}" (retry):`, retryError.message);
              }
            }
          }
        }
      }

      // Step 5: Analyze
      const analysisResult = await this.analyze(sessionId, 10);

      // Step 6: Get detailed diagnosis if results exist
      let diagnosisResult = null;
      if (
        analysisResult.data.Diseases &&
        analysisResult.data.Diseases.length > 0
      ) {
        try {
          diagnosisResult = await this.getDiagnosis(sessionId);
        } catch (diagError) {
          console.log("Diagnosis details not available:", diagError.message);
        }
      }

      console.log("Medical assessment completed successfully");

      return {
        success: true,
        sessionId,
        analysis: analysisResult.data,
        diagnosis: diagnosisResult ? diagnosisResult.data : null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Complete assessment failed:", error.message);
      throw error;
    }
  }

  /**
   * Clean up expired sessions
   */
  cleanupSessions() {
    const now = new Date();
    for (const [userId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(userId);
        console.log("Cleaned up expired session for user:", userId);
      }
    }
  }

  /**
   * Get session for a user
   * @param {string} userId - User ID
   * @returns {Object|null} Session object or null
   */
  getSession(userId) {
    return this.sessions.get(userId) || null;
  }
}

// Create singleton instance
const endlessMedicalService = new EndlessMedicalService();

// Clean up expired sessions every 15 minutes
setInterval(() => {
  endlessMedicalService.cleanupSessions();
}, 15 * 60 * 1000);

export default endlessMedicalService;
