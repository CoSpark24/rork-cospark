import { UserProfile, UserRole, PitchDeck } from '@/types';

export const currentUser: UserProfile = {
  id: 'user_1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  role: UserRole.FOUNDER,
  bio: 'Serial entrepreneur with 10+ years of experience in SaaS and fintech. Looking for a technical co-founder for my new AI-powered fintech startup.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  location: 'Bangalore, India',
  skills: ['Business Development', 'Marketing', 'Product Management', 'Finance', 'Sales'],
  interests: ['Fintech', 'AI/ML', 'SaaS', 'Marketplace', 'E-commerce'],
  experience: '10+ years in startups, previously founded 2 companies with successful exits',
  education: 'MBA from IIM Bangalore, B.Tech from IIT Delhi',
  website: 'https://rahulsharma.com',
  social: {
    linkedin: 'linkedin.com/in/rahulsharma',
    twitter: 'twitter.com/rahulsharma',
  },
  createdAt: 1672531200000, // Jan 1, 2023
  lastActive: Date.now(),
  isVerified: true,
  isPremium: true,
  settings: {
    notifications: {
      email: true,
      push: true,
      matches: true,
      messages: true,
      events: true,
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessaging: true,
    },
    theme: 'light',
    language: 'en',
  },
};

export const users: UserProfile[] = [
  currentUser,
  {
    id: 'user_2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: UserRole.FOUNDER,
    bio: 'Full-stack developer with expertise in React, Node.js, and AWS. Looking for a business co-founder to help scale my SaaS product.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    location: 'Mumbai, India',
    skills: ['Software Development', 'UI/UX Design', 'Product Management', 'Data Science', 'AI/ML'],
    interests: ['SaaS', 'Edtech', 'AI/ML', 'Mobile Apps', 'Enterprise Software'],
    createdAt: 1675209600000, // Feb 1, 2023
    lastActive: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 'user_3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    role: UserRole.INVESTOR,
    bio: 'Angel investor with a focus on early-stage tech startups. Previously founded and exited a successful e-commerce company.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    location: 'Delhi, India',
    skills: ['Business Development', 'Finance', 'Operations', 'Sales', 'Marketing'],
    interests: ['Fintech', 'E-commerce', 'Healthtech', 'SaaS', 'AI/ML'],
    createdAt: 1677628800000, // Mar 1, 2023
    lastActive: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'user_4',
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    role: UserRole.MENTOR,
    bio: 'Product leader with experience at Google and Microsoft. Passionate about helping early-stage founders build great products.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    location: 'Hyderabad, India',
    skills: ['Product Management', 'UI/UX Design', 'Marketing', 'Business Development', 'Data Science'],
    interests: ['SaaS', 'Mobile Apps', 'AI/ML', 'Consumer Products', 'Social Impact'],
    createdAt: 1680307200000, // Apr 1, 2023
    lastActive: Date.now() - 172800000, // 2 days ago
  },
  {
    id: 'user_5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    role: UserRole.FOUNDER,
    bio: 'Hardware engineer with a background in IoT and robotics. Looking for a software co-founder to build a smart home automation platform.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    location: 'Pune, India',
    skills: ['Hardware', 'IoT', 'Product Management', 'Operations', 'Business Development'],
    interests: ['IoT', 'Hardware', 'AI/ML', 'Consumer Products', 'Sustainability'],
    createdAt: 1682899200000, // May 1, 2023
    lastActive: Date.now() - 259200000, // 3 days ago
  },
];

export const pitchDeckSamples: PitchDeck[] = [
  {
    id: 'deck_1',
    userId: 'user_1',
    title: 'FinTech Revolution',
    description: 'A revolutionary fintech platform for small businesses',
    slides: [],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
    isPublic: false,
    createdAt: 1685577600000, // June 1, 2023
    updatedAt: 1685577600000,
    tags: ['Fintech', 'SaaS'],
    status: 'draft',
  },
  {
    id: 'deck_2',
    userId: 'user_1',
    title: 'AI-Powered Education',
    description: 'Personalized learning through artificial intelligence',
    slides: [],
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
    isPublic: true,
    createdAt: 1688169600000, // July 1, 2023
    updatedAt: 1688169600000,
    tags: ['Edtech', 'AI'],
    status: 'published',
  },
  {
    id: 'deck_3',
    userId: 'user_2',
    title: 'Sustainable Living',
    description: 'Eco-friendly solutions for modern households',
    slides: [],
    coverImage: 'https://images.unsplash.com/photo-1545324410-cc1a3fa10c00?w=200&h=200&fit=crop',
    isPublic: false,
    createdAt: 1690848000000, // August 1, 2023
    updatedAt: 1690848000000,
    tags: ['Sustainability', 'Consumer'],
    status: 'draft',
  },
];