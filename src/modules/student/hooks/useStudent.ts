// Student Dashboard Hooks

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  StudentProfile, 
  StudentExpense, 
  StudentBudget, 
  StudentGoal,
  ExpenseCategory
} from '../types/student';
import {
  getStudentProfile,
  initializeStudentProfile,
  updateStudentProfile,
  getExpenses,
  addExpense,
  deleteExpense,
  getBudget,
  updateCategoryBudget,
  getGoals,
  addGoal,
  addSavingsToGoal,
  getTodaySpending,
} from '../services/studentService';
import { mockChallenges, mockSubscriptions, mockHabits, mockInsights, getRandomVibeMessage } from '../services/mockStudentData';

export const useStudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      let studentProfile = getStudentProfile(user.uid);
      if (!studentProfile) {
        studentProfile = initializeStudentProfile(user.uid, user.displayName);
      }
      setProfile(studentProfile);
    }
    setLoading(false);
  }, [user]);

  const updateProfile = useCallback((updates: Partial<StudentProfile>) => {
    const updated = updateStudentProfile(updates);
    if (updated) setProfile(updated);
  }, []);

  return { profile, loading, updateProfile };
};

export const useStudentExpenses = () => {
  const [expenses, setExpenses] = useState<StudentExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(() => {
    setExpenses(getExpenses());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const createExpense = useCallback((expense: Omit<StudentExpense, 'id'>) => {
    const newExpense = addExpense(expense);
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const removeExpense = useCallback((id: string) => {
    deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const todaySpending = getTodaySpending();

  return { expenses, loading, createExpense, removeExpense, todaySpending, refresh: loadExpenses };
};

export const useStudentBudget = () => {
  const [budget, setBudget] = useState<StudentBudget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBudget(getBudget());
    setLoading(false);
  }, []);

  const updateBudget = useCallback((category: ExpenseCategory, amount: number) => {
    updateCategoryBudget(category, amount);
    setBudget(getBudget());
  }, []);

  return { budget, loading, updateBudget };
};

export const useStudentGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudentGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGoals(getGoals());
    setLoading(false);
  }, []);

  const createGoal = useCallback((goal: Omit<StudentGoal, 'id' | 'milestones' | 'completed' | 'createdAt'>) => {
    const newGoal = addGoal(goal);
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const addSavings = useCallback((goalId: string, amount: number) => {
    const updated = addSavingsToGoal(goalId, amount);
    if (updated) {
      setGoals(prev => prev.map(g => g.id === goalId ? updated : g));
    }
  }, []);

  return { goals, loading, createGoal, addSavings };
};

export const useChallenges = () => {
  const [challenges] = useState(mockChallenges);
  const [loading] = useState(false);
  return { challenges, loading };
};

export const useSubscriptions = () => {
  const [subscriptions] = useState(mockSubscriptions);
  const [loading] = useState(false);
  return { subscriptions, loading };
};

export const useHabits = () => {
  const [habits] = useState(mockHabits);
  const [loading] = useState(false);
  return { habits, loading };
};

export const useInsights = () => {
  const [insights] = useState(mockInsights);
  const [loading] = useState(false);
  return { insights, loading };
};

export const useVibeMessage = () => {
  const [message] = useState(getRandomVibeMessage);
  return message;
};
