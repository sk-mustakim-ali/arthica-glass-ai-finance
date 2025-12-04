import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Flame, Brain, Users, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStudentProfile, useStudentBudget, useHabits, useInsights } from '../hooks/useStudent';
import { getWeeklySpendingByCategory } from '../services';
import { EXPENSE_CATEGORIES } from '../types/student';

const personalityProfiles = {
  foodie: { emoji: '🍔', title: 'The Foodie', description: 'You love exploring new cuisines and ordering in!', color: 'from-orange-400 to-red-500' },
  explorer: { emoji: '✈️', title: 'The Explorer', description: 'Travel and experiences are your priority!', color: 'from-blue-400 to-purple-500' },
  saver: { emoji: '💰', title: 'The Saver', description: 'Budget-conscious and goal-oriented!', color: 'from-green-400 to-emerald-500' },
  shopaholic: { emoji: '🛍️', title: 'The Shopaholic', description: 'You enjoy retail therapy a bit too much!', color: 'from-pink-400 to-rose-500' },
  minimalist: { emoji: '🧘', title: 'The Minimalist', description: 'Less is more for you!', color: 'from-gray-400 to-slate-500' },
  socialite: { emoji: '🎉', title: 'The Socialite', description: 'Social events are your biggest expense!', color: 'from-yellow-400 to-orange-500' },
};

export const InsightsPage: React.FC = () => {
  const { profile } = useStudentProfile();
  const { budget } = useStudentBudget();
  const { habits } = useHabits();
  const { insights } = useInsights();
  
  const weeklySpending = getWeeklySpendingByCategory();
  const personality = profile?.spendingPersonality ? personalityProfiles[profile.spendingPersonality] : personalityProfiles.foodie;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Insights 💡</h1>
        <p className="text-muted-foreground">Understand your spending personality</p>
      </div>

      {/* Spending Personality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`p-6 border-none bg-gradient-to-br ${personality.color} text-white overflow-hidden relative`}>
          <div className="absolute top-0 right-0 w-40 h-40 text-8xl opacity-20 transform translate-x-10 -translate-y-10">
            {personality.emoji}
          </div>
          <div className="relative">
            <p className="text-sm opacity-90 mb-2">Your Spending Personality</p>
            <h2 className="text-3xl font-bold mb-2">{personality.title}</h2>
            <p className="opacity-90">{personality.description}</p>
            <Button variant="secondary" className="mt-4 bg-white/20 hover:bg-white/30 text-white border-none">
              Retake Quiz
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Spending Chart */}
        <Card className="p-6 border-student-border">
          <h3 className="font-semibold mb-4">This Week's Spending</h3>
          <div className="space-y-4">
            {Object.entries(weeklySpending)
              .filter(([_, amount]) => amount > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, amount], index) => {
                const config = EXPENSE_CATEGORIES.find(c => c.id === category);
                const maxAmount = Math.max(...Object.values(weeklySpending));
                const percentage = (amount / maxAmount) * 100;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>{config?.emoji}</span>
                        <span className="text-sm font-medium">{config?.name}</span>
                      </span>
                      <span className="font-semibold">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: config?.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </Card>

        {/* Habit Tracker */}
        <Card className="p-6 border-student-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-student-warning" />
            Habit Streaks
          </h3>
          <div className="space-y-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50"
              >
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{habit.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-sm ${
                            i < habit.streak ? 'bg-student-success' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{habit.streak} days</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-student-warning">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold">{habit.streak}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Food Habit Analyzer */}
      <Card className="p-6 border-student-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Food Habit Analyzer</h3>
            <p className="text-muted-foreground text-sm mt-1">Based on your spending patterns</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl font-bold text-student-error">14</p>
                <p className="text-sm text-muted-foreground">Fast food orders this month</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl font-bold text-student-primary">₹3,200</p>
                <p className="text-sm text-muted-foreground">Spent on food delivery</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl font-bold text-student-success">₹900</p>
                <p className="text-sm text-muted-foreground">Potential savings</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-student-success/10 border border-student-success/20">
              <p className="text-sm">
                💡 <strong>Tip:</strong> Switch 3 Zomato orders to your hostel canteen and save ₹900 this month!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Peer Comparison */}
      <Card className="p-6 border-student-border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-student-primary" />
          How You Compare (Anonymous)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Your food spending</span>
              <span className="font-semibold">₹3,200</span>
            </div>
            <Progress value={64} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-student-warning">Above average</span> compared to similar students
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Your savings rate</span>
              <span className="font-semibold">15%</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-student-success">Better than 75%</span> of students your age
            </p>
          </div>
        </div>
      </Card>

      {/* Smart Insights */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-student-accent" />
          AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 border-student-border hover:border-student-primary/50 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    {insight.savingsAmount && (
                      <p className="text-sm text-student-success mt-2 font-medium">
                        Potential savings: ₹{insight.savingsAmount}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
