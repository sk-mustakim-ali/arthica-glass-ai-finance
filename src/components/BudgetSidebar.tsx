import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
}

export function BudgetSidebar() {
  const totalLimit = 50000;
  const totalSpent = 32500;
  const remaining = totalLimit - totalSpent;
  const percentSpent = (totalSpent / totalLimit) * 100;

  const categories: BudgetCategory[] = [
    { id: "food", name: "Food", icon: "🍔", spent: 2500, limit: 5000 },
    { id: "transport", name: "Transport", icon: "🚗", spent: 8000, limit: 10000 },
    { id: "entertainment", name: "Entertainment", icon: "🎬", spent: 3000, limit: 5000 },
    { id: "utilities", name: "Utilities", icon: "💡", spent: 4000, limit: 6000 },
    { id: "others", name: "Others", icon: "📦", spent: 15000, limit: 24000 },
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryProgress = (spent: number, limit: number) => {
    return (spent / limit) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[320px]"
    >
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Monthly Budget</CardTitle>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-foreground">
                {formatAmount(totalLimit)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatAmount(remaining)} remaining
            </p>
            <Progress value={percentSpent} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground text-right">
              {percentSpent.toFixed(0)}% spent
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {categories.map((category, index) => {
              const progress = getCategoryProgress(category.spent, category.limit);
              const isOverBudget = category.spent > category.limit;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group p-3 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all duration-300 hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-foreground">
                        {category.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isOverBudget ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {formatAmount(category.spent)} / {formatAmount(category.limit)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className={`h-1.5 ${
                      isOverBudget ? "[&>div]:bg-destructive" : ""
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 group"
          >
            View Full Budget
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
