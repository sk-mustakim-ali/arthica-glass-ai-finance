// Mock data for Student Dashboard - Demo Mode

import { 
  StudentProfile, 
  StudentExpense, 
  StudentBudget, 
  StudentGoal, 
  Challenge, 
  Subscription,
  HabitTracker,
  InsightCard,
  Badge,
  AIMessage,
  ExpenseCategory
} from '../types/student';

export const mockStudentProfile: StudentProfile = {
  id: 'student-1',
  userId: 'user-1',
  displayName: 'Alex',
  college: 'IIT Delhi',
  year: '3rd Year',
  pocketMoney: 15000,
  dailyLimit: 500,
  theme: 'neon',
  aiPersona: 'friendly-bro',
  spendingPersonality: 'foodie',
  points: 2450,
  level: 5,
  badges: [
    { id: 'b1', type: 'budget-beast', name: 'Budget Beast', description: 'Stayed under budget for 7 days', icon: '🏆', earnedAt: new Date('2024-01-15'), rarity: 'rare' },
    { id: 'b2', type: 'streak-master', name: 'Streak Master', description: '30-day logging streak', icon: '🔥', earnedAt: new Date('2024-02-01'), rarity: 'epic' },
    { id: 'b3', type: 'zomato-warrior', name: 'Zomato Warrior', description: 'Survived No Zomato Week', icon: '🍔', earnedAt: new Date('2024-01-20'), rarity: 'rare' },
  ],
  streaks: {
    logging: 15,
    budget: 8,
    habit: 5,
    lastLogDate: new Date(),
  },
  createdAt: new Date('2024-01-01'),
};

export const mockExpenses: StudentExpense[] = [
  { id: 'e1', userId: 'user-1', amount: 180, category: 'food', description: 'Maggi + Cold Coffee', date: new Date(), emoji: '🍜' },
  { id: 'e2', userId: 'user-1', amount: 50, category: 'travel', description: 'Metro to college', date: new Date(), emoji: '🚇' },
  { id: 'e3', userId: 'user-1', amount: 299, category: 'entertainment', description: 'Movie with friends', date: new Date(Date.now() - 86400000), emoji: '🎬', splitWith: [
    { id: 's1', name: 'Rahul', amount: 100, paid: true, reliabilityScore: 'bill-hero' },
    { id: 's2', name: 'Priya', amount: 100, paid: false, reliabilityScore: 'sometimes-late' },
  ]},
  { id: 'e4', userId: 'user-1', amount: 450, category: 'food', description: 'Zomato order', date: new Date(Date.now() - 86400000), emoji: '🍕' },
  { id: 'e5', userId: 'user-1', amount: 120, category: 'shopping', description: 'Stationery', date: new Date(Date.now() - 172800000), emoji: '✏️' },
  { id: 'e6', userId: 'user-1', amount: 80, category: 'social', description: 'Chai with seniors', date: new Date(Date.now() - 172800000), emoji: '☕' },
  { id: 'e7', userId: 'user-1', amount: 199, category: 'subscriptions', description: 'Spotify Premium', date: new Date(Date.now() - 259200000), emoji: '🎵' },
  { id: 'e8', userId: 'user-1', amount: 250, category: 'education', description: 'Coursera subscription', date: new Date(Date.now() - 345600000), emoji: '📚' },
  { id: 'e9', userId: 'user-1', amount: 350, category: 'food', description: 'Pizza party', date: new Date(Date.now() - 432000000), emoji: '🍕' },
  { id: 'e10', userId: 'user-1', amount: 100, category: 'health', description: 'Medicines', date: new Date(Date.now() - 518400000), emoji: '💊' },
];

export const mockBudget: StudentBudget = {
  id: 'budget-1',
  userId: 'user-1',
  month: new Date().toISOString().slice(0, 7),
  totalBudget: 15000,
  spent: 8750,
  categoryBudgets: [
    { category: 'food', budget: 5000, spent: 3200 },
    { category: 'travel', budget: 2000, spent: 1100 },
    { category: 'entertainment', budget: 2500, spent: 1800 },
    { category: 'shopping', budget: 2000, spent: 900 },
    { category: 'subscriptions', budget: 1000, spent: 650 },
    { category: 'education', budget: 1500, spent: 500 },
    { category: 'health', budget: 500, spent: 200 },
    { category: 'social', budget: 500, spent: 400 },
  ],
};

export const mockGoals: StudentGoal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    name: 'New MacBook',
    emoji: '💻',
    targetAmount: 100000,
    savedAmount: 35000,
    deadline: new Date('2024-12-31'),
    milestones: [
      { percentage: 25, reached: true, reachedAt: new Date('2024-02-01') },
      { percentage: 50, reached: false },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
    completed: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    name: 'Goa Trip',
    emoji: '🏖️',
    targetAmount: 25000,
    savedAmount: 18000,
    deadline: new Date('2024-06-30'),
    milestones: [
      { percentage: 25, reached: true, reachedAt: new Date('2024-01-15') },
      { percentage: 50, reached: true, reachedAt: new Date('2024-02-10') },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
    completed: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    name: 'Emergency Fund',
    emoji: '🛡️',
    targetAmount: 10000,
    savedAmount: 10000,
    milestones: [
      { percentage: 25, reached: true },
      { percentage: 50, reached: true },
      { percentage: 75, reached: true },
      { percentage: 100, reached: true },
    ],
    completed: true,
    createdAt: new Date('2023-11-01'),
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: 'ch1',
    name: '7-Day No Zomato Challenge',
    description: 'Survive a week without ordering from Zomato. Cook or eat at canteen!',
    emoji: '🍔🚫',
    type: 'weekly',
    target: 7,
    reward: 100,
    participants: 234,
    leaderboard: [
      { rank: 1, name: 'Shreya', progress: 7, avatar: '' },
      { rank: 2, name: 'Arjun', progress: 6 },
      { rank: 3, name: 'Neha', progress: 5 },
      { rank: 4, name: 'You', progress: 4, isCurrentUser: true },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 604800000),
  },
  {
    id: 'ch2',
    name: '₹100/day Survival Challenge',
    description: 'Can you survive spending only ₹100 per day for a week?',
    emoji: '💰',
    type: 'weekly',
    target: 7,
    reward: 150,
    participants: 156,
    leaderboard: [
      { rank: 1, name: 'Vikram', progress: 5 },
      { rank: 2, name: 'You', progress: 3, isCurrentUser: true },
      { rank: 3, name: 'Aisha', progress: 2 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 604800000),
  },
  {
    id: 'ch3',
    name: 'No Swiggy Weekend',
    description: 'Skip Swiggy this entire weekend. Your wallet will thank you!',
    emoji: '🏠',
    type: 'daily',
    target: 2,
    reward: 50,
    participants: 89,
    leaderboard: [],
    startDate: new Date(),
    endDate: new Date(Date.now() + 172800000),
  },
];

export const mockSubscriptions: Subscription[] = [
  { id: 'sub1', name: 'Spotify', category: 'Music', amount: 119, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 864000000), isActive: true },
  { id: 'sub2', name: 'Netflix', category: 'Entertainment', amount: 199, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 1296000000), isActive: true },
  { id: 'sub3', name: 'Amazon Prime', category: 'Shopping', amount: 1499, billingCycle: 'yearly', nextBilling: new Date(Date.now() + 15552000000), isActive: true },
  { id: 'sub4', name: 'Canva Pro', category: 'Productivity', amount: 499, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 432000000), isActive: true },
  { id: 'sub5', name: 'YouTube Premium', category: 'Entertainment', amount: 129, billingCycle: 'monthly', nextBilling: new Date(Date.now() + 1728000000), isActive: false },
];

export const mockHabits: HabitTracker[] = [
  { id: 'h1', name: 'No junk food', emoji: '🥗', streak: 5, completedDates: [], target: 'daily' },
  { id: 'h2', name: 'Log expenses', emoji: '📝', streak: 15, completedDates: [], target: 'daily' },
  { id: 'h3', name: 'Save ₹100', emoji: '💰', streak: 8, completedDates: [], target: 'daily' },
];

export const mockInsights: InsightCard[] = [
  {
    id: 'i1',
    type: 'spending',
    title: 'Food Spending Alert',
    description: 'You ordered fast food 14 times this month. Switch 3 orders to canteen to save ₹900!',
    emoji: '🍔',
    actionText: 'View food expenses',
    savingsAmount: 900,
  },
  {
    id: 'i2',
    type: 'prediction',
    title: 'Budget Warning',
    description: 'At this rate, you\'ll exceed your entertainment budget by ₹500 this month.',
    emoji: '⚠️',
    actionText: 'Adjust budget',
  },
  {
    id: 'i3',
    type: 'habit',
    title: 'Great streak!',
    description: 'You\'ve logged expenses for 15 days straight! Keep it up for bonus points.',
    emoji: '🔥',
  },
  {
    id: 'i4',
    type: 'tip',
    title: 'Student Hack',
    description: 'Your college library has free Grammarly access. Cancel your subscription to save ₹299/month.',
    emoji: '💡',
    savingsAmount: 299,
  },
];

export const mockAIMessages: AIMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: "Yo! I'm your finance buddy 😎 I noticed you've been ordering a lot from Zomato lately. Want me to help you find some savings there?",
    timestamp: new Date(Date.now() - 3600000),
    persona: 'friendly-bro',
  },
];

// Helper to get today's spending
export const getTodaySpending = (): number => {
  const today = new Date().toDateString();
  return mockExpenses
    .filter(e => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + e.amount, 0);
};

// Helper to get weekly spending by category
export const getWeeklySpendingByCategory = (): Record<ExpenseCategory, number> => {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const result: Record<ExpenseCategory, number> = {
    food: 0, travel: 0, entertainment: 0, shopping: 0, 
    education: 0, subscriptions: 0, health: 0, social: 0, other: 0
  };
  
  mockExpenses
    .filter(e => new Date(e.date) >= weekAgo)
    .forEach(e => { result[e.category] += e.amount; });
  
  return result;
};

// Vibe messages for dashboard
export const VIBE_MESSAGES = [
  "You're doing great! Keep that budget energy going 💪",
  "Small savings = Big dreams ✨",
  "Every rupee counts, and you're counting them all! 🎯",
  "Your future self will thank you for saving today 🙏",
  "Budget check: You're killing it! 🔥",
  "Money moves looking good today 💸",
  "Stay focused, stay saving! 🎓",
];

export const getRandomVibeMessage = (): string => {
  return VIBE_MESSAGES[Math.floor(Math.random() * VIBE_MESSAGES.length)];
};
