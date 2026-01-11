import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react-native";
import { AppContext } from "@/context/AppContext";
import { assets } from "@/assets/images/assets";

const Login = () => {
  const router = useRouter();
  const { backendUrl, setToken, token } = useContext(AppContext);

  const [state, setState] = useState<"Login" | "Sign Up" | "Verify" | "Forgot Password">("Login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.replace("/(tabs)");
    }
  }, [token]);

  const onVerifyHandler = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/user/verify-otp", {
        email,
        otp,
      });

      if (data.success) {
        setToken(data.token);
        Alert.alert("Success", "Verified successfully!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/user/resend-otp", {
        email,
      });

      if (data.success) {
        Alert.alert("Success", "Code resent!");
        setResendTimer(60);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordHandler = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/user/forgot-password", {
        email,
      });

      if (data.success) {
        Alert.alert("Success", data.message || "Reset link sent!");
        setState("Login");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send link");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitHandler = async () => {
    // Validation
    if (state === "Sign Up" && !agreedToTerms) {
      Alert.alert("Error", "Please agree to the Terms & Conditions");
      return;
    }

    if (state === "Sign Up" && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (state === "Verify") {
      onVerifyHandler();
      return;
    }

    if (state === "Forgot Password") {
      onForgotPasswordHandler();
      return;
    }

    if (!email || !password || (state === "Sign Up" && !name)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          Alert.alert("Success", data.message || "Please verify your email.");
          setState("Verify");
          setConfirmPassword("");
          setAgreedToTerms(false);
        } else {
          Alert.alert("Error", data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          Alert.alert("Success", "Login successful!");
          router.replace("/(tabs)");
        } else {
          if (data.needsVerification) {
            Alert.alert("Verification Required", "Please verify your email.");
            setState("Verify");
          } else {
            Alert.alert("Error", data.message);
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleStateChange = (newState: "Login" | "Sign Up" | "Verify" | "Forgot Password") => {
      setState(newState);
      setConfirmPassword("");
      setAgreedToTerms(false);
      setOtp("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sliding Toggle */}
        <View style={[styles.toggleContainer, (state === "Verify" || state === "Forgot Password") && { opacity: 0, height: 0, marginBottom: 0 }]}>
          <View style={[styles.slider, state === "Sign Up" ? styles.sliderRight : styles.sliderLeft]} />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => handleStateChange("Login")}
            activeOpacity={0.8}
            disabled={state === "Verify"}
          >
            <Text style={[styles.toggleText, state === "Login" ? styles.activeText : styles.inactiveText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => handleStateChange("Sign Up")}
            activeOpacity={0.8}
            disabled={state === "Verify"}
          >
            <Text style={[styles.toggleText, state === "Sign Up" ? styles.activeText : styles.inactiveText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{state === "Verify" ? "Verify Email" : state === "Forgot Password" ? "Reset Password" : (state === "Sign Up" ? "Create Account" : "Welcome Back")}</Text>
            <Text style={styles.headerSubtitle}>
                {state === "Verify"
                ? `Enter the 6-digit code sent to ${email}`
                : state === "Forgot Password"
                ? "Enter your email to receive a password reset link"
                : (state === "Login"
                  ? "Login to book appointments and manage your health"
                  : "Sign up to get started with LifeSync")}
            </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {state === "Sign Up" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A1A1AA"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          {state !== "Verify" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#A1A1AA"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}

          {state === "Verify" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>6-Digit Code</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="000000"
                placeholderTextColor="#A1A1AA"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          )}

          {state !== "Verify" && state !== "Forgot Password" && (
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.label}>Password</Text>
                {state === "Login" && (
                  <TouchableOpacity onPress={() => setState("Forgot Password")}>
                    <Text style={{ fontSize: 12, color: '#5f6FFF', fontWeight: '500' }}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={state === "Sign Up" ? "Create a strong password" : "Enter your password"}
                  placeholderTextColor="#A1A1AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#71717A" /> : <Eye size={20} color="#71717A" />}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {state === "Sign Up" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#A1A1AA"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  {showConfirmPassword ? <EyeOff size={20} color="#71717A" /> : <Eye size={20} color="#71717A" />}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Terms Checkbox */}
          {state === "Sign Up" && (
              <TouchableOpacity 
                style={styles.termsContainer} 
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.8}
              >
                  <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                      {agreedToTerms && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.termsText}>
                      I agree to the <Text style={styles.linkText}>Terms & Conditions</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
              </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={onSubmitHandler}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Processing..." : state === "Verify" ? "Verify Account" : state === "Forgot Password" ? "Send Reset Link" : state === "Sign Up" ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>

          {state === "Forgot Password" && (
            <TouchableOpacity onPress={() => setState("Login")} style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={{ color: '#71717A', fontSize: 14 }}>Back to Login</Text>
            </TouchableOpacity>
          )}

          {state === "Verify" && (
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              {resendTimer > 0 ? (
                <Text style={styles.resendCountdown}>Resend in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={onResendOtp}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity onPress={() => handleStateChange("Login")} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Divider */}
        {state !== "Verify" && state !== "Forgot Password" && (
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        {/* SSO Buttons */}
        {state !== "Verify" && state !== "Forgot Password" && (
          <View style={styles.ssoContainer}>
            {/* Google Sign-In */}
            <TouchableOpacity 
              style={styles.ssoButton} 
              onPress={() => Alert.alert("Info", "Google Sign-In not fully configured in this demo")}
              activeOpacity={0.7}
            >
              <View style={styles.ssoIconContainer}>
                <Image 
                  source={{ uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" }} 
                  style={styles.ssoIcon} 
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.ssoButtonText}>
                {state === "Sign Up" ? "Sign up with Google" : "Sign in with Google"}
              </Text>
            </TouchableOpacity>

            {/* Apple Sign-In */}
            <TouchableOpacity 
              style={styles.ssoButton} 
              onPress={() => Alert.alert("Info", "Apple Sign-In not fully configured in this demo")}
              activeOpacity={0.7}
            >
              <View style={styles.ssoIconContainer}>
                <Text style={styles.appleIconText}></Text>
              </View>
              <Text style={styles.ssoButtonText}>
                {state === "Sign Up" ? "Sign up with Apple" : "Sign in with Apple"}
              </Text>
            </TouchableOpacity>

            {/* Microsoft Sign-In */}
            <TouchableOpacity 
              style={styles.ssoButton} 
              onPress={() => Alert.alert("Info", "Microsoft Sign-In not fully configured in this demo")}
              activeOpacity={0.7}
            >
              <View style={styles.ssoIconContainer}>
                <View style={{ width: 16, height: 16, flexWrap: 'wrap', flexDirection: 'row' }}>
                    <View style={{ width: 7, height: 7, backgroundColor: '#f35325', marginRight: 1, marginBottom: 1 }} />
                    <View style={{ width: 7, height: 7, backgroundColor: '#81bc06', marginBottom: 1 }} />
                    <View style={{ width: 7, height: 7, backgroundColor: '#05a6f0', marginRight: 1 }} />
                    <View style={{ width: 7, height: 7, backgroundColor: '#ffba08' }} />
                </View>
              </View>
              <Text style={styles.ssoButtonText}>
                {state === "Sign Up" ? "Sign up with Microsoft" : "Sign in with Microsoft"}
              </Text>
            </TouchableOpacity>
          </View>
        )}


      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 999,
    padding: 4,
    marginBottom: 24,
    position: 'relative',
    height: 48,
  },
  slider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: '#5f6FFF',
    borderRadius: 999,
  },
  sliderLeft: {
    left: 4,
  },
  sliderRight: {
    left: '50%',
    marginLeft: 0, // removed marginLeft since it's cleaner
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#71717A",
  },
  logo: {
    width: 120, // Adjusted width
    height: 40,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerContainer: {
      alignItems: 'center',
      marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18181B",
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#71717A",
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#18181B",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#18181B",
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#18181B",
  },
  eyeIcon: {
    padding: 10,
  },
  termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
  },
  checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#D4D4D8',
      borderRadius: 4,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
  },
  checkboxChecked: {
      borderColor: '#5f6FFF',
      backgroundColor: '#5f6FFF',
  },
  checkboxInner: {
      width: 10,
      height: 10,
      backgroundColor: 'white',
      borderRadius: 2,
  },
  termsText: {
      fontSize: 12,
      color: '#71717A',
      flex: 1,
  },
  linkText: {
      color: '#5f6FFF',
      fontWeight: '500',
  },
  submitButton: {
    backgroundColor: "#5f6FFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#5f6FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4E7",
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#A1A1AA",
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  ssoContainer: {
    gap: 12,
  },
  ssoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ssoIconContainer: {
    width: 20,
    height: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ssoIcon: {
    width: 20,
    height: 20,
  },
  appleIconText: {
    fontSize: 20,
    color: "#000",
    marginTop: -2, // Optical adjustment for  character
  },
  ssoButtonText: {
    fontSize: 14,
    color: "#52525B",
    fontWeight: "600",
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 8,
  },
  resendCountdown: {
    fontSize: 14,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 14,
    color: '#5f6FFF',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: '#71717A',
  },
});


export default Login;
