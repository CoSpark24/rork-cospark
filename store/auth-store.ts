import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, AuthMethod, LoginCredentials, SignupData } from "@/types";
// Firebase imports - Note: Actual Firebase setup would be required
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';
// For Expo, we might use expo-firebase-auth or similar, but sticking to placeholder for now

// Mock user for demo purposes when Firebase isn't fully set up
import { currentUser } from "@/mocks/users";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
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
          // Simulate API call or Firebase Auth
          // In a real implementation, this would be:
          // const auth = getAuth();
          // const userCredential = await signInWithEmailAndPassword(auth, credentials.email || '', credentials.password || '');
          // const firebaseUser = userCredential.user;
          // Map Firebase user to UserProfile
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // For demo purposes, we'll automatically log in as guest
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
      logout: () => {
        // In a real implementation:
        // const auth = getAuth();
        // signOut(auth);
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: async (userData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call or Firebase update
          // In a real implementation:
          // const auth = getAuth();
          // if (auth.currentUser) {
          //   await updateFirebaseProfile(auth.currentUser, { displayName: userData.name, photoURL: userData.avatar });
          // }
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