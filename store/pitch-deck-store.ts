import { create } from "zustand";
import { PitchDeck } from "@/types";
import { pitchDeckSamples } from "@/mocks/users";

interface PitchDeckState {
  pitchDecks: PitchDeck[];
  currentDeck: PitchDeck | null;
  isLoading: boolean;
  error: string | null;
  fetchPitchDecks: () => Promise<void>;
  createPitchDeck: (data: Partial<PitchDeck>) => Promise<void>;
  setCurrentDeck: (deckId: string) => void;
}

export const usePitchDeckStore = create<PitchDeckState>((set, get) => ({
  pitchDecks: [],
  currentDeck: null,
  isLoading: false,
  error: null,
  fetchPitchDecks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use our mock data
      set({
        pitchDecks: pitchDeckSamples,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch pitch decks",
      });
    }
  },
  createPitchDeck: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call to generate pitch deck
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newDeck: PitchDeck = {
        id: `deck_${Date.now()}`,
        userId: data.userId || "user_1",
        title: data.title || "Untitled Pitch Deck",
        description: data.description || "",
        slides: data.slides || [],
        coverImage: data.coverImage || "",
        isPublic: data.isPublic || false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: data.tags || [],
        status: data.status || "draft",
      };
      
      set((state) => ({
        pitchDecks: [newDeck, ...state.pitchDecks],
        currentDeck: newDeck,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create pitch deck",
      });
    }
  },
  setCurrentDeck: (deckId) => {
    const deck = get().pitchDecks.find((d) => d.id === deckId) || null;
    set({ currentDeck: deck });
  },
}));