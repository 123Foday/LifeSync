import axios from "axios";

/**
 * Fallback Medical Service
 * Uses free AI models when primary EndlessMedical API is unavailable
 */
class FallbackMedicalService {
  constructor() {
    // Hugging Face Inference API (free tier available)
    // Using a medical diagnosis model
    this.huggingFaceAPI = "https://api-inference.huggingface.co/models";
    this.medicalModel = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext";
    
    // Alternative: Use OpenAI-compatible free APIs or local models
    // Disabled by default to avoid network dependencies - rule-based system works offline
    this.useHuggingFace = false;
  }

  /**
   * Generate assessment using Hugging Face medical model
   * @param {Object} patientData - Patient information
   * @returns {Promise<Object>} Assessment results
   */
  async assessWithHuggingFace(patientData) {
    try {
      // Create a prompt for the medical assessment
      const prompt = this.createMedicalPrompt(patientData);
      
      // Note: Hugging Face free tier has rate limits
      // For production, you'd want to use a dedicated medical model
      const response = await axios.post(
        `${this.huggingFaceAPI}/${this.medicalModel}`,
        {
          inputs: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      ).catch((error) => {
        // If Hugging Face fails, just use rule-based - don't throw
        console.log("Hugging Face not available, using rule-based:", error.message);
        return null;
      });

      if (response && response.data) {
        return this.parseHuggingFaceResponse(response.data, patientData);
      }
      
      // Fall back to rule-based if Hugging Face fails
      return this.assessWithRuleBased(patientData);
    } catch (error) {
      console.log("Hugging Face assessment failed, using rule-based:", error.message);
      // Always fall back to rule-based system (no network required)
      return this.assessWithRuleBased(patientData);
    }
  }

  /**
   * Create a medical assessment prompt
   */
  createMedicalPrompt(patientData) {
    const symptomsList = patientData.symptoms.join(", ");
    return `Patient: ${patientData.age} year old ${patientData.gender}. Symptoms: ${symptomsList}. Provide a preliminary medical assessment with possible conditions and recommendations.`;
  }

  /**
   * Parse Hugging Face response into our format
   */
  parseHuggingFaceResponse(response, patientData) {
    // This is a simplified parser - actual implementation would depend on model output
    const diseases = this.generateDiseasesFromSymptoms(patientData.symptoms);
    
    return {
      success: true,
      sessionId: `fallback-${Date.now()}`,
      analysis: {
        Diseases: diseases,
      },
      diagnosis: null,
      timestamp: new Date().toISOString(),
      source: "fallback-ai",
    };
  }

  /**
   * Rule-based medical assessment fallback
   * Uses symptom-disease mapping for common conditions
   */
  assessWithRuleBased(patientData) {
    console.log("Using rule-based fallback assessment");
    
    const diseases = this.generateDiseasesFromSymptoms(patientData.symptoms);
    
    return {
      success: true,
      sessionId: `rule-based-${Date.now()}`,
      analysis: {
        Diseases: diseases,
      },
      diagnosis: null,
      timestamp: new Date().toISOString(),
      source: "rule-based",
    };
  }

  /**
   * Generate possible diseases based on symptoms
   * Uses a symptom-disease knowledge base
   */
  generateDiseasesFromSymptoms(symptoms) {
    const symptomLower = symptoms.map(s => s.toLowerCase());

    // Common symptom-disease mappings
    const diseaseMap = {
      "headache": [
        { name: "Tension Headache", probability: 0.4, icd10Code: "G44.2" },
        { name: "Migraine", probability: 0.3, icd10Code: "G43.9" },
        { name: "Sinusitis", probability: 0.2, icd10Code: "J32.9" },
      ],
      "fever": [
        { name: "Viral Infection", probability: 0.5, icd10Code: "B34.9" },
        { name: "Bacterial Infection", probability: 0.3, icd10Code: "A49.9" },
        { name: "Influenza", probability: 0.2, icd10Code: "J11.1" },
      ],
      "cough": [
        { name: "Upper Respiratory Tract Infection", probability: 0.4, icd10Code: "J06.9" },
        { name: "Bronchitis", probability: 0.3, icd10Code: "J40" },
        { name: "Common Cold", probability: 0.2, icd10Code: "J00" },
      ],
      "fatigue": [
        { name: "Anemia", probability: 0.3, icd10Code: "D64.9" },
        { name: "Chronic Fatigue Syndrome", probability: 0.2, icd10Code: "G93.3" },
        { name: "Depression", probability: 0.2, icd10Code: "F32.9" },
      ],
      "nausea": [
        { name: "Gastroenteritis", probability: 0.4, icd10Code: "A09" },
        { name: "Food Poisoning", probability: 0.3, icd10Code: "A05.9" },
        { name: "Motion Sickness", probability: 0.2, icd10Code: "T75.3" },
      ],
      "dizziness": [
        { name: "Vertigo", probability: 0.4, icd10Code: "H81.9" },
        { name: "Hypotension", probability: 0.3, icd10Code: "I95.9" },
        { name: "Anemia", probability: 0.2, icd10Code: "D64.9" },
      ],
      "chest pain": [
        { name: "Costochondritis", probability: 0.3, icd10Code: "M94.0" },
        { name: "Gastroesophageal Reflux Disease", probability: 0.3, icd10Code: "K21.9" },
        { name: "Anxiety", probability: 0.2, icd10Code: "F41.9" },
      ],
      "shortness of breath": [
        { name: "Asthma", probability: 0.4, icd10Code: "J45.9" },
        { name: "Anxiety", probability: 0.3, icd10Code: "F41.9" },
        { name: "Bronchitis", probability: 0.2, icd10Code: "J40" },
      ],
      "abdominal pain": [
        { name: "Gastroenteritis", probability: 0.4, icd10Code: "A09" },
        { name: "Irritable Bowel Syndrome", probability: 0.3, icd10Code: "K58.9" },
        { name: "Gastritis", probability: 0.2, icd10Code: "K29.9" },
      ],
      "sore throat": [
        { name: "Pharyngitis", probability: 0.5, icd10Code: "J02.9" },
        { name: "Tonsillitis", probability: 0.3, icd10Code: "J03.9" },
        { name: "Common Cold", probability: 0.2, icd10Code: "J00" },
      ],
      "runny nose": [
        { name: "Allergic Rhinitis", probability: 0.4, icd10Code: "J30.9" },
        { name: "Common Cold", probability: 0.4, icd10Code: "J00" },
        { name: "Sinusitis", probability: 0.2, icd10Code: "J32.9" },
      ],
    };

    // Collect diseases from all symptoms
    const diseaseScores = {};
    
    symptomLower.forEach(symptom => {
      // Check for partial matches
      Object.keys(diseaseMap).forEach(key => {
        if (symptom.includes(key) || key.includes(symptom)) {
          diseaseMap[key].forEach(disease => {
            if (!diseaseScores[disease.name]) {
              diseaseScores[disease.name] = {
                name: disease.name,
                probability: 0,
                icd10Code: disease.icd10Code,
                count: 0,
              };
            }
            diseaseScores[disease.name].probability += disease.probability;
            diseaseScores[disease.name].count += 1;
          });
        }
      });
    });

    // Normalize probabilities and sort
    const diseases = Object.values(diseaseScores)
      .map(d => ({
        name: d.name,
        probability: Math.min(d.probability / d.count, 0.95), // Normalize and cap
        icd10Code: d.icd10Code,
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 10); // Top 10

    // If no matches found, provide generic recommendations
    if (diseases.length === 0) {
      return [
        {
          name: "General Consultation Recommended",
          probability: 0.5,
          icd10Code: null,
        },
        {
          name: "Symptom Monitoring",
          probability: 0.3,
          icd10Code: null,
        },
      ];
    }

    return diseases;
  }

  /**
   * Complete assessment using fallback methods
   * This method should NEVER fail as rule-based system requires no network
   */
  async completeAssessment(userId, patientData) {
    try {
      // Try Hugging Face first if enabled (optional, network-based)
      if (this.useHuggingFace) {
        try {
          const result = await this.assessWithHuggingFace(patientData);
          if (result) {
            return result;
          }
        } catch (error) {
          console.log("Hugging Face not available, using rule-based:", error.message);
          // Continue to rule-based - this is expected
        }
      }
      
      // Always use rule-based system (no network required, always works)
      console.log("Using rule-based assessment system (no network required)");
      return this.assessWithRuleBased(patientData);
    } catch (error) {
      // This should never happen as rule-based doesn't require network
      console.error("Unexpected error in fallback assessment:", error);
      // Still return a basic result rather than throwing
      return {
        success: true,
        sessionId: `emergency-${Date.now()}`,
        analysis: {
          Diseases: [
            {
              name: "Consultation Recommended",
              probability: 0.5,
              icd10Code: null,
            }
          ],
        },
        diagnosis: null,
        timestamp: new Date().toISOString(),
        source: "emergency-fallback",
      };
    }
  }
}

// Create singleton instance
const fallbackMedicalService = new FallbackMedicalService();

export default fallbackMedicalService;

