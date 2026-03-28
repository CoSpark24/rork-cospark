import { create } from "zustand";
import { Event, EventRSVP, EventQuestion } from "@/types";
import { useAuthStore } from "./auth-store";

interface EventsState {
  events: Event[];
  userRSVPs: EventRSVP[];
  eventQuestions: Record<string, EventQuestion[]>;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<void>;
  rsvpToEvent: (eventId: string, status: EventRSVP['status']) => void;
  getUserRSVP: (eventId: string) => EventRSVP | undefined;
  submitQuestion: (eventId: string, question: string) => void;
  upvoteQuestion: (questionId: string) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  getEventQuestions: (eventId: string) => EventQuestion[];
  joinLiveEvent: (eventId: string) => Promise<string>;
  getLiveEvents: () => Event[];
  getUpcomingEvents: () => Event[];
  startEventCountdown: (eventId: string) => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  userRSVPs: [],
  eventQuestions: {},
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock events data with enhanced live features
      const mockEvents: Event[] = [
        {
          id: "event1",
          title: "Startup Pitch Night - Live Demo Day",
          description: "Join us for an evening of startup pitches from early-stage founders. Network with investors and fellow entrepreneurs. Live Q&A with judges and audience voting.",
          type: "pitch",
          startTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
          endTime: Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000, // 3 hours duration
          isOnline: false,
          location: "Bangalore, India",
          organizer: "TechHub Bangalore",
          attendeeCount: 45,
          maxAttendees: 100,
          tags: ["pitching", "networking", "investors", "demo"],
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          isTicketed: true,
          price: 500,
          currency: "₹",
          liveQAEnabled: true,
          hasCountdown: true,
          streamingPlatform: "zoom",
        },
        {
          id: "event2",
          title: "AI in Startups: Live AMA with Industry Experts",
          description: "Ask Me Anything session with AI startup founders and investors. Learn about the latest trends and opportunities in AI. Live coding demos and real-time Q&A.",
          type: "ama",
          startTime: Date.now() + 30 * 60 * 1000, // 30 minutes from now (live event)
          endTime: Date.now() + 2.5 * 60 * 60 * 1000, // 2.5 hours duration
          isOnline: true,
          meetingUrl: "https://zoom.us/j/123456789",
          organizer: "AI Founders Club",
          attendeeCount: 120,
          tags: ["ai", "ama", "technology", "live"],
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          liveQAEnabled: true,
          isLive: true,
          streamingPlatform: "youtube",
          streamingUrl: "https://youtube.com/live/abc123",
        },
        {
          id: "event3",
          title: "Fundraising 101: Interactive Workshop",
          description: "Comprehensive workshop on fundraising strategies, pitch deck creation, and investor relations. Includes breakout sessions and 1-on-1 mentoring.",
          type: "workshop",
          startTime: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
          endTime: Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000, // 4 hours duration
          isOnline: true,
          meetingUrl: "https://zoom.us/j/987654321",
          organizer: "Startup Academy",
          attendeeCount: 85,
          maxAttendees: 150,
          tags: ["fundraising", "workshop", "investors", "interactive"],
          image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          isTicketed: true,
          price: 1500,
          currency: "₹",
          liveQAEnabled: true,
          hasCountdown: true,
          streamingPlatform: "zoom",
        },
        {
          id: "event4",
          title: "Global Startup Conference 2024",
          description: "The biggest startup conference of the year featuring keynotes from unicorn founders, investor panels, and networking sessions.",
          type: "conference",
          startTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
          endTime: Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000, // 8 hours duration
          isOnline: false,
          location: "Mumbai, India",
          organizer: "Global Startup Network",
          attendeeCount: 500,
          maxAttendees: 1000,
          tags: ["conference", "networking", "keynotes", "global"],
          image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
          isTicketed: true,
          price: 5000,
          currency: "₹",
          liveQAEnabled: false,
          hasCountdown: true,
        },
      ];

      // Mock questions for events with enhanced Q&A features
      const mockQuestions: Record<string, EventQuestion[]> = {
        event2: [
          {
            id: "q1",
            eventId: "event2",
            userId: "user1",
            userName: "Rahul Sharma",
            question: "What are the key challenges in implementing AI for customer service in early-stage startups?",
            timestamp: Date.now() - 30 * 60 * 1000,
            isAnswered: true,
            upvotes: 15,
            answer: "Great question! The main challenges are data quality, integration complexity, and cost management. Start with simple chatbots and gradually build complexity.",
            answeredBy: "Dr. Sarah Chen, AI Expert",
            answeredAt: Date.now() - 20 * 60 * 1000,
          },
          {
            id: "q2",
            eventId: "event2",
            userId: "user2",
            userName: "Priya Patel",
            question: "How do you handle data privacy concerns when building AI products for global markets?",
            timestamp: Date.now() - 15 * 60 * 1000,
            isAnswered: false,
            upvotes: 23,
          },
          {
            id: "q3",
            eventId: "event2",
            userId: "user3",
            userName: "Vikram Singh",
            question: "What's the minimum viable dataset size for training a custom AI model?",
            timestamp: Date.now() - 10 * 60 * 1000,
            isAnswered: false,
            upvotes: 8,
          },
        ],
        event1: [
          {
            id: "q4",
            eventId: "event1",
            userId: "user4",
            userName: "Ananya Desai",
            question: "How do you evaluate the market potential during a 3-minute pitch?",
            timestamp: Date.now() - 45 * 60 * 1000,
            isAnswered: false,
            upvotes: 12,
          },
        ],
      };
      
      set({ 
        events: mockEvents, 
        eventQuestions: mockQuestions,
        isLoading: false 
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  },

  createEvent: async (eventData) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    const newEvent: Event = {
      id: `event_${Date.now()}`,
      title: eventData.title || "Untitled Event",
      description: eventData.description || "",
      type: eventData.type || "networking",
      startTime: eventData.startTime || Date.now(),
      endTime: eventData.endTime || Date.now() + 2 * 60 * 60 * 1000,
      isOnline: eventData.isOnline || false,
      location: eventData.location,
      meetingUrl: eventData.meetingUrl,
      organizer: currentUser.name,
      attendeeCount: 0,
      maxAttendees: eventData.maxAttendees,
      tags: eventData.tags || [],
      image: eventData.image,
      isTicketed: eventData.isTicketed || false,
      price: eventData.price,
      currency: eventData.currency || "₹",
      liveQAEnabled: eventData.liveQAEnabled || false,
      streamingPlatform: eventData.streamingPlatform || "zoom",
      hasCountdown: eventData.hasCountdown || false,
    };

    set((state) => ({
      events: [newEvent, ...state.events],
      eventQuestions: {
        ...state.eventQuestions,
        [newEvent.id]: [],
      },
    }));
  },

  rsvpToEvent: (eventId, status) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const existingRSVP = get().userRSVPs.find(rsvp => rsvp.eventId === eventId);
    
    if (existingRSVP) {
      // Update existing RSVP
      set((state) => ({
        userRSVPs: state.userRSVPs.map(rsvp =>
          rsvp.eventId === eventId ? { ...rsvp, status } : rsvp
        ),
      }));
    } else {
      // Create new RSVP
      const newRSVP: EventRSVP = {
        id: `rsvp_${Date.now()}`,
        eventId,
        userId: currentUser.id,
        status,
        timestamp: Date.now(),
        ticketId: status === 'going' ? `ticket_${Date.now()}` : undefined,
      };

      set((state) => ({
        userRSVPs: [...state.userRSVPs, newRSVP],
        events: state.events.map(event =>
          event.id === eventId && status === 'going'
            ? { ...event, attendeeCount: event.attendeeCount + 1 }
            : event
        ),
      }));
    }
  },

  getUserRSVP: (eventId) => {
    return get().userRSVPs.find(rsvp => rsvp.eventId === eventId);
  },

  submitQuestion: (eventId, question) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const newQuestion: EventQuestion = {
      id: `q_${Date.now()}`,
      eventId,
      userId: currentUser.id,
      userName: currentUser.name,
      question,
      timestamp: Date.now(),
      isAnswered: false,
      upvotes: 0,
    };

    set((state) => ({
      eventQuestions: {
        ...state.eventQuestions,
        [eventId]: [...(state.eventQuestions[eventId] || []), newQuestion],
      },
    }));
  },

  upvoteQuestion: (questionId) => {
    set((state) => {
      const newEventQuestions = { ...state.eventQuestions };
      
      Object.keys(newEventQuestions).forEach(eventId => {
        newEventQuestions[eventId] = newEventQuestions[eventId].map(q =>
          q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
        );
      });

      return { eventQuestions: newEventQuestions };
    });
  },

  answerQuestion: (questionId, answer) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    set((state) => {
      const newEventQuestions = { ...state.eventQuestions };
      
      Object.keys(newEventQuestions).forEach(eventId => {
        newEventQuestions[eventId] = newEventQuestions[eventId].map(q =>
          q.id === questionId 
            ? { 
                ...q, 
                isAnswered: true, 
                answer,
                answeredBy: currentUser.name,
                answeredAt: Date.now()
              } 
            : q
        );
      });

      return { eventQuestions: newEventQuestions };
    });
  },

  getEventQuestions: (eventId) => {
    const questions = get().eventQuestions[eventId] || [];
    // Sort by upvotes (descending) and then by timestamp (newest first)
    return questions.sort((a, b) => {
      if (a.upvotes !== b.upvotes) {
        return b.upvotes - a.upvotes;
      }
      return b.timestamp - a.timestamp;
    });
  },

  joinLiveEvent: async (eventId) => {
    const event = get().events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    // Simulate joining live event
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the streaming URL or meeting URL
    return event.streamingUrl || event.meetingUrl || "https://zoom.us/j/live-event";
  },

  getLiveEvents: () => {
    const now = Date.now();
    return get().events.filter(event => 
      event.isLive || (event.startTime <= now && event.endTime >= now)
    );
  },

  getUpcomingEvents: () => {
    const now = Date.now();
    return get().events
      .filter(event => event.startTime > now)
      .sort((a, b) => a.startTime - b.startTime);
  },

  startEventCountdown: (eventId) => {
    // This would typically be handled by a real-time service
    // For demo purposes, we'll just mark the event as having a countdown
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId ? { ...event, hasCountdown: true } : event
      ),
    }));
  },
}));