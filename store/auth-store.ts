import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, AuthMethod, LoginCredentials, SignupData } from "@/types";
import { currentUser } from "@/mocks/users";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          let isValidLogin = false;
          
          if (credentials.method === 'email' && credentials.email && credentials.password) {
            isValidLogin = credentials.email === currentUser.email;
          } else if (credentials.method === 'phone' && credentials.phone && credentials.otp) {
            isValidLogin = credentials.phone === currentUser.phone && credentials.otp === "123456";
          }
            
          if (isValidLogin) {
            set({ user: currentUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
        }
      },
      signup: async (userData: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll create a new user based on the provided data
          const newUser: UserProfile = {
            ...currentUser,
            id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email || "",
            phone: userData.phone,
            role: userData.role,
            createdAt: Date.now(),
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Signup failed",
          });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: async (userData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Update failed",
          });
        }
      },
      sendOTP: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to send OTP",
          });
        }
      },
      verifyOTP: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
          return otp === "123456"; // Demo OTP
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "OTP verification failed",
          });
          return false;
        }
      },
    }),
    {
      name: "cospark-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);