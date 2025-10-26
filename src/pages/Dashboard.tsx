import { motion } from "framer-motion";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { FinancialCards } from "@/components/FinancialCards";
import { FinancialCharts } from "@/components/FinancialCharts";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's your financial summary
                </p>
              </div>

              <FinancialCards />
              <FinancialCharts />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
