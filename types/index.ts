export enum UserRole {
  FOUNDER = "Founder",
  CO_FOUNDER = "Co-founder",
  INVESTOR = "Investor",
  MENTOR = "Mentor",
}

export enum StartupStage {
  IDEATION = "Ideation",
  VALIDATION = "Validation",
  MVP = "MVP",
  EARLY_TRACTION = "Early Traction",
  SCALING = "Scaling",
  GROWTH = "Growth",
}

export enum FundingStatus {
  BOOTSTRAPPED = "Bootstrapped",
  PRE_SEED = "Pre-seed",
  SEED = "Seed",
  SERIES_A = "Series A",
  SERIES_B = "Series B",
  SERIES_B_PLUS = "Series B+",
}

export enum InvestmentStage {
  PRE_SEED = "Pre-seed",
  SEED = "Seed",
  SERIES_A = "Series A",
  SERIES_B = "Series B",
  SERIES_C_PLUS = "Series C+",
}

export enum Industry {
  TECHNOLOGY = "Technology",
  HEALTHCARE = "Healthcare",
  HEALTHTECH = "HealthTech",
  FINTECH = "Fintech",
  ECOMMERCE = "E-commerce",
  EDUCATION = "Education",
  EDTECH = "EdTech",
  REAL_ESTATE = "Real Estate",
  FOOD_BEVERAGE = "Food & Beverage",
  TRAVEL = "Travel",
  ENTERTAINMENT = "Entertainment",
  SUSTAINABILITY = "Sustainability",
  AI_ML = "AI/ML",
  BLOCKCHAIN = "Blockchain",
  SAAS = "SaaS",
  FASHION = "Fashion",
  BIOTECH = "BioTech",
}

export enum Availability {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  WEEKENDS = "Weekends",
  EVENINGS = "Evenings",
  FLEXIBLE = "Flexible",
}

export enum AuthMethod {
  EMAIL = "email",
  PHONE = "phone",
}

export enum SubscriptionPlan {
  FREE = "Free",
  PRO = "Pro",
  ENTERPRISE = "Enterprise",
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: number;
}

export interface UserStats {
  profileViews: number;
  connectionsCount: number;
  pitchDecksCreated: number;
  eventsAttended: number;
  messagesExchanged: number;
  growthScore: number;
  streakDays: number;
  weeklyActivity: number;
}

export interface CompatibilityFactor {
  factor: string;
  score: number;
  description: string;
}

export interface SubscriptionFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface SubscriptionData {
  plan: SubscriptionPlan;
  price: number;
  currency?: string;
  features: SubscriptionFeature[];
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  bio: string;
  location: string;
  skills: string[];
  experience?: string;
  industry?: Industry;
  stage?: StartupStage;
  fundingStatus?: FundingStatus;
  availability?: Availability;
  lookingFor?: string[];
  investmentRange?: string;
  avatar?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  createdAt: number;
  badges?: Badge[];
  stats?: UserStats;
  startupIdea?: string;
  vision?: string;
  videoIntro?: string;
  streakDays?: number;
  investmentFocus?: Industry[];
  portfolioCompanies?: string[];
  sectors?: string[];
  mentoringAreas?: Industry[];
  subscription?: SubscriptionPlan;
}

export interface LoginCredentials {
  method: AuthMethod;
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface SignupData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: UserRole;
}

export interface MatchProfile extends UserProfile {
  matchScore: number;
  matchReasons: string[];
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  participants: UserProfile[];
  type: "video" | "in-person" | "phone";
  location?: string;
  meetingUrl?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface PitchDeckData {
  companyName: string;
  tagline: string;
  problem: string;
  solution: string;
  marketSize: string;
  businessModel: string;
  competition: string;
  traction: string;
  team: string;
  financials: string;
  funding: string;
  useOfFunds: string;
  industry: Industry;
  stage: StartupStage;
}

export interface BusinessPlanData {
  companyName: string;
  executiveSummary: string;
  companyDescription: string;
  marketAnalysis: string;
  organizationManagement: string;
  serviceProductLine: string;
  marketingSales: string;
  fundingRequest: string;
  financialProjections: string;
  appendix: string;
  industry: Industry;
  stage: StartupStage;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  animation: string;
  backgroundColor: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "networking" | "workshop" | "pitch" | "conference" | "ama" | "webinar";
  startTime: number;
  endTime: number;
  isOnline: boolean;
  location?: string;
  meetingUrl?: string;
  organizer: string;
  attendeeCount: number;
  maxAttendees?: number;
  tags: string[];
  image?: string;
  price?: number;
  currency?: string;
  isTicketed?: boolean;
  liveQAEnabled?: boolean;
  recordingUrl?: string;
  streamingPlatform?: "zoom" | "youtube" | "custom";
  streamingUrl?: string;
  isLive?: boolean;
  hasCountdown?: boolean;
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  status: "going" | "maybe" | "not-going";
  timestamp: number;
  ticketId?: string;
}

export interface EventQuestion {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  question: string;
  timestamp: number;
  isAnswered: boolean;
  upvotes: number;
  answer?: string;
  answeredBy?: string;
  answeredAt?: number;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: "update" | "question" | "achievement" | "announcement";
  timestamp: number;
  likes: number;
  comments: FeedComment[];
  tags: string[];
  images?: string[];
  isLiked?: boolean;
  isPinned?: boolean;
  isTrending?: boolean;
  isModerated?: boolean;
  reportCount?: number;
}

export interface FeedComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}

export interface FounderCircle {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  createdBy: string;
  createdAt: number;
  tags: string[];
  avatar?: string;
  isJoined?: boolean;
  lastActivity?: number;
  category: string;
}

export interface CircleMessage {
  id: string;
  circleId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
  type: "message" | "announcement" | "poll";
  isModerated?: boolean;
}

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  timestamp: number;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  type: "text" | "image" | "link" | "poll";
  media?: string[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVoted?: number;
  };
}

export interface Comment {
  id: string;
  author: UserProfile;
  content: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
  image?: string;
  tags: string[];
}

export interface CrowdfundingCampaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  creator: UserProfile;
  image?: string;
  category: string;
  rewards: CampaignReward[];
}

export interface CampaignReward {
  id: string;
  title: string;
  description: string;
  amount: number;
  backers: number;
  estimatedDelivery: string;
}

export interface Investor {
  id: string;
  name: string;
  firm: string;
  focus: string[];
  stage: StartupStage[];
  checkSize: string;
  location: string;
  portfolio: string[];
  bio: string;
  avatar?: string;
  linkedIn?: string;
  email?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  category: "product" | "business" | "funding" | "team" | "marketing";
  priority: "low" | "medium" | "high";
  progress: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

export interface IdeaValidation {
  id: string;
  idea: string;
  targetMarket: string;
  problemStatement: string;
  solution: string;
  score: number;
  feedback: ValidationFeedback[];
  createdAt: number;
}

export interface ValidationFeedback {
  category: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface Conversation {
  id: string;
  participants: UserProfile[];
  lastMessage?: Message;
  updatedAt: number;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator";
  permissions: string[];
  createdAt: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  validUntil: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  targetUsers: string[];
  scheduledAt?: number;
  sentAt?: number;
  status: "draft" | "scheduled" | "sent";
  createdBy: string;
}

export interface ContentReport {
  id: string;
  contentType: "post" | "comment" | "user" | "event";
  contentId: string;
  reportedBy: string;
  reason: string;
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reviewedBy?: string;
  reviewedAt?: number;
  createdAt: number;
}