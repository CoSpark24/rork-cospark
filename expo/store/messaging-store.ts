import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { UserProfile } from "@/types";
import { matchProfiles } from "@/mocks/users";
import { useAuthStore } from "./auth-store";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  type: "text" | "image" | "document" | "audio";
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  otherUser: UserProfile;
  messages: Message[];
  unreadCount: number;
  lastActivity: number;
  isTyping?: boolean;
}

interface MessagingState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  uploadingMedia: boolean;
  fetchConversations: () => Promise<void>;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (conversationId: string, text: string, type?: "text" | "image" | "document" | "audio", mediaUrl?: string, fileName?: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  startConversation: (userId: string) => string;
  setTypingStatus: (conversationId: string, isTyping: boolean) => void;
  uploadMedia: (conversationId: string, file: any, type: "image" | "document" | "audio") => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  conversations: [],
  isLoading: false,
  error: null,
  uploadingMedia: false,
  
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // For demo purposes, create mock conversations with matched profiles
      const mockConversations: Conversation[] = matchProfiles
        .filter((profile, index) => index < 3) // Only create conversations with first 3 matches
        .map((profile) => {
          const messageCount = Math.floor(Math.random() * 15) + 5;
          const messages: Message[] = [];
          
          // Generate random messages with different types
          for (let i = 0; i < messageCount; i++) {
            const isFromCurrentUser = Math.random() > 0.5;
            const timestamp = Date.now() - (messageCount - i) * 3600000; // Spread over last few hours
            const messageType = getRandomMessageType();
            
            const baseMessage = {
              id: uuidv4(),
              senderId: isFromCurrentUser ? currentUser.id : profile.id,
              timestamp,
              type: messageType,
              isRead: Math.random() > 0.3,
            };

            if (messageType === "text") {
              messages.push({
                ...baseMessage,
                text: isFromCurrentUser 
                  ? `Hi ${profile.name}, ${getRandomMessage(true)}` 
                  : getRandomMessage(false),
              });
            } else if (messageType === "image") {
              messages.push({
                ...baseMessage,
                text: "📷 Shared an image",
                mediaUrl: `https://picsum.photos/400/300?random=${i}`,
              });
            } else if (messageType === "document") {
              messages.push({
                ...baseMessage,
                text: "📄 Shared a document",
                fileName: `pitch_deck_v${i + 1}.pdf`,
                fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
              });
            } else if (messageType === "audio") {
              messages.push({
                ...baseMessage,
                text: "🎵 Voice message",
                mediaUrl: `https://example.com/audio/${i}.mp3`,
              });
            }
          }
          
          return {
            id: uuidv4(),
            otherUser: profile,
            messages,
            unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
            lastActivity: messages[messages.length - 1].timestamp,
            isTyping: false,
          };
        });
      
      // Sort by last activity
      mockConversations.sort((a, b) => b.lastActivity - a.lastActivity);
      
      set({ conversations: mockConversations, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch conversations",
      });
    }
  },
  
  getConversation: (id) => {
    return get().conversations.find((conv) => conv.id === id);
  },
  
  sendMessage: (conversationId, text, type = "text", mediaUrl, fileName) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      text,
      senderId: currentUser.id,
      timestamp: Date.now(),
      type,
      mediaUrl,
      fileName,
      isRead: true,
    };
    
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastActivity: newMessage.timestamp,
          };
        }
        return conv;
      }),
    }));

    // Simulate real-time response for demo
    if (type === "text") {
      setTimeout(() => {
        const conversation = get().getConversation(conversationId);
        if (conversation) {
          const responseMessage: Message = {
            id: uuidv4(),
            text: getRandomResponse(),
            senderId: conversation.otherUser.id,
            timestamp: Date.now(),
            type: "text",
            isRead: false,
          };
          
          set((state) => ({
            conversations: state.conversations.map((conv) => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  messages: [...conv.messages, responseMessage],
                  lastActivity: responseMessage.timestamp,
                  unreadCount: conv.unreadCount + 1,
                };
              }
              return conv;
            }),
          }));
        }
      }, 2000 + Math.random() * 3000); // Random delay 2-5 seconds
    }
  },
  
  markConversationAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(msg => ({ ...msg, isRead: true })),
          };
        }
        return conv;
      }),
    }));
  },
  
  startConversation: (userId) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");
    
    // Check if conversation already exists
    const existingConv = get().conversations.find(
      (conv) => conv.otherUser.id === userId
    );
    
    if (existingConv) {
      return existingConv.id;
    }
    
    // Find the user profile
    const otherUser = matchProfiles.find((profile) => profile.id === userId);
    if (!otherUser) throw new Error("User not found");
    
    // Create new conversation
    const newConversationId = uuidv4();
    const newConversation: Conversation = {
      id: newConversationId,
      otherUser,
      messages: [],
      unreadCount: 0,
      lastActivity: Date.now(),
      isTyping: false,
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
    }));
    
    return newConversationId;
  },

  setTypingStatus: (conversationId, isTyping) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, isTyping };
        }
        return conv;
      }),
    }));
  },

  uploadMedia: async (conversationId, file, type) => {
    set({ uploadingMedia: true });
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockUrl = type === "image" 
        ? `https://picsum.photos/400/300?random=${Date.now()}`
        : `https://example.com/${type}/${Date.now()}.${type === "document" ? "pdf" : "mp3"}`;
      
      const fileName = type === "document" ? `document_${Date.now()}.pdf` : undefined;
      
      get().sendMessage(
        conversationId,
        type === "image" ? "📷 Shared an image" : 
        type === "document" ? "📄 Shared a document" : "🎵 Voice message",
        type,
        mockUrl,
        fileName
      );
      
      set({ uploadingMedia: false });
    } catch (error) {
      set({ uploadingMedia: false, error: "Failed to upload media" });
    }
  },

  deleteMessage: (conversationId, messageId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.filter(msg => msg.id !== messageId),
          };
        }
        return conv;
      }),
    }));
  },
}));

// Helper functions
function getRandomMessageType(): "text" | "image" | "document" | "audio" {
  const types = ["text", "text", "text", "text", "image", "document", "audio"]; // Weighted towards text
  return types[Math.floor(Math.random() * types.length)] as any;
}

function getRandomMessage(isFromCurrentUser: boolean): string {
  const currentUserMessages = [
    "I'm interested in your startup idea. Can we discuss more?",
    "I think our skills would complement each other well.",
    "What's your vision for the next 6 months?",
    "Do you have any experience with fundraising?",
    "I'd love to hear more about your background.",
    "Are you looking for technical or business co-founders?",
    "Have you validated your idea with potential customers?",
    "What's your biggest challenge right now?",
    "I have some connections in your industry that might help.",
    "Would you be open to a video call to discuss further?",
    "I've been working on something similar in the past.",
    "Your experience in fintech is exactly what I'm looking for.",
    "Let's schedule a coffee meeting this week.",
    "I can help with the technical implementation.",
    "Do you have a business plan ready?",
  ];
  
  const otherUserMessages = [
    "Thanks for reaching out! I'd love to chat more about potential collaboration.",
    "I've been looking for someone with your skills.",
    "My main focus is on product-market fit right now.",
    "I'm bootstrapping but open to raising funds if we find the right investor.",
    "I've been working on this idea for about 6 months.",
    "I have a technical background but need help with business development.",
    "Yes, I've done some customer interviews already.",
    "Finding the right co-founder is my biggest challenge.",
    "That would be incredibly helpful!",
    "Absolutely, let's schedule a call this week.",
    "I'm particularly interested in your marketing expertise.",
    "We should definitely explore this opportunity together.",
    "I have some initial traction that I'd love to share.",
    "Your background in AI/ML is perfect for our project.",
    "Let me send you our current pitch deck.",
  ];
  
  const messages = isFromCurrentUser ? currentUserMessages : otherUserMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomResponse(): string {
  const responses = [
    "That sounds great! When would be a good time to chat?",
    "I'm excited about this opportunity. Let me know your availability.",
    "Thanks for sharing that. I have some ideas to discuss.",
    "Perfect! I'll send you some materials to review.",
    "I agree completely. Let's move forward with this.",
    "That's exactly what I was thinking too.",
    "Great point! I hadn't considered that angle.",
    "I'm available for a call tomorrow if that works.",
    "Let me check my calendar and get back to you.",
    "This could be the partnership we've both been looking for.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}