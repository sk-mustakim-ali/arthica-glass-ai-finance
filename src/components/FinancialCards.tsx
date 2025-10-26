import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";

export function FinancialCards() {
  const cards = [
    {
      title: "Total Balance",
      value: "$42,580.50",
      change: "+12.5%",
      isPositive: true,
      icon: Wallet,
    },
    {
      title: "Income",
      value: "$8,420.00",
      change: "+8.2%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Expenses",
      value: "$3,248.75",
      change: "-5.4%",
      isPositive: true,
      icon: TrendingDown,
    },
    {
      title: "Financial Health",
      value: "85/100",
      change: "Excellent",
      isPositive: true,
      icon: Activity,
    },
  ];

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
                card.isPositive ? "text-green-500" : "text-destructive"
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
