import { create } from "zustand";
import { FeedPost, FeedComment } from "@/types";
import { useAuthStore } from "./auth-store";

interface FeedState {
  posts: FeedPost[];
  trendingPosts: FeedPost[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (content: string, type: FeedPost['type'], tags: string[]) => Promise<void>;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  likeComment: (commentId: string) => void;
  pinPost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  markTrending: (postId: string) => void;
  moderatePost: (postId: string, action: "approve" | "remove") => void;
  getTrendingPosts: () => FeedPost[];
  getPostsByTag: (tag: string) => FeedPost[];
  searchPosts: (query: string) => FeedPost[];
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  trendingPosts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock posts data with enhanced community features
      const mockPosts: FeedPost[] = [
        {
          id: "post1",
          authorId: "user2",
          authorName: "Priya Patel",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
          content: "Just launched our MVP! 🚀 After 3 months of development, we finally have a working prototype of our artisan marketplace. Looking for feedback from fellow founders! The journey has been incredible - from ideation to validation to building. Special thanks to everyone who supported us along the way.",
          type: "achievement",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          likes: 47,
          comments: [
            {
              id: "comment1",
              postId: "post1",
              authorId: "user3",
              authorName: "Vikram Singh",
              authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
              content: "Congratulations! Would love to see a demo. The artisan marketplace space is really exciting right now.",
              timestamp: Date.now() - 1 * 60 * 60 * 1000,
              likes: 8,
              isLiked: false,
            },
            {
              id: "comment2",
              postId: "post1",
              authorId: "user4",
              authorName: "Ananya Desai",
              content: "Amazing work! How did you approach the validation phase? Would love to learn from your experience.",
              timestamp: Date.now() - 45 * 60 * 1000,
              likes: 5,
              isLiked: true,
            }
          ],
          tags: ["mvp", "marketplace", "artisan", "launch"],
          images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"],
          isLiked: true,
          isPinned: true,
          isTrending: true,
          isModerated: true,
          reportCount: 0,
        },
        {
          id: "post2",
          authorId: "user3",
          authorName: "Vikram Singh",
          authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          content: "Question for the community: How do you handle customer acquisition in the early stages? We're struggling to get our first 100 users for our SaaS platform. We've tried social media marketing, content marketing, and cold outreach, but the conversion rates are still low. Any tips from founders who've been through this?",
          type: "question",
          timestamp: Date.now() - 4 * 60 * 60 * 1000,
          likes: 23,
          comments: [
            {
              id: "comment3",
              postId: "post2",
              authorId: "user4",
              authorName: "Ananya Desai",
              content: "Try reaching out to your network first. Personal connections often convert better than cold outreach. Also, consider offering a free trial or freemium model.",
              timestamp: Date.now() - 3 * 60 * 60 * 1000,
              likes: 12,
              isLiked: false,
            },
            {
              id: "comment4",
              postId: "post2",
              authorId: "user5",
              authorName: "Karan Mehta",
              content: "Product-led growth worked well for us. Focus on making your product so good that users naturally want to share it. Also, join relevant communities where your target users hang out.",
              timestamp: Date.now() - 2.5 * 60 * 60 * 1000,
              likes: 15,
              isLiked: true,
            }
          ],
          tags: ["customeracquisition", "startup", "growth", "saas"],
          isLiked: false,
          isPinned: false,
          isTrending: true,
          isModerated: true,
          reportCount: 0,
        },
        {
          id: "post3",
          authorId: "user4",
          authorName: "Ananya Desai",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          content: "Excited to share that we've been accepted into the TechStars accelerator program! 🎉 The journey has been incredible so far. From 500+ applications to being one of the 10 selected startups. Special thanks to everyone who supported us with feedback, introductions, and encouragement. The real work starts now!",
          type: "achievement",
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          likes: 89,
          comments: [
            {
              id: "comment5",
              postId: "post3",
              authorId: "user2",
              authorName: "Priya Patel",
              content: "Congratulations! TechStars is amazing. Make the most of the mentorship and network. Rooting for you!",
              timestamp: Date.now() - 5 * 60 * 60 * 1000,
              likes: 7,
              isLiked: true,
            }
          ],
          tags: ["accelerator", "techstars", "milestone", "achievement"],
          isLiked: true,
          isPinned: false,
          isTrending: true,
          isModerated: true,
          reportCount: 0,
        },
        {
          id: "post4",
          authorId: "user5",
          authorName: "Karan Mehta",
          content: "Important announcement: We're hosting a virtual pitch competition next month! 📢 Open to all early-stage startups across India. Winner gets ₹5L in funding and 6 months of mentorship from industry experts. Applications open until next Friday. Link in comments. Let's support each other and build something amazing!",
          type: "announcement",
          timestamp: Date.now() - 8 * 60 * 60 * 1000,
          likes: 156,
          comments: [
            {
              id: "comment6",
              postId: "post4",
              authorId: "user6",
              authorName: "Rohit Kumar",
              content: "This is amazing! Just what the startup community needed. Already working on our application. Thank you for organizing this!",
              timestamp: Date.now() - 7 * 60 * 60 * 1000,
              likes: 4,
              isLiked: false,
            }
          ],
          tags: ["pitchcompetition", "funding", "announcement", "startup"],
          isLiked: false,
          isPinned: true,
          isTrending: true,
          isModerated: true,
          reportCount: 0,
        },
        {
          id: "post5",
          authorId: "user6",
          authorName: "Rohit Kumar",
          content: "Sharing some hard-earned lessons from our failed startup attempt last year. 💭 1) Validate your idea with real customers, not just friends and family. 2) Don't build in isolation - get feedback early and often. 3) Cash flow is king - monitor it religiously. 4) Team dynamics matter more than you think. Failure taught us more than any success story ever could. Now building something new with these lessons in mind.",
          type: "update",
          timestamp: Date.now() - 12 * 60 * 60 * 1000,
          likes: 67,
          comments: [
            {
              id: "comment7",
              postId: "post5",
              authorId: "user3",
              authorName: "Vikram Singh",
              content: "Thank you for sharing this. Takes courage to talk about failures openly. These lessons are gold for first-time founders like me.",
              timestamp: Date.now() - 11 * 60 * 60 * 1000,
              likes: 9,
              isLiked: true,
            }
          ],
          tags: ["failure", "lessons", "startup", "learning"],
          isLiked: true,
          isPinned: false,
          isTrending: false,
          isModerated: true,
          reportCount: 0,
        },
      ];

      // Identify trending posts (high engagement in last 24 hours)
      const trendingPosts = mockPosts.filter(post => post.isTrending);
      
      set({ 
        posts: mockPosts, 
        trendingPosts,
        isLoading: false 
      });
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
      isModerated: false, // New posts need moderation
      reportCount: 0,
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
      isLiked: false,
    };

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }));
  },

  likeComment: (commentId) => {
    set((state) => ({
      posts: state.posts.map((post) => ({
        ...post,
        comments: post.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked,
              }
            : comment
        ),
      })),
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
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId 
          ? { 
              ...post, 
              reportCount: (post.reportCount || 0) + 1,
              isModerated: false // Needs re-moderation
            } 
          : post
      ),
    }));
    
    // In a real app, this would send a report to moderators
    console.log(`Post ${postId} reported for: ${reason}`);
  },

  markTrending: (postId) => {
    set((state) => {
      const updatedPosts = state.posts.map((post) =>
        post.id === postId ? { ...post, isTrending: true } : post
      );
      
      const trendingPosts = updatedPosts.filter(post => post.isTrending);
      
      return {
        posts: updatedPosts,
        trendingPosts,
      };
    });
  },

  moderatePost: (postId, action) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId 
          ? { 
              ...post, 
              isModerated: action === "approve",
              // Remove post from feed if removed by moderator
              ...(action === "remove" && { content: "[Content removed by moderator]" })
            } 
          : post
      ),
    }));
  },

  getTrendingPosts: () => {
    return get().trendingPosts;
  },

  getPostsByTag: (tag) => {
    return get().posts.filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  },

  searchPosts: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().posts.filter(post =>
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.authorName.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
}));