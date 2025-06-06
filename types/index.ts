// User related types
export enum UserRole {
  FOUNDER = "founder",
  INVESTOR = "investor",
  MENTOR = "mentor",
  ADMIN = "admin"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole | string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  experience?: string;
  education?: string;
  website?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt: number;
  lastActive?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  settings?: UserSettings;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    matches: boolean;
    messages: boolean;
    events: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessaging: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
}

// Authentication related types
export enum AuthMethod {
  EMAIL = "email",
  PHONE = "phone",
  GOOGLE = "google",
  APPLE = "apple",
  FACEBOOK = "facebook"
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  method: AuthMethod;
}

export interface SignupData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  method: AuthMethod;
  role?: UserRole | string;
}

// Matching related types
export interface MatchProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: UserRole | string;
  skills: string[];
  interests: string[];
  bio: string;
  location?: string;
  compatibility: number;
  isOnline: boolean;
  lastActive?: number;
}

export interface Match {
  id: string;
  users: string[];
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
  updatedAt: number;
}

// Badge related types
export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  criteria?: string;
  earnedAt?: number;
}

// Messaging related types
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: Attachment[];
  status: "sent" | "delivered" | "read";
  createdAt: number;
}

export interface Attachment {
  id: string;
  type: "image" | "document" | "video" | "audio";
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

// Pitch Deck related types
export interface PitchDeck {
  id: string;
  userId: string;
  title: string;
  description?: string;
  slides: PitchDeckSlide[];
  coverImage?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  status: "draft" | "published";
}

export interface PitchDeckSlide {
  id: string;
  type: "cover" | "problem" | "solution" | "market" | "product" | "traction" | "team" | "competition" | "business_model" | "financials" | "ask" | "contact" | "custom";
  title: string;
  content: string;
  image?: string;
  order: number;
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  coverImage?: string;
  organizer: string;
  attendees: string[];
  maxAttendees?: number;
  price?: number;
  currency?: string;
  tags?: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

// Feed related types
export interface FeedItem {
  id: string;
  type: "post" | "event" | "match" | "pitch_deck" | "milestone";
  author: string;
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: number;
  likes: string[];
  replies?: Comment[];
}

// Subscription related types
export enum SubscriptionPlan {
  FREE = "Free",
  PRO = "Pro",
  ENTERPRISE = "Enterprise"
}

export interface SubscriptionData {
  plan: SubscriptionPlan;
  price: number;
  currency?: string;
  isPopular?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: number;
  }[];
}

// Business Plan related types
export interface BusinessPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  sections: BusinessPlanSection[];
  coverImage?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  status: "draft" | "published";
}

export interface BusinessPlanSection {
  id: string;
  type: "executive_summary" | "company_overview" | "market_analysis" | "products_services" | "marketing_strategy" | "operational_plan" | "management_team" | "financial_plan" | "funding_request" | "appendix" | "custom";
  title: string;
  content: string;
  order: number;
}

// Milestone related types
export interface Milestone {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: number;
  completedDate?: number;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

// Circle (Community) related types
export interface Circle {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  members: CircleMember[];
  posts: FeedItem[];
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export interface CircleMember {
  userId: string;
  role: "admin" | "moderator" | "member";
  joinedAt: number;
}

// Investor related types
export interface InvestorProfile extends UserProfile {
  investmentPreferences?: {
    stages: string[];
    sectors: string[];
    ticketSize: {
      min: number;
      max: number;
    };
    geographies: string[];
  };
  portfolio?: PortfolioCompany[];
  investmentHistory?: Investment[];
}

export interface PortfolioCompany {
  id: string;
  name: string;
  logo?: string;
  description: string;
  sector: string;
  stage: string;
  yearInvested: number;
  status: "active" | "exited" | "acquired" | "ipo" | "closed";
}

export interface Investment {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  date: number;
  round: string;
  notes?: string;
}

// Crowdfunding related types
export interface CrowdfundingCampaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage?: string;
  goal: number;
  currency: string;
  raised: number;
  backers: number;
  startDate: number;
  endDate: number;
  status: "draft" | "active" | "funded" | "expired";
  rewards: CrowdfundingReward[];
  updates: CrowdfundingUpdate[];
  createdAt: number;
  updatedAt: number;
}

export interface CrowdfundingReward {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  maxBackers?: number;
  currentBackers: number;
  estimatedDelivery?: number;
}

export interface CrowdfundingUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  author: string;
}

// Legal Template related types
export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: "incorporation" | "fundraising" | "employment" | "intellectual_property" | "privacy" | "terms" | "other";
  content: string;
  variables: LegalTemplateVariable[];
  createdAt: number;
  updatedAt: number;
}

export interface LegalTemplateVariable {
  id: string;
  name: string;
  description: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  options?: string[];
  required: boolean;
}

// Meeting related types
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  participants: string[];
  startTime: number;
  endTime: number;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: "match" | "message" | "event" | "milestone" | "system";
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  createdAt: number;
}

// Admin related types
export interface AdminStats {
  users: {
    total: number;
    active: number;
    new: number;
    premium: number;
  };
  content: {
    posts: number;
    comments: number;
    pitchDecks: number;
    businessPlans: number;
  };
  engagement: {
    messages: number;
    matches: number;
    eventAttendees: number;
  };
  revenue: {
    total: number;
    monthly: number;
    subscriptions: number;
    events: number;
  };
}

export interface AdminReport {
  id: string;
  type: "user" | "content" | "message";
  reportedItemId: string;
  reportedBy: string;
  reason: string;
  description?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: number;
  resolvedAt?: number;
  resolvedBy?: string;
}