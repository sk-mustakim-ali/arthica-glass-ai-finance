import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { FinancialCards } from "@/components/dashboard/FinancialCards";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { BudgetOverview } from "@/components/budget/BudgetOverview";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* ✅ Header with toggle logo */}
      <DashboardHeader />

      {/* ✅ Sidebar handles its own visibility */}
      <DashboardSidebar />

      {/* ✅ Main Content */}
      <main className="flex-1 p-6 overflow-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Dashboard Intro */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here’s your financial summary.
            </p>
          </div>

          {/* Summary Cards */}
          <FinancialCards />

          {/* Charts */}
          <FinancialCharts />

          {/* Budget Overview */}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
