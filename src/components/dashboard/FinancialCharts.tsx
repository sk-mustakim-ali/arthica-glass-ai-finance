import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getBudgetSummary,
  getTransactionTrendData,
} from "@/services/mockData";

export function FinancialCharts() {
  const [timeline] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  const budgetSummary = getBudgetSummary();
  const lineData = getTransactionTrendData(timeline);
  const pieData = budgetSummary.pieData;
  const { totalLimit, totalSpent, totalRemaining } = budgetSummary;

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  const COLORS = [
    "hsl(210,100%,50%)",
    "hsl(180,80%,50%)",
    "hsl(280,70%,60%)",
    "hsl(160,70%,50%)",
    "hsl(340,70%,60%)",
    "hsl(40,90%,60%)",
    "hsl(120,60%,50%)",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LINE CHART */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-6">
          Income vs Expenses ({timeline.charAt(0).toUpperCase() + timeline.slice(1)})
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={fmt} />
            <Tooltip
              formatter={(value: number) => [fmt(value), "Amount"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="hsl(210,100%,50%)"
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="hsl(280,70%,60%)"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* PIE CHART */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-2">Spending by Category</h3>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="text-sm text-muted-foreground">Total limit:</div>
          <div className="font-semibold">{fmt(totalLimit)}</div>
          <div className="text-sm text-muted-foreground">Spent:</div>
          <div className="font-semibold text-red-500">{fmt(totalSpent)}</div>
          <div className="text-sm text-muted-foreground">Remaining:</div>
          <div className="font-semibold text-green-500">{fmt(totalRemaining)}</div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} ${fmt(value)}`}
              outerRadius={100}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => fmt(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
