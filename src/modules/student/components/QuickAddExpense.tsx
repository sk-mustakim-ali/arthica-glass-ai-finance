import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../types/student';
import { useStudentExpenses } from '../hooks/useStudent';
import { useToast } from '@/hooks/use-toast';

interface QuickAddExpenseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickAddExpense: React.FC<QuickAddExpenseProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [description, setDescription] = useState('');
  const { createExpense } = useStudentExpenses();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!amount || !category) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const categoryConfig = EXPENSE_CATEGORIES.find(c => c.id === category);
    
    createExpense({
      userId: 'user-1',
      amount: parseFloat(amount),
      category,
      description: description || categoryConfig?.name || '',
      date: new Date(),
      emoji: categoryConfig?.emoji || '📦',
    });

    // Celebration!

    toast({
      title: '+10 points! 🎉',
      description: 'Expense logged successfully',
    });

    // Reset and close
    setAmount('');
    setCategory(null);
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-student-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Add Expense 💸
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Input */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-4xl font-bold">
              <span className="text-muted-foreground">₹</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-4xl font-bold text-center border-none shadow-none focus-visible:ring-0 w-32 p-0"
              />
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  category === cat.id
                    ? 'bg-student-primary text-white shadow-lg shadow-student-primary/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium">{cat.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Description */}
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on? (optional)"
            className="bg-muted border-student-border"
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-student-primary to-student-accent hover:opacity-90 text-white font-semibold py-6 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Floating Add Button
export const FloatingAddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-student-primary to-student-accent text-white shadow-lg shadow-student-primary/30 flex items-center justify-center z-50"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
};
