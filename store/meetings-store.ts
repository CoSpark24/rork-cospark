import { create } from "zustand";
import { Meeting, UserProfile } from "@/types";
import { useAuthStore } from "./auth-store";

interface MeetingsState {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  fetchMeetings: () => Promise<void>;
  scheduleMeeting: (meetingData: Partial<Meeting>) => Promise<void>;
  cancelMeeting: (meetingId: string) => void;
  getUpcomingMeetings: () => Meeting[];
  getTodaysMeetings: () => Meeting[];
}

export const useMeetingsStore = create<MeetingsState>((set, get) => ({
  meetings: [],
  isLoading: false,
  error: null,

  fetchMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock meetings data
      const mockMeetings: Meeting[] = [
        {
          id: "meeting1",
          title: "Pitch Review with Sarah Johnson",
          description: "Review pitch deck and discuss potential partnership",
          startTime: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
          endTime: Date.now() + 3 * 60 * 60 * 1000, // 3 hours from now
          participants: [
            {
              id: "user2",
              name: "Sarah Johnson",
              email: "sarah@example.com",
              role: "Co-founder" as any,
              bio: "",
              location: "New York, NY",
              skills: [],
              createdAt: Date.now(),
            }
          ],
          type: "video",
          meetingUrl: "https://zoom.us/j/123456789",
          status: "scheduled",
        },
        {
          id: "meeting2",
          title: "Investor Coffee Chat",
          description: "Informal chat with potential angel investor",
          startTime: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
          endTime: Date.now() + 25 * 60 * 60 * 1000,
          participants: [
            {
              id: "inv1",
              name: "Jennifer Park",
              email: "jennifer@vcfund.com",
              role: "Investor" as any,
              bio: "",
              location: "Palo Alto, CA",
              skills: [],
              createdAt: Date.now(),
            }
          ],
          type: "in-person",
          location: "Blue Bottle Coffee, SOMA",
          status: "scheduled",
        },
        {
          id: "meeting3",
          title: "Team Standup",
          description: "Weekly team sync and progress update",
          startTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // Next week
          endTime: Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
          participants: [
            {
              id: "user3",
              name: "David Kim",
              email: "david@example.com",
              role: "Co-founder" as any,
              bio: "",
              location: "Austin, TX",
              skills: [],
              createdAt: Date.now(),
            }
          ],
          type: "video",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          status: "scheduled",
        },
      ];
      
      set({ meetings: mockMeetings, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch meetings",
      });
    }
  },

  scheduleMeeting: async (meetingData) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error("User not authenticated");

    const newMeeting: Meeting = {
      id: `meeting_${Date.now()}`,
      title: meetingData.title || "Untitled Meeting",
      description: meetingData.description,
      startTime: meetingData.startTime || Date.now(),
      endTime: meetingData.endTime || Date.now() + 60 * 60 * 1000,
      participants: meetingData.participants || [],
      type: meetingData.type || "video",
      location: meetingData.location,
      meetingUrl: meetingData.meetingUrl,
      status: "scheduled",
    };

    set((state) => ({
      meetings: [newMeeting, ...state.meetings],
    }));
  },

  cancelMeeting: (meetingId) => {
    set((state) => ({
      meetings: state.meetings.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, status: "cancelled" as const }
          : meeting
      ),
    }));
  },

  getUpcomingMeetings: () => {
    const now = Date.now();
    return get().meetings
      .filter(meeting => meeting.startTime > now && meeting.status === "scheduled")
      .sort((a, b) => a.startTime - b.startTime);
  },

  getTodaysMeetings: () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    
    return get().meetings.filter(meeting => 
      meeting.startTime >= startOfDay && 
      meeting.startTime < endOfDay && 
      meeting.status === "scheduled"
    );
  },
}));