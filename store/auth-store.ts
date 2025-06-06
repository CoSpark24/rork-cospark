import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile, AuthMethod, LoginCredentials, SignupData } from "@/types";
import { signInWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseConfig';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
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
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email || '',
            credentials.password || ''
          );

          const firebaseUser = userCredential.user;

          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'New User',
              avatar: firebaseUser.photoURL || '',
              role: '',
              createdAt: Date.now(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
        } catch (err) {
          console.error('Logout error:', err);
        }
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: async (userData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        try {
          if (auth.currentUser) {
            await updateFirebaseProfile(auth.currentUser, {
              displayName: userData.name,
              photoURL: userData.avatar,
            });
          }

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