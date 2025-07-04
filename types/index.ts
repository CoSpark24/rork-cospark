export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  role: 'user' | 'admin';
  createdAt: number;
  hasCompletedOnboarding?: boolean;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  method: AuthMethod;
  name?: string;
}

export enum AuthMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface PitchDeck {
  id: string;
  title: string;
  description: string;
  slides: PitchSlide[];
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface PitchSlide {
  id: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business-model' | 'competition' | 'team' | 'financials' | 'funding';
  title: string;
  content: string;
  order: number;
}

export interface Match {
  id: string;
  user: UserProfile;
  compatibility: number;
  sharedInterests: string[];
  distance?: number;
  lastActive: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: UserProfile[];
  lastMessage?: Message;
  updatedAt: number;
}

export interface BusinessPlan {
  id: string;
  title: string;
  description: string;
  sections: BusinessPlanSection[];
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface BusinessPlanSection {
  id: string;
  type: 'executive-summary' | 'company-description' | 'market-analysis' | 'organization' | 'service-description' | 'marketing-sales' | 'funding-request' | 'financial-projections' | 'appendix';
  title: string;
  content: string;
  order: number;
}

export interface FeedPost {
  id: string;
  userId: string;
  user: UserProfile;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: number;
  isLiked?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: number;
  location: string;
  image?: string;
  attendees: number;
  maxAttendees?: number;
  price?: number;
  organizer: UserProfile;
  isAttending?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  category: string;
  isPrivate: boolean;
  isMember?: boolean;
}

export interface CrowdfundingProject {
  id: string;
  title: string;
  description: string;
  image?: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  creator: UserProfile;
  category: string;
}

export interface Investor {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  bio: string;
  focusAreas: string[];
  investmentRange: string;
  location: string;
  portfolio: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: number;
  completed: boolean;
  completedDate?: number;
  category: 'product' | 'business' | 'funding' | 'team' | 'marketing';
}

export interface IdeaValidation {
  id: string;
  title: string;
  description: string;
  score: number;
  feedback: string[];
  createdAt: number;
  userId: string;
}