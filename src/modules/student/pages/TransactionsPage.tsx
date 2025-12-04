import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, Edit2, Users, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentExpenses } from '../hooks/useStudent';
import { EXPENSE_CATEGORIES, StudentExpense } from '../types/student';
import { useToast } from '@/hooks/use-toast';

const reliabilityBadges = {
  'bill-hero': { label: 'Bill Hero', color: 'bg-student-success', emoji: '🦸' },
  'reliable': { label: 'Reliable', color: 'bg-student-primary', emoji: '✅' },
  'sometimes-late': { label: 'Sometimes Late', color: 'bg-student-warning', emoji: '⏰' },
  'ghost-payer': { label: 'Ghost Payer', color: 'bg-student-error', emoji: '👻' },
};

export const TransactionsPage: React.FC = () => {
  const { expenses, removeExpense } = useStudentExpenses();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filterExpenses = () => {
    let filtered = [...expenses];
    
    if (search) {
      filtered = filtered.filter(e => 
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => new Date(e.date) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => new Date(e.date) >= monthAgo);
    }

    return filtered;
  };

  const handleDelete = (id: string) => {
    removeExpense(id);
    toast({ title: 'Expense deleted', description: 'Your expense has been removed.' });
  };

  const filteredExpenses = filterExpenses();
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Transactions 💸</h1>
        <p className="text-muted-foreground">Track where your money goes</p>
      </div>

      {/* Filters */}
      <Card className="p-4 border-student-border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="pl-9"
            />
          </div>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            size="sm"
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All Categories
          </Button>
          {EXPENSE_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full"
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-student-border text-center">
          <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Spent</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <p className="text-2xl font-bold">{filteredExpenses.length}</p>
          <p className="text-sm text-muted-foreground">Transactions</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <p className="text-2xl font-bold">₹{Math.round(totalSpent / Math.max(filteredExpenses.length, 1))}</p>
          <p className="text-sm text-muted-foreground">Avg. Amount</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <p className="text-2xl font-bold">{filteredExpenses.filter(e => e.splitWith?.length).length}</p>
          <p className="text-sm text-muted-foreground">Split Bills</p>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 border-student-border hover:border-student-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  {/* Emoji */}
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {expense.emoji}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{expense.description}</p>
                      {expense.splitWith && expense.splitWith.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Split
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {EXPENSE_CATEGORIES.find(c => c.id === expense.category)?.name} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="font-bold text-lg">-₹{expense.amount}</p>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Split Details */}
                {expense.splitWith && expense.splitWith.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">Split with:</p>
                    <div className="flex flex-wrap gap-2">
                      {expense.splitWith.map((person) => {
                        const badge = reliabilityBadges[person.reliabilityScore];
                        return (
                          <div
                            key={person.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                              person.paid ? 'bg-student-success/10' : 'bg-student-warning/10'
                            }`}
                          >
                            <span>{badge.emoji}</span>
                            <span className="text-sm font-medium">{person.name}</span>
                            <span className="text-sm">₹{person.amount}</span>
                            <Badge variant={person.paid ? 'default' : 'secondary'} className="text-xs">
                              {person.paid ? 'Paid' : 'Pending'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredExpenses.length === 0 && (
          <Card className="p-12 border-student-border text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">No transactions found</p>
          </Card>
        )}
      </div>
    </div>
  );
};
