import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { demoBudget, getOverspentCategories } from "@/services/mockData";

const Budget = () => {
  const budget = demoBudget;
  const overspent = getOverspentCategories();
  const totalSpent = budget.categories.reduce((sum, c) => sum + c.spent, 0);
  const totalLimit = budget.totalLimit;
  const remaining = totalLimit - totalSpent;
  const percentSpent = totalLimit ? (totalSpent / totalLimit) * 100 : 0;

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">Budget</h1>
            <p className="text-muted-foreground">Manage your monthly budget</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Total Budget</CardTitle><Wallet className="h-5 w-5 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatAmount(totalLimit)}</div></CardContent></Card>
            <Card className="glass-card"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Spent</CardTitle><DollarSign className="h-5 w-5 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{formatAmount(totalSpent)}</div></CardContent></Card>
            <Card className="glass-card"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm">Remaining</CardTitle><TrendingUp className="h-5 w-5 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{formatAmount(remaining)}</div></CardContent></Card>
          </div>
          <Card className="glass-card"><CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader><CardContent><Progress value={Math.min(percentSpent, 100)} className="h-4" /><div className="flex justify-between mt-2 text-sm text-muted-foreground"><span>{formatAmount(totalSpent)} spent</span><span>{formatAmount(remaining)} remaining</span></div></CardContent></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budget.categories.map((cat) => {
              const progress = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;
              const isOver = overspent.some((c) => c.name === cat.name);
              return (
                <div key={cat.name} className="p-5 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-2">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">Limit: {formatAmount(cat.limit)}</p>
                  <p className={`text-lg font-bold ${isOver ? "text-destructive" : ""}`}>{formatAmount(cat.spent)}</p>
                  <Progress value={Math.min(progress, 100)} className={`h-2 mt-2 ${isOver ? "[&>div]:bg-destructive" : ""}`} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Budget;
