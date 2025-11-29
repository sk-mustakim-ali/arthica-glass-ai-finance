// src/pages/Liabilities.tsx
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, AlertCircle, TrendingDown, Calendar, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddLiabilityModal } from "@/components/liabilities/AddLiabilityModal";
import { EditLiabilityModal } from "@/components/liabilities/EditLiabilityModal";
import { DeleteLiabilityModal } from "@/components/liabilities/DeleteLiabilityModal";
import { Timestamp } from "firebase/firestore";
import { getAllLiabilities , Liability } from "@/services/queryWrappers";

const Liabilities = () => {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Centralized data fetch
  const fetchLiabilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllLiabilities();
      setLiabilities(data || []);
    } catch (error) {
      console.error("Error fetching liabilities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiabilities();
  }, [fetchLiabilities]);

  // 🔹 Derived values
  const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.amount || 0), 0);
  const activeCount = liabilities.filter((l) => l.status === "active").length;
  const overdueCount = liabilities.filter((l) => l.status === "overdue").length;

  // 🔹 Handlers
  const handleEdit = (liability: Liability) => {
    setSelectedLiability(liability);
    setIsEditModalOpen(true);
  };

  const handleDelete = (liability: Liability) => {
    setSelectedLiability(liability);
    setIsDeleteModalOpen(true);
  };

  // 🔹 Date formatting helper
  const formatDate = (date: string | Timestamp | null | undefined): string => {
    if (!date) return "—";
    try {
      const jsDate = date instanceof Timestamp ? date.toDate() : new Date(date);
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(jsDate);
    } catch {
      return "—";
    }
  };

  // 🔹 Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

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
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold gradient-text mb-2">Liabilities Tracker</h1>
                  <p className="text-muted-foreground">
                    Manage and monitor your loans and financial obligations
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liability
                </Button>
              </div>

              {/* Summary Cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-destructive/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Liabilities
                      </CardTitle>
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ₹{totalLiabilities.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Count
                      </CardTitle>
                      <Calendar className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{activeCount}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-destructive/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Overdue Count
                      </CardTitle>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{overdueCount}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Liabilities Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="glass-card">
                      <CardHeader className="space-y-3">
                        <div className="h-6 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="h-4 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : liabilities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                    <TrendingDown className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No liabilities yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add one to get started with tracking your financial obligations
                  </p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Liability
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {liabilities.map((liability) => (
                    <motion.div
                      key={liability.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`glass-card hover:shadow-lg transition-all duration-300 ${
                          liability.status === "overdue"
                            ? "border-destructive/50 shadow-destructive/20"
                            : "border-white/20"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                {liability.name}
                                {liability.status === "overdue" && (
                                  <AlertCircle className="h-5 w-5 text-destructive" />
                                )}
                              </CardTitle>
                              <Badge
                                variant={
                                  liability.status === "overdue"
                                    ? "destructive"
                                    : liability.status === "closed"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {liability.status.charAt(0).toUpperCase() +
                                  liability.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Amount</p>
                            <p className="text-2xl font-bold">
                              ₹{liability.amount?.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Interest Rate:</span>
                            <span className="font-semibold">
                              {liability.interestRate ?? 0}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-semibold">
                              {formatDate(liability.dueDate)}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEdit(liability)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(liability)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddLiabilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchLiabilities}
      />
      <EditLiabilityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLiability(null);
        }}
        liability={selectedLiability}
        onSuccess={fetchLiabilities}
      />
      <DeleteLiabilityModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLiability(null);
        }}
        liability={selectedLiability}
        onSuccess={fetchLiabilities}
      />
    </SidebarProvider>
  );
};

export default Liabilities;
