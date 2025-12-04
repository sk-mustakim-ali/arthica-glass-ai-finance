import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Share2, Trophy, Sparkles, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStudentGoals } from '../hooks/useStudent';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const goalEmojis = ['💻', '📱', '🏖️', '📚', '🎮', '👟', '🎸', '🚗', '🏠', '✈️', '💍', '🎓'];

export const GoalsPage: React.FC = () => {
  const { goals, createGoal, addSavings } = useStudentGoals();
  const { toast } = useToast();
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', emoji: '🎯', targetAmount: '', deadline: '' });
  const [showAddSavings, setShowAddSavings] = useState<string | null>(null);
  const [savingsAmount, setSavingsAmount] = useState('');

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    createGoal({
      userId: 'user-1',
      name: newGoal.name,
      emoji: newGoal.emoji,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
    });

    toast({ title: 'Goal created! 🎯', description: 'Start saving towards your dream!' });
    setShowNewGoal(false);
    setNewGoal({ name: '', emoji: '🎯', targetAmount: '', deadline: '' });
  };

  const handleAddSavings = (goalId: string) => {
    if (!savingsAmount) return;

    addSavings(goalId, parseFloat(savingsAmount));
    
    const goal = goals.find(g => g.id === goalId);
    if (goal && goal.savedAmount + parseFloat(savingsAmount) >= goal.targetAmount) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A855F7'],
      });
      toast({ title: '🎉 Goal Completed!', description: '+100 points! You did it!' });
    } else {
      toast({ title: 'Savings added! 💰', description: `+₹${savingsAmount} towards your goal` });
    }

    setShowAddSavings(null);
    setSavingsAmount('');
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goals 🎯</h1>
          <p className="text-muted-foreground">Dream it, save it, achieve it!</p>
        </div>
        <Button onClick={() => setShowNewGoal(true)} className="bg-student-primary hover:bg-student-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Active Goals - Dreamboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeGoals.map((goal, index) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const dailySavings = goal.deadline 
            ? Math.ceil((goal.targetAmount - goal.savedAmount) / Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))))
            : null;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-student-border hover:border-student-primary/50 transition-all group relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-student-primary/5 to-student-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-student-primary/20 to-student-accent/20 flex items-center justify-center text-3xl">
                      {goal.emoji}
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Goal Info */}
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-2xl font-bold mt-2">
                    ₹{goal.savedAmount.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal">
                      {' '}/ ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </p>

                  {/* Progress */}
                  <div className="mt-4 space-y-2">
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-student-primary font-medium">{Math.round(progress)}% saved</span>
                      {goal.deadline && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="flex gap-2 mt-4">
                    {goal.milestones.map((milestone, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full ${
                          milestone.reached ? 'bg-student-success' : 'bg-muted'
                        }`}
                        title={`${milestone.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* AI Suggestion */}
                  {dailySavings && dailySavings > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-student-primary/10 border border-student-primary/20">
                      <p className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-student-primary" />
                        Save ₹{dailySavings}/day to reach your goal!
                      </p>
                    </div>
                  )}

                  {/* Add Savings Button */}
                  <Button 
                    onClick={() => setShowAddSavings(goal.id)}
                    className="w-full mt-4 bg-student-primary hover:bg-student-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Savings
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-student-warning" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="p-4 border-student-success/30 bg-student-success/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-student-success/20 flex items-center justify-center text-2xl">
                    {goal.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-student-success">
                      ₹{goal.targetAmount.toLocaleString()} achieved! 🎉
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Goal Dialog */}
      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Goal 🎯</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Emoji Selector */}
            <div>
              <label className="text-sm font-medium">Choose an icon</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {goalEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewGoal(prev => ({ ...prev, emoji }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      newGoal.emoji === emoji 
                        ? 'bg-student-primary text-white' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Goal Name</label>
              <Input
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., New iPhone, Goa Trip"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Amount (₹)</label>
              <Input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="25000"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Deadline (optional)</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                className="mt-2"
              />
            </div>

            <Button onClick={handleCreateGoal} className="w-full bg-student-primary hover:bg-student-primary/90">
              Create Goal ✨
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Savings Dialog */}
      <Dialog open={!!showAddSavings} onOpenChange={() => setShowAddSavings(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Savings 💰</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Input
                type="number"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-2xl text-center font-bold"
              />
            </div>
            <Button 
              onClick={() => showAddSavings && handleAddSavings(showAddSavings)}
              className="w-full bg-student-success hover:bg-student-success/90"
            >
              Add to Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
