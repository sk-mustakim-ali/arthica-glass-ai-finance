import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingDown, Calendar, Percent } from "lucide-react";
import { demoLiabilities, getTotalLiabilities } from "@/services/mockData";

const Liabilities = () => {
  const liabilities = demoLiabilities;
  const totalLiabilities = getTotalLiabilities();
  const formatAmount = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  const formatDate = (date: Date | null) => date ? new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
  const getStatusColor = (status: string) => status === "active" ? "bg-blue-500/10 text-blue-500" : status === "overdue" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
          <div><h1 className="text-3xl font-bold mb-2 gradient-text">Liabilities</h1><p className="text-muted-foreground">Track your loans and debts</p></div>
          <Card className="glass-card"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle>Total Liabilities</CardTitle><AlertCircle className="h-6 w-6 text-destructive" /></CardHeader><CardContent><div className="text-3xl font-bold text-destructive">{formatAmount(totalLiabilities)}</div></CardContent></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liabilities.map((l) => (
              <Card key={l.id} className="glass-card">
                <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle>{l.name}</CardTitle><Badge className={getStatusColor(l.status)}>{l.status}</Badge></div></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><TrendingDown className="h-4 w-4" />Amount</span><span className="text-xl font-bold text-destructive">{formatAmount(l.amount)}</span></div>
                  <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Percent className="h-4 w-4" />Rate</span><span className="font-semibold">{l.interestRate}%</span></div>
                  <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />Due</span><span className="font-semibold">{formatDate(l.dueDate)}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Liabilities;
