import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Plus, DollarSign, Tag, FileText, PencilLine } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditTransactionModal } from "@/components/ui/EditTransactionModal";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  timestamp: Date;
}

const Transactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 5000,
      category: "Salary",
      type: "income",
      description: "Monthly salary",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      amount: 1200,
      category: "Rent",
      type: "expense",
      description: "Monthly rent payment",
      timestamp: new Date(Date.now() - 172800000),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    description: "",
  });

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other"],
    expense: ["Rent", "Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"],
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
      timestamp: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Transaction added!",
      description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} recorded`,
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

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Convert Transaction to modal format
  const getModalTransaction = () => {
    if (!selectedTransaction) return undefined;
    return {
      id: selectedTransaction.id,
      amount: selectedTransaction.amount,
      category: selectedTransaction.category,
      type: selectedTransaction.type,
      note: selectedTransaction.description,
      date: selectedTransaction.timestamp.toISOString().split('T')[0],
    };
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
              <div>
                <h1 className="text-3xl font-bold mb-2 gradient-text">Transactions</h1>
                <p className="text-muted-foreground">
                  Track your income and expenses in real-time
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Transaction Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass-card p-6 rounded-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-semibold gradient-text mb-2">Add Transaction</h2>
                    <p className="text-sm text-muted-foreground">Record your income or expense</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Tabs */}
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Tabs
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as "income" | "expense", category: "" })}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-md">
                          <TabsTrigger value="income" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                            <ArrowUpCircle className="w-4 h-4 mr-2" />
                            Income
                          </TabsTrigger>
                          <TabsTrigger value="expense" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                            <ArrowDownCircle className="w-4 h-4 mr-2" />
                            Expense
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="pl-10 bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50 transition-all"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="pl-10 bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                            {categories[formData.type].map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="description"
                          placeholder="Add notes about this transaction..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="pl-10 bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50 min-h-[80px] transition-all"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-primary/50 transition-all duration-300"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
                  </form>
                </motion.div>

                {/* Recent Transactions Feed */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card p-6 rounded-2xl space-y-4"
                >
                  <div>
                    <h2 className="text-2xl font-semibold gradient-text mb-2">Recent Transactions</h2>
                    <p className="text-sm text-muted-foreground">Your latest financial activity</p>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {transactions.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                          <DollarSign className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-lg">No transactions yet</p>
                        <p className="text-sm text-muted-foreground/70 mt-2">Start by adding one!</p>
                      </motion.div>
                    ) : (
                      transactions.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="glass-card p-4 rounded-2xl border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className={`p-2 rounded-xl flex-shrink-0 ${
                                  transaction.type === "income"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {transaction.type === "income" ? (
                                  <ArrowUpCircle className="w-5 h-5" />
                                ) : (
                                  <ArrowDownCircle className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground">
                                  {transaction.category}
                                </h3>
                                {transaction.description && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {transaction.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                  {formatDate(transaction.timestamp)}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                              <p
                                className={`text-lg font-bold ${
                                  transaction.type === "income" ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                              </p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleEditClick(transaction)}
                                      className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-[0_0_15px_rgba(110,231,183,0.3)] transition-all duration-300 flex-shrink-0"
                                    >
                                      <PencilLine className="w-4 h-4" />
                                    </motion.button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-popover/95 backdrop-blur-md border-border/50">
                                    <p>Edit Transaction</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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
      </div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={getModalTransaction()}
      />
    </SidebarProvider>
  );
};

export default Transactions;
