import { create } from "zustand";
import { PitchDeckData } from "@/types";
import { pitchDeckSamples } from "@/mocks/users";

interface PitchDeckState {
  pitchDecks: PitchDeckData[];
  currentDeck: PitchDeckData | null;
  isLoading: boolean;
  error: string | null;
  fetchPitchDecks: () => Promise<void>;
  createPitchDeck: (data: Partial<PitchDeckData>) => Promise<void>;
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
      
      const newDeck: PitchDeckData = {
        id: `deck_${Date.now()}`,
        startupName: data.startupName || "Untitled Startup",
        industry: data.industry || "",
        problem: data.problem || "",
        solution: data.solution || "",
        businessModel: data.businessModel || "",
        market: data.market || "",
        team: data.team || "",
        traction: data.traction || "",
        fundingNeeds: data.fundingNeeds || "",
        createdAt: Date.now(),
        pdfUrl: "https://example.com/generated-pitch-deck.pdf",
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