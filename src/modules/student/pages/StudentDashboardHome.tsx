import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SpendingRing, MiniSpendingRing } from '../components/SpendingRing';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { useStudentProfile, useStudentBudget, useStudentExpenses, useInsights, useVibeMessage } from '../hooks/useStudent';
import { EXPENSE_CATEGORIES } from '../types/student';

export const StudentDashboardHome: React.FC = () => {
  const { profile } = useStudentProfile();
  const { budget } = useStudentBudget();
  const { expenses, todaySpending } = useStudentExpenses();
  const { insights } = useInsights();
  const vibeMessage = useVibeMessage();

  const dailyLimit = profile?.dailyLimit || 500;
  const dailyRemaining = Math.max(dailyLimit - todaySpending, 0);
  const dailyPercentage = (todaySpending / dailyLimit) * 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-student-primary to-student-accent text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hey {profile?.displayName || 'there'}! 👋</h1>
            <p className="opacity-90">{vibeMessage}</p>
          </div>
          <BadgeDisplay badges={profile?.badges || []} size="md" maxShow={3} />
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Spending Meter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 h-full border-student-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Today's Spending</h3>
            <div className="flex items-center justify-center">
              <SpendingRing
                spent={todaySpending}
                budget={dailyLimit}
                size={160}
                emoji={todaySpending > dailyLimit ? '😱' : todaySpending > dailyLimit * 0.8 ? '😰' : '😊'}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">₹{todaySpending.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {dailyRemaining > 0 ? (
                  <span className="text-student-success">₹{dailyRemaining} remaining today</span>
                ) : (
                  <span className="text-student-error">Over budget by ₹{Math.abs(dailyRemaining)}</span>
                )}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Monthly Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 h-full border-student-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Monthly Budget</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">₹{(budget?.spent || 0).toLocaleString()}</span>
                <span className="text-muted-foreground">/ ₹{(budget?.totalBudget || 0).toLocaleString()}</span>
              </div>
              <Progress 
                value={((budget?.spent || 0) / (budget?.totalBudget || 1)) * 100} 
                className="h-3 bg-muted"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-student-success">
                  <ArrowDown className="w-4 h-4" />
                  ₹{((budget?.totalBudget || 0) - (budget?.spent || 0)).toLocaleString()} left
                </span>
                <span className="text-muted-foreground">
                  {Math.round(((budget?.spent || 0) / (budget?.totalBudget || 1)) * 100)}% used
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full border-student-border bg-gradient-to-br from-student-primary/5 to-student-accent/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-student-primary" />
              <h3 className="text-sm font-medium">AI Suggestion</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm">
                "Move ₹300 from snacks to travel this week. You've been ordering more but commuting less!"
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Dismiss
                </Button>
                <Button size="sm" className="text-xs bg-student-primary hover:bg-student-primary/90">
                  Apply ✨
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Category Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-student-border">
          <h3 className="font-semibold mb-4">Category Budgets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budget?.categoryBudgets.slice(0, 6).map((cat) => {
              const config = EXPENSE_CATEGORIES.find(c => c.id === cat.category);
              return (
                <MiniSpendingRing
                  key={cat.category}
                  spent={cat.spent}
                  budget={cat.budget}
                  emoji={config?.emoji || '📦'}
                  name={config?.name || cat.category}
                  color={config?.color || 'hsl(220 15% 50%)'}
                />
              );
            })}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6 border-student-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Expenses</h3>
            <Button variant="ghost" size="sm" className="text-student-primary">
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl">{expense.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold">-₹{expense.amount}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights Section */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-student-warning" />
          Smart Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 h-full border-student-border hover:border-student-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{insight.emoji}</span>
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
                    {insight.savingsAmount && (
                      <p className="text-xs text-student-success mt-2 font-medium">
                        Save ₹{insight.savingsAmount}
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
