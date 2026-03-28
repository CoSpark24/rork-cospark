import { create } from "zustand";
import { MatchProfile, UserProfile, StartupStage, FundingStatus } from "@/types";
import { matchProfiles } from "@/mocks/users";
import { useAuthStore } from "./auth-store";
import { generateMatchReasons, calculateMatchScore } from "@/utils/ai-service";

interface MatchesState {
  potentialMatches: MatchProfile[];
  connections: MatchProfile[];
  isLoading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  swipeMatch: (matchId: string, action: "like" | "pass") => void;
  connectWithUser: (userId: string) => void;
  getMatchScore: (user1: UserProfile, user2: UserProfile) => number;
  getStageCompatibility: (stage1: StartupStage, stage2: StartupStage) => number;
  getMatchReasons: (user1: UserProfile, user2: UserProfile) => string[];
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  potentialMatches: [],
  connections: [],
  isLoading: false,
  error: null,

  fetchMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Calculate match scores for each potential match
      const matchesWithScores: MatchProfile[] = await Promise.all(
        matchProfiles.map(async (profile) => {
          const matchScore = await calculateMatchScore(currentUser, profile);
          const matchReasons = await generateMatchReasons(currentUser, profile);
          
          return {
            ...profile,
            matchScore,
            matchReasons,
          };
        })
      );

      // Sort by match score and take top matches
      const sortedMatches = matchesWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      // Mock some existing connections
      const mockConnections = matchesWithScores.slice(0, 3).map(match => ({
        ...match,
        matchScore: Math.floor(Math.random() * 20) + 80, // 80-100% match for connections
      }));

      set({ 
        potentialMatches: sortedMatches,
        connections: mockConnections,
        isLoading: false 
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch matches",
      });
    }
  },

  swipeMatch: (matchId: string, action: "like" | "pass") => {
    set((state) => ({
      potentialMatches: state.potentialMatches.filter(match => match.id !== matchId),
    }));

    if (action === "like") {
      // Simulate mutual match (50% chance)
      if (Math.random() > 0.5) {
        const match = get().potentialMatches.find(m => m.id === matchId);
        if (match) {
          get().connectWithUser(matchId);
        }
      }
    }
  },

  connectWithUser: (userId: string) => {
    const match = get().potentialMatches.find(m => m.id === userId);
    if (match) {
      set((state) => ({
        connections: [...state.connections, match],
        potentialMatches: state.potentialMatches.filter(m => m.id !== userId),
      }));
    }
  },

  getMatchScore: (user1: UserProfile, user2: UserProfile) => {
    let score = 0;
    
    // Industry match (30 points)
    if (user1.industry && user2.industry && user1.industry === user2.industry) {
      score += 30;
    }
    
    // Stage compatibility (25 points)
    if (user1.stage && user2.stage) {
      const stageCompatibility = get().getStageCompatibility(user1.stage, user2.stage);
      score += stageCompatibility;
    }
    
    // Skills overlap (20 points)
    const skillsOverlap = user1.skills.filter(skill => 
      user2.skills.includes(skill)
    ).length;
    score += Math.min(skillsOverlap * 5, 20);
    
    // Looking for match (15 points)
    if (user1.lookingFor && user2.skills) {
      const lookingForMatch = user1.lookingFor.filter(need => 
        user2.skills.some(skill => skill.toLowerCase().includes(need.toLowerCase()))
      ).length;
      score += Math.min(lookingForMatch * 5, 15);
    }
    
    // Location proximity (10 points)
    if (user1.location && user2.location) {
      const locationMatch = user1.location.split(",")[1]?.trim() === user2.location.split(",")[1]?.trim();
      if (locationMatch) score += 10;
    }
    
    return Math.min(score, 100);
  },

  getStageCompatibility: (stage1: StartupStage, stage2: StartupStage) => {
    const stageOrder = [
      StartupStage.IDEATION,
      StartupStage.VALIDATION,
      StartupStage.MVP,
      StartupStage.EARLY_TRACTION,
      StartupStage.SCALING,
      StartupStage.GROWTH,
    ];
    
    const index1 = stageOrder.indexOf(stage1);
    const index2 = stageOrder.indexOf(stage2);
    
    if (index1 === -1 || index2 === -1) return 0;
    
    const difference = Math.abs(index1 - index2);
    
    if (difference === 0) return 25; // Same stage
    if (difference === 1) return 20; // Adjacent stages
    if (difference === 2) return 15; // Two stages apart
    return 10; // More than two stages apart
  },

  getMatchReasons: (user1: UserProfile, user2: UserProfile) => {
    const reasons: string[] = [];
    
    if (user1.industry === user2.industry) {
      reasons.push(`Both in ${user1.industry}`);
    }
    
    const skillsOverlap = user1.skills.filter(skill => 
      user2.skills.includes(skill)
    );
    if (skillsOverlap.length > 0) {
      reasons.push(`Shared skills: ${skillsOverlap.slice(0, 2).join(", ")}`);
    }
    
    if (user1.stage === user2.stage) {
      reasons.push(`Both at ${user1.stage} stage`);
    }
    
    const locationMatch = user1.location.split(",")[1]?.trim() === user2.location.split(",")[1]?.trim();
    if (locationMatch) {
      reasons.push("Same region");
    }
    
    return reasons;
  },
}));