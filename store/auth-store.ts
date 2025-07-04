import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, LoginCredentials } from "@/types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
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
          // Mock login - replace with real API call later
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate login validation
          if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
            set({
              user: {
                id: "1",
                email: credentials.email,
                name: "Demo User",
                avatar: "",
                role: "user",
                createdAt: Date.now(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
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
      signup: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // Mock signup - replace with real API call later
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({
            user: {
              id: Math.random().toString(),
              email: credentials.email || "",
              name: credentials.name || "New User",
              avatar: "",
              role: "user",
              createdAt: Date.now(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Signup failed",
          });
        }
      },
      logout: async () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
      updateProfile: async (userData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock update - replace with real API call later
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "cospark-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);