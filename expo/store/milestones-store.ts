import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Milestone } from "@/types";

interface MilestonesState {
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;
  fetchMilestones: () => Promise<void>;
  createMilestone: (milestoneData: Partial<Milestone>) => void;
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (milestoneId: string) => void;
  completeMilestone: (milestoneId: string) => void;
  generateAITips: (milestoneId: string) => Promise<void>;
}

export const useMilestonesStore = create<MilestonesState>()(
  persist(
    (set, get) => ({
      milestones: [],
      isLoading: false,
      error: null,

      fetchMilestones: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // If no milestones exist, create default ones
          const currentMilestones = get().milestones;
          if (currentMilestones.length === 0) {
            const defaultMilestones: Milestone[] = [
              {
                id: "milestone1",
                title: "Validate Your Idea",
                description: "Conduct market research and validate your startup idea with potential customers",
                status: "todo",
                category: "idea",
                aiTips: [
                  "Start with customer interviews to understand pain points",
                  "Create a simple landing page to gauge interest",
                  "Research your competition and identify gaps"
                ],
              },
              {
                id: "milestone2",
                title: "Build MVP",
                description: "Develop a minimum viable product to test your core hypothesis",
                status: "todo",
                category: "mvp",
                aiTips: [
                  "Focus on core features that solve the main problem",
                  "Use no-code tools to build faster",
                  "Get feedback early and iterate quickly"
                ],
              },
              {
                id: "milestone3",
                title: "Get First 100 Users",
                description: "Acquire your first 100 users and gather feedback",
                status: "todo",
                category: "traction",
                aiTips: [
                  "Leverage your personal network first",
                  "Create valuable content to attract users",
                  "Offer incentives for early adopters"
                ],
              },
              {
                id: "milestone4",
                title: "Raise Seed Funding",
                description: "Secure seed funding to scale your startup",
                status: "todo",
                category: "fundraising",
                aiTips: [
                  "Prepare a compelling pitch deck",
                  "Network with relevant investors",
                  "Show strong traction and growth metrics"
                ],
              },
            ];
            
            set({ milestones: defaultMilestones, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to fetch milestones",
          });
        }
      },

      createMilestone: (milestoneData) => {
        const newMilestone: Milestone = {
          id: `milestone_${Date.now()}`,
          title: milestoneData.title || "New Milestone",
          description: milestoneData.description || "",
          status: milestoneData.status || "todo",
          category: milestoneData.category || "idea",
          dueDate: milestoneData.dueDate,
          aiTips: milestoneData.aiTips || [],
        };

        set((state) => ({
          milestones: [...state.milestones, newMilestone],
        }));
      },

      updateMilestone: (milestoneId, updates) => {
        set((state) => ({
          milestones: state.milestones.map(milestone =>
            milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
          ),
        }));
      },

      deleteMilestone: (milestoneId) => {
        set((state) => ({
          milestones: state.milestones.filter(milestone => milestone.id !== milestoneId),
        }));
      },

      completeMilestone: (milestoneId) => {
        set((state) => ({
          milestones: state.milestones.map(milestone =>
            milestone.id === milestoneId
              ? { ...milestone, status: "completed", completedAt: Date.now() }
              : milestone
          ),
        }));
      },

      generateAITips: async (milestoneId) => {
        const milestone = get().milestones.find(m => m.id === milestoneId);
        if (!milestone) return;

        try {
          const response = await fetch("https://toolkit.rork.com/text/llm/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content: "You are a startup advisor. Provide 3 specific, actionable tips for achieving the given milestone. Keep each tip concise and practical.",
                },
                {
                  role: "user",
                  content: `Milestone: ${milestone.title}\nDescription: ${milestone.description}\nCategory: ${milestone.category}`,
                },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const tips = data.completion
              .split(/\d+\./)
              .filter((tip: string) => tip.trim().length > 0)
              .map((tip: string) => tip.trim())
              .slice(0, 3);

            set((state) => ({
              milestones: state.milestones.map(m =>
                m.id === milestoneId ? { ...m, aiTips: tips } : m
              ),
            }));
          }
        } catch (error) {
          console.error("Failed to generate AI tips:", error);
        }
      },
    }),
    {
      name: "cospark-milestones-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);