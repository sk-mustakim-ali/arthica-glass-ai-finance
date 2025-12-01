import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/layout/Header";
import { DashboardSidebar } from "@/components/layout/Sidebar";
import { FinancialCards } from "@/components/dashboard/FinancialCards";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="flex-1 p-6 overflow-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your financial summary.
            </p>
          </div>

          <FinancialCards />
          <FinancialCharts />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
