import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
}

export function BudgetOverview() {
  const totalLimit = 50000;
  const totalSpent = 27000;
  const remaining = totalLimit - totalSpent;
  const percentSpent = (totalSpent / totalLimit) * 100;

  const categories: BudgetCategory[] = [
    { id: "food", name: "Food", icon: "🍔", spent: 2500, limit: 5000 },
    { id: "transport", name: "Transport", icon: "🚗", spent: 8000, limit: 10000 },
    { id: "entertainment", name: "Entertainment", icon: "🎬", spent: 3000, limit: 5000 },
    { id: "utilities", name: "Utilities", icon: "💡", spent: 4000, limit: 6000 },
    { id: "others", name: "Others", icon: "📦", spent: 9500, limit: 24000 },
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Budget Overview</CardTitle>
            <Select defaultValue="january">
              <SelectTrigger className="w-[140px] bg-background/50">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="august">August</SelectItem>
                <SelectItem value="september">September</SelectItem>
                <SelectItem value="october">October</SelectItem>
                <SelectItem value="november">November</SelectItem>
                <SelectItem value="december">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Total Budget Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20"
          >
            <div className="flex justify-between items-baseline mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Limit</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatAmount(totalLimit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Spent This Month</p>
                <p className="text-2xl font-semibold text-primary">
                  {formatAmount(totalSpent)}
                </p>
              </div>
            </div>
            <Progress value={percentSpent} className="h-3 mt-4" />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {formatAmount(remaining)} remaining
              </p>
              <p className="text-sm font-semibold text-primary">
                {percentSpent.toFixed(1)}% used
              </p>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const progress = getCategoryProgress(category.spent, category.limit);
              const isOverBudget = category.spent > category.limit;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-accent/5 to-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Limit: {formatAmount(category.limit)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Spent</span>
                      <span
                        className={`text-lg font-bold ${
                          isOverBudget ? "text-destructive" : "text-foreground"
                        }`}
                      >
                        {formatAmount(category.spent)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(progress, 100)}
                      className={`h-2 ${
                        isOverBudget ? "[&>div]:bg-destructive" : ""
                      }`}
                    />
                    <p className="text-xs text-right text-muted-foreground">
                      {progress.toFixed(0)}% used
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
