// Student Module Types - Gen-Z Financial App

export type SpendingPersonality = 'foodie' | 'explorer' | 'saver' | 'shopaholic' | 'minimalist' | 'socialite';

export type AIPersona = 'friendly-bro' | 'strict-sister' | 'zen-monk' | 'finance-nerd' | 'sass-queen';

export type ThemeStyle = 'neon' | 'anime' | 'pastel' | 'dark' | 'vaporwave';

export type BadgeType = 
  | 'zomato-warrior' 
  | 'budget-beast' 
  | 'goal-crusher' 
  | 'finance-nerd' 
  | 'zero-ghost' 
  | 'streak-master'
  | 'challenge-champion'
  | 'savings-hero';

export interface StudentProfile {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  college?: string;
  year?: string;
  pocketMoney: number;
  dailyLimit: number;
  theme: ThemeStyle;
  aiPersona: AIPersona;
  spendingPersonality?: SpendingPersonality;
  points: number;
  level: number;
  badges: Badge[];
  streaks: Streaks;
  createdAt: Date;
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Streaks {
  logging: number;
  budget: number;
  habit: number;
  lastLogDate?: Date;
}

export interface StudentExpense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  emoji: string;
  splitWith?: SplitParticipant[];
  tags?: string[];
}

export type ExpenseCategory = 
  | 'food' 
  | 'travel' 
  | 'entertainment' 
  | 'shopping' 
  | 'education' 
  | 'subscriptions'
  | 'health'
  | 'social'
  | 'other';

export interface CategoryConfig {
  id: ExpenseCategory;
  name: string;
  emoji: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: 'food', name: 'Food', emoji: '🍔', color: 'hsl(25 95% 53%)' },
  { id: 'travel', name: 'Travel', emoji: '🚕', color: 'hsl(210 100% 50%)' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎮', color: 'hsl(280 70% 60%)' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: 'hsl(340 80% 60%)' },
  { id: 'education', name: 'Education', emoji: '📚', color: 'hsl(160 60% 45%)' },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '📱', color: 'hsl(200 80% 50%)' },
  { id: 'health', name: 'Health', emoji: '💊', color: 'hsl(0 70% 50%)' },
  { id: 'social', name: 'Social', emoji: '🎉', color: 'hsl(45 90% 50%)' },
  { id: 'other', name: 'Other', emoji: '📦', color: 'hsl(220 15% 50%)' },
];

export interface SplitParticipant {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  reliabilityScore: 'bill-hero' | 'reliable' | 'sometimes-late' | 'ghost-payer';
}

export interface StudentBudget {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  totalBudget: number;
  spent: number;
  categoryBudgets: CategoryBudget[];
}

export interface CategoryBudget {
  category: ExpenseCategory;
  budget: number;
  spent: number;
}

export interface StudentGoal {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: Date;
  milestones: GoalMilestone[];
  completed: boolean;
  createdAt: Date;
}

export interface GoalMilestone {
  percentage: number;
  reached: boolean;
  reachedAt?: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  reward: number; // points
  participants: number;
  leaderboard: LeaderboardEntry[];
  startDate: Date;
  endDate: Date;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  progress: number;
  isCurrentUser?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: Date;
  logo?: string;
  isActive: boolean;
}

export interface HabitTracker {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedDates: Date[];
  target: 'daily' | 'weekly';
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  persona?: AIPersona;
}

export interface InsightCard {
  id: string;
  type: 'spending' | 'habit' | 'prediction' | 'tip';
  title: string;
  description: string;
  emoji: string;
  actionText?: string;
  savingsAmount?: number;
}

// Gamification
export interface PointsTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: Date;
}

export const POINTS_CONFIG = {
  LOG_EXPENSE: 10,
  UNDER_DAILY_LIMIT: 20,
  COMPLETE_CHALLENGE: 50,
  REACH_GOAL: 100,
  STREAK_7_DAYS: 30,
  STREAK_30_DAYS: 150,
};
