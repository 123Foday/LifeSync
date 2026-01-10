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

  const [state, setState] = useState<"Login" | "Sign Up">("Login");
  const [email, setEmail] = useState("");
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
          Alert.alert("Success", data.message || "Account created! Please login.");
          setState("Login");
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
          Alert.alert("Error", data.message);
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = (newState: "Login" | "Sign Up") => {
      setState(newState);
      setConfirmPassword("");
      setAgreedToTerms(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Sliding Toggle */}
        <View style={styles.toggleContainer}>
          <View style={[styles.slider, state === "Sign Up" ? styles.sliderRight : styles.sliderLeft]} />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => handleStateChange("Login")}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, state === "Login" ? styles.activeText : styles.inactiveText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => handleStateChange("Sign Up")}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, state === "Sign Up" ? styles.activeText : styles.inactiveText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{state === "Sign Up" ? "Create Account" : "Welcome Back"}</Text>
            <Text style={styles.headerSubtitle}>
                {state === "Login"
                ? "Login to book appointments and manage your health"
                : "Sign up to get started with LifeSync"}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
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
              {isLoading ? "Authenticating..." : state === "Sign Up" ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* SSO Buttons */}
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
        </View>


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
});


export default Login;
