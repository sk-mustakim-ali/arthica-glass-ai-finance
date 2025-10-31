import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EditBudgetModal } from "@/components/EditBudgetModal";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";

interface CategoryBudget {
  name: string;
  emoji: string;
  limit: number;
  spent: number;
}

const BudgetPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState<Record<string, number>>({
    Food: 8000,
    Transport: 5000,
    Entertainment: 4000,
    Utilities: 3000,
    Others: 5000,
  });

  const categories: CategoryBudget[] = [
    { name: "Food", emoji: "🍔", limit: budgets.Food, spent: 5200 },
    { name: "Transport", emoji: "🚗", limit: budgets.Transport, spent: 3800 },
    { name: "Entertainment", emoji: "🎬", limit: budgets.Entertainment, spent: 2100 },
    { name: "Utilities", emoji: "💡", limit: budgets.Utilities, spent: 2800 },
    { name: "Others", emoji: "📦", limit: budgets.Others, spent: 3400 },
  ];

  const totalLimit = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalLimit - totalSpent;
  const percentUsed = (totalSpent / totalLimit) * 100;

  const handleSaveBudget = (updatedBudget: Record<string, number>) => {
    setBudgets(updatedBudget);
    setIsModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Your Budget Planner</h1>
            <p className="text-muted-foreground">Manage and track your monthly budget limits</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="glass-button"
            size="lg"
          >
            Edit Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Monthly Limit
                </CardTitle>
                <Wallet className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{totalLimit.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card border-destructive/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Spent
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Remaining Amount
                </CardTitle>
                <DollarSign className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{remaining.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Budget Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {percentUsed.toFixed(1)}% of budget used
                  </span>
                  <span className="font-medium">
                    ₹{totalSpent.toLocaleString()} / ₹{totalLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentUsed} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => {
            const categoryPercent = (category.spent / category.limit) * 100;
            const isOverBudget = categoryPercent > 100;

            return (
              <motion.div key={category.name} variants={itemVariants}>
                <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-2xl">{category.emoji}</span>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Spent</p>
                        <p className="text-2xl font-bold">₹{category.spent.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Limit</p>
                        <p className="text-xl font-semibold">₹{category.limit.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {categoryPercent.toFixed(1)}% used
                        </span>
                        <span className="text-muted-foreground">
                          ₹{(category.limit - category.spent).toLocaleString()} left
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(categoryPercent, 100)} 
                        className={`h-2 ${isOverBudget ? "bg-destructive/20" : ""}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <EditBudgetModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudgets={budgets}
      />
    </div>
  );
};

export default BudgetPage;
