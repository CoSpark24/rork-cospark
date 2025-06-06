import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Phone, MessageSquare } from "lucide-react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth-store";
import { AuthMethod } from "@/types";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, sendOTP } = useAuthStore();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{ 
    email?: string; 
    phone?: string; 
    password?: string; 
    otp?: string; 
  }>({});

  const validate = () => {
    const errors: { email?: string; phone?: string; password?: string; otp?: string } = {};
    
    if (loginMethod === 'email') {
      if (!email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
      }
      
      if (!showOtpInput && !password) {
        errors.password = "Password is required";
      } else if (!showOtpInput && password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!phone) {
        errors.phone = "Phone number is required";
      } else if (!/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))) {
        errors.phone = "Phone number is invalid";
      }
      
      if (showOtpInput && !otp) {
        errors.otp = "OTP is required";
      } else if (showOtpInput && otp.length !== 6) {
        errors.otp = "OTP must be 6 digits";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      if (loginMethod === 'email') {
        await login({
          email,
          password,
          method: 'email' as AuthMethod
        });
      } else {
        if (!showOtpInput) {
          // Send OTP
          await sendOTP(phone);
          setShowOtpInput(true);
          Alert.alert("OTP Sent", "Please check your phone for the verification code");
        } else {
          // Verify OTP and login
          await login({
            phone,
            otp,
            method: 'phone' as AuthMethod
          });
        }
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Social Login", `${provider} login will be implemented with Firebase Auth`);
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset link will be sent to your email");
  };

  const handleSendOtp = async () => {
    if (phone) {
      await sendOTP(phone);
      setShowOtpInput(true);
      Alert.alert("OTP Sent", "Please check your phone for the verification code");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your startup journey
          </Text>
        </View>

        <View style={styles.loginMethodToggle}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              loginMethod === 'email' && styles.methodButtonActive,
            ]}
            onPress={() => {
              setLoginMethod('email');
              setShowOtpInput(false);
            }}
          >
            <Mail size={20} color={loginMethod === 'email' ? Colors.card : Colors.textSecondary} />
            <Text style={[
              styles.methodButtonText,
              loginMethod === 'email' && styles.methodButtonTextActive,
            ]}>
              Email
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.methodButton,
              loginMethod === 'phone' && styles.methodButtonActive,
            ]}
            onPress={() => {
              setLoginMethod('phone');
              setShowOtpInput(false);
            }}
          >
            <Phone size={20} color={loginMethod === 'phone' ? Colors.card : Colors.textSecondary} />
            <Text style={[
              styles.methodButtonText,
              loginMethod === 'phone' && styles.methodButtonTextActive,
            ]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.form}>
          {loginMethod === 'email' ? (
            <>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={formErrors.email}
                leftIcon={<Mail size={20} color={Colors.textSecondary} />}
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={formErrors.password}
                leftIcon={<Lock size={20} color={Colors.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={Colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                }
              />
            </>
          ) : (
            <>
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={formErrors.phone}
                leftIcon={<Phone size={20} color={Colors.textSecondary} />}
                rightIcon={
                  !showOtpInput ? (
                    <TouchableOpacity onPress={handleSendOtp}>
                      <MessageSquare size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  ) : undefined
                }
              />
              
              {showOtpInput && (
                <Input
                  label="OTP"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  error={formErrors.otp}
                  leftIcon={<MessageSquare size={20} color={Colors.textSecondary} />}
                />
              )}
            </>
          )}
          
          <View style={styles.formOptions}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>
            
            {loginMethod === 'email' && (
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title={
              loginMethod === 'phone' && !showOtpInput 
                ? "Send OTP" 
                : "Sign In"
            }
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            gradient
            style={styles.loginButton}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
            >
              <Text style={styles.socialButtonText}>🔍 Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Apple")}
            >
              <Text style={styles.socialButtonText}>🍎 Apple</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.socialButtonFull}
            onPress={() => handleSocialLogin("Facebook")}
          >
            <Text style={styles.socialButtonText}>📘 Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.xl,
  },
  backButton: {
    marginBottom: Theme.spacing.lg,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.md,
    color: Colors.textSecondary,
  },
  loginMethodToggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 4,
    marginBottom: Theme.spacing.xl,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  methodButtonActive: {
    backgroundColor: Colors.primary,
  },
  methodButtonText: {
    marginLeft: Theme.spacing.sm,
    color: Colors.textSecondary,
    fontWeight: Theme.typography.weights.medium as any,
  },
  methodButtonTextActive: {
    color: Colors.card,
  },
  form: {
    marginBottom: Theme.spacing.xl,
  },
  formOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: Theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberMeText: {
    color: Colors.text,
    fontSize: Theme.typography.sizes.sm,
  },
  forgotPassword: {
    color: Colors.primary,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  errorText: {
    color: Colors.error,
    fontSize: Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.md,
  },
  loginButton: {
    marginBottom: Theme.spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.sizes.sm,
    marginHorizontal: Theme.spacing.md,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.md,
  },
  socialButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    marginHorizontal: Theme.spacing.xs,
    alignItems: "center",
  },
  socialButtonFull: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: "center",
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingVertical: Theme.spacing.md,
  },
  footerText: {
    color: Colors.textSecondary,
    marginRight: Theme.spacing.xs,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: Theme.typography.weights.semibold as any,
  },
});