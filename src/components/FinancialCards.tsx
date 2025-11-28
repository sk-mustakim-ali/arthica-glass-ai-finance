// src/components/dashboard/FinancialCards.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import {
  getTransactionTotals,
  getUserHealthScore,
  getActiveBudget,
  getUserProfile,
} from "@/services/queryWrappers";

// ---------------- Interfaces ----------------
interface Totals {
  totalIncome: number;
  totalExpense: number;
  cashBalance: number;
}

interface ExtendedUserProfile {
  desiredSavings?: number;
}

export function FinancialCards() {
  // ---------------- State ----------------
  const [totals, setTotals] = useState<Totals>({
    totalIncome: 0,
    totalExpense: 0,
    cashBalance: 0,
  });
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [savings, setSavings] = useState<number>(0);
  const [timeline, setTimeline] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(true);

  const fmt = (v: number) =>
    `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // ---------------- Fetch Data (via Wrappers) ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalsData, score, activeBudget, profile] = await Promise.all([
          getTransactionTotals(),
          getUserHealthScore(),
          getActiveBudget(),
          getUserProfile(),
        ]);

        // ✅ Set main data
        setTotals(totalsData);
        setHealthScore(score);
        setTimeline(activeBudget?.timeline ?? "monthly");

        // ✅ Safely extract savings from profile
        const extendedProfile = profile as ExtendedUserProfile | null;
        const desiredSavings = extendedProfile?.desiredSavings ?? 0;
        setSavings(Number(desiredSavings));
      } catch (error) {
        console.error("Error loading financial cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- Loading State ----------------
  if (loading) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Loading dashboard data...
      </p>
    );
  }

  // ---------------- Computed Values ----------------
  const totalBalance = Math.max(totals.cashBalance + (savings || 0), 0);

  const cards = [
    {
      title: "Total Balance",
      value: fmt(totalBalance),
      change: timeline.charAt(0).toUpperCase() + timeline.slice(1),
      isPositive: totalBalance >= 0,
      icon: Wallet,
    },
    {
      title: "Income",
      value: fmt(totals.totalIncome),
      change: "↑ inflow",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Expenses",
      value: fmt(totals.totalExpense),
      change: "↓ outflow",
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: "Financial Health",
      value: healthScore !== null ? `${healthScore}/100` : "N/A",
      change: fmt(savings),
      isPositive: (healthScore ?? 0) >= 70,
      icon: Activity,
    },
  ];

  // ---------------- Render ----------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card p-6 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <card.icon className="h-6 w-6 text-primary" />
            </div>
            <span
              className={`text-sm font-semibold ${
                card.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {card.change}
            </span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
