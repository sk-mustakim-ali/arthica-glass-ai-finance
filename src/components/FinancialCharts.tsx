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

const lineData = [
  { month: "Jan", income: 8200, expenses: 3100 },
  { month: "Feb", income: 8500, expenses: 3400 },
  { month: "Mar", income: 7800, expenses: 2900 },
  { month: "Apr", income: 9100, expenses: 3800 },
  { month: "May", income: 8700, expenses: 3200 },
  { month: "Jun", income: 8420, expenses: 3248 },
];

const pieData = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 450 },
  { name: "Transport", value: 320 },
  { name: "Entertainment", value: 280 },
  { name: "Utilities", value: 180 },
  { name: "Others", value: 818 },
];

const COLORS = ["hsl(210, 100%, 50%)", "hsl(180, 80%, 50%)", "hsl(280, 70%, 60%)", "hsl(160, 70%, 50%)", "hsl(340, 70%, 60%)", "hsl(40, 90%, 60%)"];

export function FinancialCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
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
              stroke="hsl(210, 100%, 50%)"
              strokeWidth={2}
              dot={{ fill: "hsl(210, 100%, 50%)" }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="hsl(280, 70%, 60%)"
              strokeWidth={2}
              dot={{ fill: "hsl(280, 70%, 60%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
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
