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
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // For demo purposes, we'll automatically log in any user
          // In a real app, you would validate credentials against a backend
          set({ 
            user: {
              ...currentUser,
              email: credentials.email || currentUser.email
            }, 
            isAuthenticated: true, 
            isLoading: false 
          });
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
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // For demo purposes, we'll create a new user based on the provided data
          const newUser: UserProfile = {
            ...currentUser,
            id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email || "",
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
          await new Promise((resolve) => setTimeout(resolve, 500));
          
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
    }),
    {
      name: "cospark-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);