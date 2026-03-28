import { create } from "zustand";
import { FounderCircle, CircleMessage } from "@/types";
import { useAuthStore } from "./auth-store";

interface CirclesState {
  circles: FounderCircle[];
  circleMessages: Record<string, CircleMessage[]>;
  isLoading: boolean;
  error: string | null;
  fetchCircles: () => Promise<void>;
  createCircle: (circleData: Partial<FounderCircle>) => Promise<void>;
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
  sendMessage: (circleId: string, text: string, type: CircleMessage['type']) => void;
  getCircleMessages: (circleId: string) => CircleMessage[];
  moderateMessage: (messageId: string, action: "approve" | "remove") => void;
  getUserJoinedCircles: () => FounderCircle[];
}

export const useCirclesStore = create<CirclesState>((set, get) => ({
  circles: [],
  circleMessages: {},
  isLoading: false,
  error: null,

  fetchCircles: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock circles data with enhanced features
      const mockCircles: FounderCircle[] = [
        {
          id: "circle1",
          name: "AI Startup Founders",
          description: "A community for founders building AI-powered startups. Share insights, challenges, and breakthroughs in artificial intelligence.",
          isPrivate: false,
          memberCount: 156,
          createdBy: "user2",
          createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          tags: ["ai", "machine-learning", "startups"],
          avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          isJoined: true,
          lastActivity: Date.now() - 2 * 60 * 60 * 1000,
        },
        {
          id: "circle2",
          name: "Fintech Innovators",
          description: "Connect with fellow fintech entrepreneurs and share insights about financial technology, regulations, and market opportunities.",
          isPrivate: true,
          memberCount: 89,
          createdBy: "user3",
          createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
          tags: ["fintech", "finance", "innovation"],
          isJoined: false,
          lastActivity: Date.now() - 5 * 60 * 60 * 1000,
        },
        {
          id: "circle3",
          name: "E-commerce Builders",
          description: "For founders in the e-commerce and marketplace space. Discuss growth strategies, logistics, and customer acquisition.",
          isPrivate: false,
          memberCount: 203,
          createdBy: "user4",
          createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
          tags: ["ecommerce", "marketplace", "retail"],
          isJoined: true,
          lastActivity: Date.now() - 1 * 60 * 60 * 1000,
        },
        {
          id: "circle4",
          name: "SaaS Growth Hackers",
          description: "Share growth strategies, product insights, and scaling tips for SaaS businesses.",
          isPrivate: false,
          memberCount: 342,
          createdBy: "user5",
          createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
          tags: ["saas", "growth", "product"],
          isJoined: false,
          lastActivity: Date.now() - 30 * 60 * 1000,
        },
      ];
      
      // Mock messages for circles with moderation features
      const mockMessages: Record<string, CircleMessage[]> = {
        circle1: [
          {
            id: "msg1",
            circleId: "circle1",
            senderId: "user2",
            senderName: "Priya Patel",
            senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
            text: "Welcome everyone! Let's share our AI startup journeys here. Please keep discussions relevant and respectful.",
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            type: "announcement",
            isModerated: false,
          },
          {
            id: "msg2",
            circleId: "circle1",
            senderId: "user3",
            senderName: "Vikram Singh",
            text: "Just launched our AI-powered customer service bot. Happy to share learnings! The key was training on domain-specific data.",
            timestamp: Date.now() - 1 * 60 * 60 * 1000,
            type: "message",
            isModerated: false,
          },
          {
            id: "msg3",
            circleId: "circle1",
            senderId: "user4",
            senderName: "Ananya Desai",
            text: "Has anyone worked with GPT-4 for content generation? Looking for best practices and cost optimization tips.",
            timestamp: Date.now() - 30 * 60 * 1000,
            type: "message",
            isModerated: false,
          },
        ],
        circle3: [
          {
            id: "msg4",
            circleId: "circle3",
            senderId: "user4",
            senderName: "Ananya Desai",
            text: "Quick poll: What's your biggest challenge in e-commerce right now? Customer acquisition, logistics, or retention?",
            timestamp: Date.now() - 3 * 60 * 60 * 1000,
            type: "poll",
            isModerated: false,
          },
          {
            id: "msg5",
            circleId: "circle3",
            senderId: "user5",
            senderName: "Karan Mehta",
            text: "Customer acquisition for sure! We're spending too much on ads with low conversion rates.",
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            type: "message",
            isModerated: false,
          },
        ],
      };
      
      set({ 
        circles: mockCircles, 
        circleMessages: mockMessages,
        isLoading: false 
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch circles",
      });
    }
  },

  createCircle: async (circleData) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    const newCircle: FounderCircle = {
      id: `circle_${Date.now()}`,
      name: circleData.name || "Untitled Circle",
      description: circleData.description || "",
      isPrivate: circleData.isPrivate || false,
      memberCount: 1,
      createdBy: currentUser.id,
      createdAt: Date.now(),
      tags: circleData.tags || [],
      avatar: circleData.avatar,
      isJoined: true,
      lastActivity: Date.now(),
    };

    set((state) => ({
      circles: [newCircle, ...state.circles],
      circleMessages: {
        ...state.circleMessages,
        [newCircle.id]: [],
      },
    }));
  },

  joinCircle: (circleId) => {
    set((state) => ({
      circles: state.circles.map(circle =>
        circle.id === circleId
          ? { 
              ...circle, 
              memberCount: circle.memberCount + 1,
              isJoined: true 
            }
          : circle
      ),
    }));
  },

  leaveCircle: (circleId) => {
    set((state) => ({
      circles: state.circles.map(circle =>
        circle.id === circleId
          ? { 
              ...circle, 
              memberCount: Math.max(0, circle.memberCount - 1),
              isJoined: false 
            }
          : circle
      ),
    }));
  },

  sendMessage: (circleId, text, type) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const newMessage: CircleMessage = {
      id: `msg_${Date.now()}`,
      circleId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: Date.now(),
      type,
      isModerated: false,
    };

    set((state) => ({
      circleMessages: {
        ...state.circleMessages,
        [circleId]: [...(state.circleMessages[circleId] || []), newMessage],
      },
      circles: state.circles.map(circle =>
        circle.id === circleId
          ? { ...circle, lastActivity: Date.now() }
          : circle
      ),
    }));
  },

  getCircleMessages: (circleId) => {
    return get().circleMessages[circleId] || [];
  },

  moderateMessage: (messageId, action) => {
    set((state) => {
      const newCircleMessages = { ...state.circleMessages };
      
      Object.keys(newCircleMessages).forEach(circleId => {
        newCircleMessages[circleId] = newCircleMessages[circleId].map(message =>
          message.id === messageId 
            ? { 
                ...message, 
                isModerated: action === "remove",
                text: action === "remove" ? "[Message removed by moderator]" : message.text
              } 
            : message
        );
      });

      return { circleMessages: newCircleMessages };
    });
  },

  getUserJoinedCircles: () => {
    return get().circles.filter(circle => circle.isJoined);
  },
}));