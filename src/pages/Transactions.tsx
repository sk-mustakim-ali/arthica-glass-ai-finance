import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  DollarSign,
  FileText,
} from "lucide-react";

import { DashboardSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/Header";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { demoTransactions, Transaction } from "@/services/mockData";

const Transactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    description: "",
  });

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other"],
    expense: [
      "Rent",
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Health",
      "Other",
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in amount and category",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: Transaction = {
      id: "txn-" + Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
      date: new Date(),
      createdAt: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);

    toast({
      title: "Transaction added!",
      description: `${formData.type === "income" ? "Income" : "Expense"} of ₹${formData.amount} recorded.`,
    });

    setFormData({
      amount: "",
      category: "",
      type: "expense",
      description: "",
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Transactions
            </h1>
            <p className="text-muted-foreground">
              Track your income and expenses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ADD FORM */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold gradient-text mb-4">
                Add Transaction
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Tabs
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as "income" | "expense",
                        category: "",
                      })
                    }
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="income">Income</TabsTrigger>
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="pl-10"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[formData.type].map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Add notes..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Transaction
                </Button>
              </form>
            </motion.div>

            {/* TRANSACTIONS LIST */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-2xl space-y-4"
            >
              <h2 className="text-2xl font-semibold gradient-text mb-2">
                Recent Transactions
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No transactions yet
                  </div>
                ) : (
                  transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-card border border-border flex justify-between items-center hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-xl ${
                            transaction.type === "income"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpCircle className="w-5 h-5" />
                          ) : (
                            <ArrowDownCircle className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {transaction.category}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {transaction.description || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Transactions;
