import { create } from "zustand";
import { FeedPost, FeedComment } from "@/types";
import { useAuthStore } from "./auth-store";

interface FeedState {
  posts: FeedPost[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (content: string, type: FeedPost['type'], tags: string[]) => Promise<void>;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  pinPost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  markTrending: (postId: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock posts data with enhanced features
      const mockPosts: FeedPost[] = [
        {
          id: "post1",
          authorId: "user2",
          authorName: "Priya Patel",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
          content: "Just launched our MVP! 🚀 After 3 months of development, we finally have a working prototype of our artisan marketplace. Looking for feedback from fellow founders!",
          type: "achievement",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          likes: 24,
          comments: [
            {
              id: "comment1",
              postId: "post1",
              authorId: "user3",
              authorName: "Vikram Singh",
              content: "Congratulations! Would love to see a demo.",
              timestamp: Date.now() - 1 * 60 * 60 * 1000,
              likes: 3,
            }
          ],
          tags: ["mvp", "marketplace", "artisan"],
          isLiked: false,
          isPinned: true,
          isTrending: true,
        },
        {
          id: "post2",
          authorId: "user3",
          authorName: "Vikram Singh",
          content: "Question for the community: How do you handle customer acquisition in the early stages? We're struggling to get our first 100 users. Any tips?",
          type: "question",
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          likes: 12,
          comments: [
            {
              id: "comment2",
              postId: "post2",
              authorId: "user4",
              authorName: "Ananya Desai",
              content: "Try reaching out to your network first. Personal connections often convert better than cold outreach.",
              timestamp: Date.now() - 3 * 60 * 60 * 1000,
              likes: 5,
            }
          ],
          tags: ["customeracquisition", "startup", "growth"],
          isLiked: false,
          isPinned: false,
          isTrending: true,
        },
        {
          id: "post3",
          authorId: "user4",
          authorName: "Ananya Desai",
          content: "Excited to share that we've been accepted into the TechStars accelerator program! 🎉 The journey has been incredible so far. Special thanks to everyone who supported us.",
          type: "achievement",
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          likes: 45,
          comments: [],
          tags: ["accelerator", "techstars", "milestone"],
          isLiked: true,
          isPinned: false,
          isTrending: false,
        },
        {
          id: "post4",
          authorId: "user5",
          authorName: "Karan Mehta",
          content: "Important announcement: We're hosting a virtual pitch competition next month! Open to all early-stage startups. Winner gets ₹5L in funding and mentorship. Details in comments.",
          type: "announcement",
          timestamp: Date.now() - 8 * 60 * 60 * 1000,
          likes: 67,
          comments: [],
          tags: ["pitchcompetition", "funding", "announcement"],
          isLiked: false,
          isPinned: true,
          isTrending: true,
        },
      ];
      
      set({ posts: mockPosts, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      });
    }
  },

  createPost: async (content, type, tags) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      type,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      tags,
      isLiked: false,
      isPinned: false,
      isTrending: false,
    };

    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId 
          ? { 
              ...post, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked 
            } 
          : post
      ),
    }));
  },

  addComment: (postId, content) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const newComment: FeedComment = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      timestamp: Date.now(),
      likes: 0,
    };

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }));
  },

  pinPost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      ),
    }));
  },

  reportPost: (postId, reason) => {
    // In a real app, this would send a report to moderators
    console.log(`Post ${postId} reported for: ${reason}`);
    // For demo purposes, we'll just log it
  },

  markTrending: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, isTrending: true } : post
      ),
    }));
  },
}));