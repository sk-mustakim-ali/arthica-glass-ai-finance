// Student Service - Data operations for Student Dashboard
// TODO: Replace localStorage with real backend when available

import { 
  StudentProfile, 
  StudentExpense, 
  StudentBudget, 
  StudentGoal,
  ExpenseCategory,
  POINTS_CONFIG
} from '../types/student';
import { 
  mockStudentProfile, 
  mockExpenses, 
  mockBudget, 
  mockGoals 
} from './mockStudentData';

const STORAGE_KEYS = {
  PROFILE: 'arthica-student-profile',
  EXPENSES: 'arthica-student-expenses',
  BUDGET: 'arthica-student-budget',
  GOALS: 'arthica-student-goals',
};

// Initialize student profile for new users
export const initializeStudentProfile = (userId: string, displayName: string): StudentProfile => {
  const profile: StudentProfile = {
    ...mockStudentProfile,
    id: `student-${Date.now()}`,
    userId,
    displayName,
    points: 0,
    level: 1,
    badges: [],
    streaks: { logging: 0, budget: 0, habit: 0 },
    createdAt: new Date(),
  };
  
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(mockExpenses));
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(mockBudget));
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(mockGoals));
  
  return profile;
};

// Get student profile
export const getStudentProfile = (userId: string): StudentProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) {
    const profile = JSON.parse(stored);
    if (profile.userId === userId) return profile;
  }
  return null;
};

// Update student profile
export const updateStudentProfile = (updates: Partial<StudentProfile>): StudentProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!stored) return null;
  
  const profile = { ...JSON.parse(stored), ...updates };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  return profile;
};

// Add points to profile
export const addPoints = (points: number, reason: string): void => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!stored) return;
  
  const profile = JSON.parse(stored);
  profile.points += points;
  
  // Level up every 500 points
  profile.level = Math.floor(profile.points / 500) + 1;
  
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// Get all expenses
export const getExpenses = (): StudentExpense[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return stored ? JSON.parse(stored) : mockExpenses;
};

// Add new expense
export const addExpense = (expense: Omit<StudentExpense, 'id'>): StudentExpense => {
  const expenses = getExpenses();
  const newExpense: StudentExpense = {
    ...expense,
    id: `exp-${Date.now()}`,
  };
  
  expenses.unshift(newExpense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  
  // Award points for logging
  addPoints(POINTS_CONFIG.LOG_EXPENSE, 'Logged expense');
  
  // Update budget spent
  const budget = getBudget();
  if (budget) {
    budget.spent += expense.amount;
    const catBudget = budget.categoryBudgets.find(c => c.category === expense.category);
    if (catBudget) catBudget.spent += expense.amount;
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }
  
  return newExpense;
};

// Delete expense
export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const expense = expenses.find(e => e.id === id);
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  
  // Update budget if expense found
  if (expense) {
    const budget = getBudget();
    if (budget) {
      budget.spent -= expense.amount;
      const catBudget = budget.categoryBudgets.find(c => c.category === expense.category);
      if (catBudget) catBudget.spent -= expense.amount;
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    }
  }
};

// Get budget
export const getBudget = (): StudentBudget | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
  return stored ? JSON.parse(stored) : mockBudget;
};

// Update category budget
export const updateCategoryBudget = (category: ExpenseCategory, newBudget: number): void => {
  const budget = getBudget();
  if (!budget) return;
  
  const catBudget = budget.categoryBudgets.find(c => c.category === category);
  if (catBudget) {
    const diff = newBudget - catBudget.budget;
    catBudget.budget = newBudget;
    budget.totalBudget += diff;
  }
  
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
};

// Get goals
export const getGoals = (): StudentGoal[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
  return stored ? JSON.parse(stored) : mockGoals;
};

// Add goal
export const addGoal = (goal: Omit<StudentGoal, 'id' | 'milestones' | 'completed' | 'createdAt'>): StudentGoal => {
  const goals = getGoals();
  const newGoal: StudentGoal = {
    ...goal,
    id: `goal-${Date.now()}`,
    milestones: [
      { percentage: 25, reached: false },
      { percentage: 50, reached: false },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
    completed: false,
    createdAt: new Date(),
  };
  
  goals.push(newGoal);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  return newGoal;
};

// Add savings to goal
export const addSavingsToGoal = (goalId: string, amount: number): StudentGoal | null => {
  const goals = getGoals();
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return null;
  
  goal.savedAmount += amount;
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  
  // Update milestones
  goal.milestones.forEach(m => {
    if (progress >= m.percentage && !m.reached) {
      m.reached = true;
      m.reachedAt = new Date();
    }
  });
  
  // Check if completed
  if (goal.savedAmount >= goal.targetAmount) {
    goal.completed = true;
    addPoints(POINTS_CONFIG.REACH_GOAL, 'Reached savings goal');
  }
  
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  return goal;
};

// Get today's spending
export const getTodaySpending = (): number => {
  const today = new Date().toDateString();
  return getExpenses()
    .filter(e => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + e.amount, 0);
};

// Check if under daily limit
export const checkDailyLimit = (dailyLimit: number): boolean => {
  const todaySpending = getTodaySpending();
  return todaySpending <= dailyLimit;
};
