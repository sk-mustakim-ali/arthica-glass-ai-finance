// Budget.tsx (Logic Part)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EditBudgetModal } from "@/components/budget/EditBudgetModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getResolvedActiveBudget,
  updateBudget,
  createBudget,
  getUserProfile,
} from "@/services/queryWrappers";
import { auth } from "@/services/firebase";

// 🔹 Firestore data structures
interface Category {
  name: string;
  limit: number;
  spent?: number;
  remaining?: number;
  isOverspent?: boolean;
}

interface ProfileData {
  currency?: string;
}

const BudgetPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalLimit, setTotalLimit] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("INR");
  const [timeline, setTimeline] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotalLimit, setNewTotalLimit] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [spentInput, setSpentInput] = useState<string>("");
  const { toast } = useToast();

  // 🔹 Fetch budget and profile
  useEffect(() => {
    const fetchBudgetAndProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const profile = await getUserProfile();
        setCurrency(profile?.currency || "INR");

        const budget = await getResolvedActiveBudget();
        if (!budget) {
          toast({
            title: "No budget found",
            description: "Create a budget using Edit Budget.",
            variant: "destructive",
          });
          setCategories([]);
          setTotalLimit(0);
          setTimeline("");
          setCreatedAt(null);
          return;
        }

        const parsedCategories = (budget.categories || []).map((c) => ({
          name: c.name,
          limit: c.limit,
          spent: c.spent ?? 0,
          remaining: (c.limit ?? 0) - (c.spent ?? 0),
          isOverspent: (c.spent ?? 0) > (c.limit ?? 0),
        }));

        setCategories(parsedCategories);
        setTotalLimit(budget.totalLimit ?? 0);
        setTimeline(budget.timeline ?? "monthly");
        setCreatedAt(budget.createdAt?.toDate?.() || null);
      } catch (err) {
        console.error("Error loading budget:", err);
        toast({
          title: "Error loading data",
          description: "Could not load budget or profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetAndProfile();
  }, [toast]);

  // 💰 Calculations
  const totalAllocated = categories.reduce((s, c) => s + (c.limit || 0), 0);
  const totalSpent = categories.reduce((s, c) => s + (c.spent || 0), 0);
  const remaining = totalLimit - totalSpent;
  const percentUsed = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  // 💾 Update Budget in Firestore (using wrappers)
  const syncBudgetToFirestore = async (updatedCats: Category[], overrideTotalLimit?: number) => {
    try {
      const effectiveTotalLimit =
        typeof overrideTotalLimit === "number" ? overrideTotalLimit : totalLimit;

      const totalSpentCalc = updatedCats.reduce((sum, c) => sum + (c.spent ?? 0), 0);
      const totalRemainingCalc = effectiveTotalLimit - totalSpentCalc;
      const isOverspentOverall = totalSpentCalc > effectiveTotalLimit;

      const updatedCatsWithFlags = updatedCats.map((c) => {
        const remaining = (c.limit ?? 0) - (c.spent ?? 0);
        return {
          name: c.name,
          limit: c.limit,
          spent: c.spent ?? 0,
          remaining,
          isOverspent: remaining < 0,
        };
      });

      const activeBudget = await getResolvedActiveBudget();
      if (activeBudget?.id) {
        await updateBudget(activeBudget.id, {
          categories: updatedCatsWithFlags,
          totalSpent: totalSpentCalc,
          totalRemaining: totalRemainingCalc,
          isOverspent: isOverspentOverall,
          totalLimit: effectiveTotalLimit,
        });
      } else {
        await createBudget({
          month: new Date().toISOString().slice(0, 7),
          timeline: "monthly",
          categories: updatedCatsWithFlags,
          totalLimit: effectiveTotalLimit,
        });
      }

      setCategories(updatedCatsWithFlags);
      setTotalLimit(effectiveTotalLimit);
    } catch (err) {
      console.error("Error syncing budget:", err);
      toast({
        title: "Sync Failed",
        description: "Could not save changes to Firestore.",
        variant: "destructive",
      });
    }
  };

  // 💾 Save updates from modal
  const handleSaveBudget = async (updated: Record<string, number>) => {
    try {
      const baseCats = categories ?? [];
      const mergedMap = new Map<string, Category>();

      baseCats.forEach((c) => {
        mergedMap.set(c.name, {
          name: c.name,
          limit: updated[c.name] !== undefined ? Number(updated[c.name]) : c.limit,
          spent: c.spent ?? 0,
        });
      });

      Object.entries(updated).forEach(([name, limit]) => {
        if (!name) return;
        const numLimit = Number(limit || 0);
        if (!mergedMap.has(name) && numLimit > 0) {
          mergedMap.set(name, { name, limit: numLimit, spent: 0 });
        }
      });

      const mergedCategories = Array.from(mergedMap.values());
      await syncBudgetToFirestore(mergedCategories);
      setIsModalOpen(false);
      toast({ title: "Budget updated", description: "Changes saved successfully." });
    } catch (err) {
      console.error("Failed to update budget:", err);
      toast({
        title: "Error saving",
        description: "Failed to update the budget in Firestore.",
        variant: "destructive",
      });
    }
  };

  // 🧾 Inline total limit update
  const handleUpdateTotalLimit = async () => {
    const newLimitNum = Number(newTotalLimit);
    if (isNaN(newLimitNum) || newLimitNum < 0) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid total limit.",
        variant: "destructive",
      });
      setIsEditingTotal(false);
      return;
    }

    await syncBudgetToFirestore(categories, newLimitNum);
    setIsEditingTotal(false);
    toast({
      title: "Total Limit Updated",
      description: `Your total limit is now ₹${newLimitNum.toLocaleString()}.`,
    });
  };

  // 💸 Inline spent update
  const handleSpentSubmit = async (categoryName: string) => {
    const amount = Number(spentInput);
    if (isNaN(amount) || amount < 0) return;

    const updatedCategories = categories.map((c) =>
      c.name === categoryName ? { ...c, spent: (c.spent ?? 0) + amount } : c
    );

    await syncBudgetToFirestore(updatedCategories);
    setActiveCategory(null);
    setSpentInput("");

    toast({
      title: "Spent updated",
      description: `Added ₹${amount.toLocaleString()} to ${categoryName}.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading your budget...
      </div>
    );
  }

// Budget.tsx (Return Part)
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-1">
                    Your Budget
                  </h1>
                  {timeline && (
                    <p className="text-muted-foreground">
                      Timeline: <span className="font-medium">{timeline}</span>
                      {createdAt && (
                        <>
                          {" "}• Created:{" "}
                          <span className="font-medium">
                            {createdAt.toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="glass-button" size="lg">
                  Edit Budget
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Total Limit */}
                <Card className="glass-card border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Limit
                    </CardTitle>
                    <Wallet className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {isEditingTotal ? (
                        <input
                          type="number"
                          value={newTotalLimit}
                          onChange={(e) => setNewTotalLimit(Number(e.target.value))}
                          onBlur={handleUpdateTotalLimit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateTotalLimit();
                            if (e.key === "Escape") {
                              setIsEditingTotal(false);
                              setNewTotalLimit(totalLimit);
                            }
                          }}
                          autoFocus
                          className="bg-transparent border-b-2 border-primary focus:outline-none text-right w-32"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setNewTotalLimit(totalLimit);
                            setIsEditingTotal(true);
                          }}
                          className="cursor-pointer hover:text-primary transition-colors"
                        >
                          {currency} ₹{totalLimit.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Allocated */}
                <Card className="glass-card border-destructive/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Allocated
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {currency} ₹{totalAllocated.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                {/* Remaining */}
                <Card className="glass-card border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Remaining
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {currency} ₹{remaining.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Usage */}
              <Card className="glass-card mb-8">
                <CardHeader>
                  <CardTitle>Budget Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {percentUsed.toFixed(1)}% of total limit used
                      </span>
                      <span className="font-medium">
                        {currency} ₹{totalSpent.toLocaleString()} / ₹{totalLimit.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={percentUsed} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const usedPercent =
                    cat.limit > 0 ? ((cat.spent ?? 0) / cat.limit) * 100 : 0;
                  const isOver = usedPercent > 100;
                  return (
                    <Card
                      key={cat.name}
                      className="glass-card hover:shadow-md transition-all relative"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setSpentInput("");
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{cat.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">Allocated</p>
                        <p className="text-2xl font-semibold">
                          {currency} ₹{cat.limit.toLocaleString()}
                        </p>

                        <div className="mt-4 space-y-2 relative">
                          <AnimatePresence>
                            {activeCategory === cat.name && (
                              <motion.input
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                type="number"
                                placeholder="Enter spent amount"
                                value={spentInput}
                                onChange={(e) => setSpentInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSpentSubmit(cat.name);
                                  if (e.key === "Escape") {
                                    setActiveCategory(null);
                                    setSpentInput("");
                                  }
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-background border border-primary rounded-lg px-3 py-1 text-sm w-40 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            )}
                          </AnimatePresence>

                          <div className="flex justify-between text-sm">
                            <span
                              className={isOver ? "text-destructive font-medium" : "text-muted-foreground"}
                            >
                              {usedPercent.toFixed(1)}% used
                            </span>
                            <span className="text-muted-foreground">
                              {currency} ₹{Math.max((cat.limit || 0) - (cat.spent || 0), 0).toLocaleString()} left
                            </span>
                          </div>
                          <Progress
                            value={Math.min(usedPercent, 100)}
                            className={`h-2 ${isOver ? "bg-destructive/20" : ""}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      <EditBudgetModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudgets={categories.reduce(
          (acc, c) => ({ ...acc, [c.name]: c.limit }),
          {} as Record<string, number>
        )}
      />
    </SidebarProvider>
  );
};

export default BudgetPage;
