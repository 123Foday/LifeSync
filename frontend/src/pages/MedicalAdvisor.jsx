import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MedicalAdvisor = () => {
  const { token, backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [step, setStep] = useState("info"); // 'info', 'symptoms', 'results'
  const [loading, setLoading] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
  });

  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Common symptoms for quick selection
  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Abdominal Pain",
    "Muscle Pain",
    "Sore Throat",
    "Runny Nose",
    "Loss of Appetite",
    "Vomiting",
    "Diarrhea",
    "Back Pain",
    "Joint Pain",
    "Weakness",
  ];

  // Calculate age from DOB - memoized for performance
  const calculatedAge = useMemo(() => {
    if (userData?.dob && userData.dob !== "Not Selected") {
      try {
        const birthDate = new Date(userData.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age > 0 ? age.toString() : "";
      } catch (error) {
        return "";
      }
    }
    return "";
  }, [userData?.dob]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Auto-sync patient info from profile and check for missing data
  useEffect(() => {
    if (userData) {
      const missing = [];
      let age = "";
      let gender = "";

      // Check and calculate age
      if (calculatedAge) {
        age = calculatedAge;
      } else {
        missing.push("Date of Birth");
      }

      // Check gender
      if (userData.gender && userData.gender !== "Not Selected") {
        gender = userData.gender;
      } else {
        missing.push("Gender");
      }

      // Auto-fill form data
      setFormData((prev) => ({
        ...prev,
        age: age || prev.age,
        gender: gender || prev.gender,
      }));

      // Show prompt if data is missing
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowProfilePrompt(true);
      } else {
        setShowProfilePrompt(false);
        setMissingFields([]);
      }
    }
  }, [userData, calculatedAge]);

  // Lazy load history only when needed (when viewing results or history section)
  const loadHistory = async () => {
    if (historyLoaded) return; // Prevent duplicate loads
    
    try {
      setHistoryLoaded(true);
      const { data } = await axios.get(`${backendUrl}/api/medical/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setHistory(data.assessments);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      setHistoryLoaded(false); // Allow retry on error
    }
  };

  // Load history when step changes to results
  useEffect(() => {
    if (step === "results" && !historyLoaded && token) {
      loadHistory();
    }
  }, [step, historyLoaded, token]);

  const handleAddSymptom = (symptom) => {
    if (symptom.trim() && !symptoms.includes(symptom.trim())) {
      setSymptoms([...symptoms, symptom.trim()]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleContinue = () => {
    if (!formData.age || !formData.gender) {
      toast.error("Please fill in all required fields");
      // Show profile prompt if data is missing
      const missing = [];
      if (!formData.age) missing.push("Date of Birth");
      if (!formData.gender) missing.push("Gender");
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowProfilePrompt(true);
      }
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0 || age > 120) {
      toast.error("Please enter a valid age");
      return;
    }

    setStep("symptoms");
  };

  const handleEditProfile = () => {
    navigate("/my-profile");
    setShowProfilePrompt(false);
  };

  const handleSkipPrompt = () => {
    setShowProfilePrompt(false);
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/medical/assess`,
        {
          age: parseInt(formData.age),
          gender: formData.gender,
          symptoms,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 90000, // 90 second timeout for assessment
        }
      );

      if (data.success) {
        // Ensure diseases array exists and is properly formatted
        const formattedResults = {
          ...data.data,
          diseases: data.data.diseases || [],
          timestamp: data.data.timestamp || new Date().toISOString(),
          source: data.data.source || "primary",
        };
        
        setResults(formattedResults);
        setStep("results");
        
        // Show appropriate success message
        if (data.data.source === "fallback") {
          toast.info("Assessment completed using fallback service. Primary service is currently unavailable.", {
            autoClose: 5000,
          });
        } else {
          toast.success("Assessment completed!");
        }
        
        loadHistory(); // Refresh history
      } else {
        toast.error(data.message || "Assessment failed");
      }
    } catch (error) {
      console.error("Assessment error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        backendUrl: backendUrl
      });
      
      // Provide more specific error messages
      let errorMessage = "Failed to complete assessment. Please try again.";
      
      // Check if backend is reachable
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
        errorMessage = `Cannot connect to backend server. Please ensure the backend is running at ${backendUrl || 'http://localhost:4000'}. The fallback assessment system requires the backend to be running.`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = "Assessment is taking longer than expected. The backend will try using a fallback method automatically.";
      } else if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
        errorMessage = "The medical assessment service is currently unavailable. The system will automatically use a fallback method.";
      } else if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
        errorMessage = "The medical assessment service is temporarily unavailable. The system will automatically use a fallback method.";
      } else if (error.message.includes('unavailable') || error.message.includes('down')) {
        errorMessage = error.message; // Use the detailed message from backend
      } else if (error.response?.status === 500) {
        errorMessage = "Backend server error. The system should automatically use a fallback assessment method. Please try again.";
      }
      
      toast.error(errorMessage, {
        autoClose: 8000, // Longer display for important errors
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("info");
    setSymptoms([]);
    setResults(null);
    // Keep age and gender from profile
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      {/* Profile Data Missing Prompt */}
      {showProfilePrompt && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-2">
                ⚠️ Missing Profile Information
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                To provide accurate health assessments, please update your profile with the following information:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700 mb-3">
                {missingFields.map((field, idx) => (
                  <li key={idx} className="dark:text-blue-300">{field}</li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={handleEditProfile}
                  className="bg-[#5f6FFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4f5fef] transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleSkipPrompt}
                  className="bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
            <button
              onClick={handleSkipPrompt}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-4"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          🏥 Medical Health Advisor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-Powered Preliminary Health Assessment
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-1">
              Medical Disclaimer
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              This is a preliminary assessment tool only. Results are NOT a
              diagnosis. Always consult with a qualified healthcare professional
              for medical advice, diagnosis, and treatment. In case of
              emergency, call emergency services immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#121212] rounded-xl shadow-lg dark:shadow-none p-6 md:p-8 mb-8 border dark:border-gray-800">
        {/* Step 1: Patient Information */}
        {step === "info" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Patient Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
                {formData.age && calculatedAge && formData.age === calculatedAge && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    (Synced from profile)
                  </span>
                )}
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-900 dark:text-white"
                placeholder="Enter your age"
                min="0"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
                {formData.gender && userData?.gender && formData.gender === userData.gender && userData.gender !== "Not Selected" && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    (Synced from profile)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      formData.gender === g
                        ? "bg-[#5f6FFF] text-white shadow-lg"
                        : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-[#5f6FFF] text-white py-3 rounded-lg font-semibold hover:bg-[#4f5fef] transition"
            >
              Continue to Symptoms
            </button>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {step === "symptoms" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Select Symptoms
              </h2>
              <button
                onClick={() => setStep("info")}
                className="text-[#5f6FFF] hover:text-[#4f5fef] font-medium"
              >
                ← Back
              </button>
            </div>

            {/* Custom Symptom Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Add Custom Symptom
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddSymptom(symptomInput)
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-900 dark:text-white"
                  placeholder="Type a symptom and press Enter"
                />
                <button
                  onClick={() => handleAddSymptom(symptomInput)}
                  className="px-6 py-3 bg-[#5f6FFF] text-white rounded-lg hover:bg-[#4f5fef] transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Common Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Common Symptoms (click to add)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleAddSymptom(symptom)}
                    disabled={symptoms.includes(symptom)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      symptoms.includes(symptom)
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms */}
            {symptoms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selected Symptoms ({symptoms.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      ✓ {symptom}
                      <button
                        onClick={() => handleRemoveSymptom(symptom)}
                        className="ml-2 text-blue-600 hover:text-blue-900 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || symptoms.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                "🔍 Analyze Symptoms"
              )}
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Assessment Results
              </h2>
              <span className="text-sm text-gray-500">
                {formatDate(results.timestamp)}
              </span>
            </div>

            {/* Fallback Service Notice */}
            {results.source === "fallback" && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <span className="text-xl mr-3">ℹ️</span>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">
                      Using Fallback Assessment Service
                    </h3>
                    <p className="text-sm text-blue-700">
                      The primary medical assessment service is currently unavailable. 
                      This assessment was generated using an alternative AI-based system. 
                      Results are still preliminary and should be verified with a healthcare professional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Patient Profile
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Age:</span>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {formData.age} years
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-400">Gender:</span>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {formData.gender}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-400">Symptoms:</span>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {symptoms.length} reported
                  </p>
                </div>
              </div>
            </div>

            {/* Possible Conditions */}
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                📊 Possible Conditions (ranked by likelihood)
              </h3>

              {results.diseases && results.diseases.length > 0 ? (
                <div className="space-y-3">
                  {results.diseases.map((disease, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-900 rounded-lg p-4 border border-purple-100 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">
                              #{idx + 1}
                            </span>
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {disease.name}
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {(disease.probability * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            probability
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${disease.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    No specific conditions identified with the provided
                    symptoms.
                  </p>
                  <p className="text-sm mt-2">
                    Please consult a healthcare professional for evaluation.
                  </p>
                </div>
              )}
            </div>

            {/* Symptoms Review */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Reported Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="bg-white dark:bg-zinc-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 dark:bg-zinc-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-zinc-700 transition"
              >
                New Assessment
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#5f6FFF] text-white py-3 rounded-lg font-semibold hover:bg-[#4f5fef] transition"
              >
                Print Results
              </button>
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Next Steps</h4>
              <p className="text-sm text-red-700">
                These results are for informational purposes only. Please
                consult with a healthcare professional for proper medical
                evaluation and treatment recommendations. If you're experiencing
                severe symptoms, seek immediate medical attention.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Assessment History - Lazy loaded */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-lg dark:shadow-none p-6 md:p-8 border dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Assessments
            </h2>
            <button
              onClick={loadHistory}
              className="text-sm text-[#5f6FFF] hover:text-[#4f5fef] font-medium"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {history.slice(0, 5).map((assessment) => (
              <div
                key={assessment.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {assessment.age} years old, {assessment.gender}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(assessment.date)}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {assessment.symptoms.length} symptoms
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Top condition: {assessment.diseases[0]?.name || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAdvisor;
