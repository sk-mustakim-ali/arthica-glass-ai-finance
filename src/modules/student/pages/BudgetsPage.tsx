import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, TrendingUp, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SpendingRing } from '../components/SpendingRing';
import { useStudentBudget } from '../hooks/useStudent';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../types/student';
import { useToast } from '@/hooks/use-toast';

export const BudgetsPage: React.FC = () => {
  const { budget, updateBudget } = useStudentBudget();
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [newBudget, setNewBudget] = useState('');

  const handleUpdateBudget = () => {
    if (editingCategory && newBudget) {
      updateBudget(editingCategory, parseFloat(newBudget));
      toast({ title: 'Budget updated! 🎯', description: 'Your category budget has been adjusted.' });
      setEditingCategory(null);
      setNewBudget('');
    }
  };

  const getOverspentCategories = () => {
    return budget?.categoryBudgets.filter(c => c.spent > c.budget * 0.8) || [];
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Budgets 🐷</h1>
        <p className="text-muted-foreground">Manage your spending categories</p>
      </div>

      {/* Monthly Overview */}
      <Card className="p-6 border-student-border">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <SpendingRing
            spent={budget?.spent || 0}
            budget={budget?.totalBudget || 1}
            size={180}
            emoji="💰"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Monthly Budget</h2>
              <p className="text-3xl font-bold mt-2">
                ₹{(budget?.spent || 0).toLocaleString()}
                <span className="text-lg text-muted-foreground font-normal">
                  {' '}/ ₹{(budget?.totalBudget || 0).toLocaleString()}
                </span>
              </p>
            </div>
            <Progress 
              value={((budget?.spent || 0) / (budget?.totalBudget || 1)) * 100} 
              className="h-4"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-student-success">
                ₹{((budget?.totalBudget || 0) - (budget?.spent || 0)).toLocaleString()} remaining
              </span>
              <span className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Budget Balancer */}
      <Card className="p-6 border-student-border bg-gradient-to-br from-student-primary/5 to-student-accent/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-student-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-student-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold flex items-center gap-2">
              AI Budget Balancer
              <Sparkles className="w-4 h-4 text-student-primary" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Based on your spending patterns, here are some suggestions:
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-card border border-student-border">
                <p className="text-sm">
                  📚 <strong>Exam week detected!</strong> Consider reducing your entertainment budget by ₹500 and allocating it to books & stationery.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-student-border">
                <p className="text-sm">
                  🍔 <strong>Food spending high:</strong> You've spent 64% of your food budget. Switch 2 Zomato orders to canteen meals to stay on track.
                </p>
              </div>
            </div>
            <Button className="mt-4 bg-student-primary hover:bg-student-primary/90">
              Apply Suggestions ✨
            </Button>
          </div>
        </div>
      </Card>

      {/* Overspending Alerts */}
      {getOverspentCategories().length > 0 && (
        <Card className="p-4 border-student-warning/50 bg-student-warning/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-student-warning" />
            <p className="font-medium">
              {getOverspentCategories().length} categories are over 80% spent
            </p>
          </div>
        </Card>
      )}

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budget?.categoryBudgets.map((catBudget, index) => {
          const config = EXPENSE_CATEGORIES.find(c => c.id === catBudget.category);
          const percentage = (catBudget.spent / catBudget.budget) * 100;
          const isOverBudget = percentage >= 100;
          const isNearLimit = percentage >= 80;

          return (
            <motion.div
              key={catBudget.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-4 border-student-border cursor-pointer hover:border-student-primary/50 transition-all ${
                  isOverBudget ? 'border-student-error/50 bg-student-error/5' : 
                  isNearLimit ? 'border-student-warning/50 bg-student-warning/5' : ''
                }`}
                onClick={() => {
                  setEditingCategory(catBudget.category);
                  setNewBudget(catBudget.budget.toString());
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${config?.color}20` }}
                  >
                    {config?.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{config?.name}</span>
                      <span className={`text-sm font-semibold ${
                        isOverBudget ? 'text-student-error' : 
                        isNearLimit ? 'text-student-warning' : 'text-student-success'
                      }`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{catBudget.spent.toLocaleString()}</span>
                      <span>₹{catBudget.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit {EXPENSE_CATEGORIES.find(c => c.id === editingCategory)?.emoji}{' '}
              {EXPENSE_CATEGORIES.find(c => c.id === editingCategory)?.name} Budget
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Monthly Budget (₹)</label>
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="mt-2"
              />
            </div>
            <Button onClick={handleUpdateBudget} className="w-full bg-student-primary hover:bg-student-primary/90">
              Update Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
