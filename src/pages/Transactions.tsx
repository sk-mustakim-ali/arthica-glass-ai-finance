// src/pages/Transactions.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  DollarSign,
  Tag,
  FileText,
  PencilLine,
  Upload,
} from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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

import {
  addTransaction,
  listenToTransactions,
  type ListenerTransaction,
} from "@/services/queryWrappers";


import { useAuth } from "@/hooks/useAuth";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";

import { parseFile } from "@/utils/parseFile";
import { normalizeTransactions } from "@/utils/normalize";
import { uploadTransactions } from "@/utils/uploadToFirestore";
import type { RawRow } from "@/utils/normalize";

// --------------------------------------------
// NORMALIZED UI TRANSACTION TYPE
// --------------------------------------------
export interface UITransaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  date: Date;
  createdAt: Date;
}

const Transactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<UITransaction[]>([]);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<UITransaction | null>(null);

  // CSV Import State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<RawRow[]>([]);
  const [fullData, setFullData] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other"],
    expense: [
      "Rent",
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Other",
    ],
  };

  // --------------------------------------------
  // 🔄 REALTIME LISTENER
  // --------------------------------------------
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const unsubscribe = listenToTransactions((txns: ListenerTransaction[]) => {
      const normalized: UITransaction[] = txns.map((t) => ({
        id: t.id,
        amount: t.amount,
        category: t.category,
        type: t.type,
        description: t.description,
        date: new Date(t.date),                // wrapper stores YYYY-MM-DD string
        createdAt: t.createdAt,       // Firestore timestamp → JS Date
      }));

      setTransactions(normalized);
    });

    return () => unsubscribe();
  }, [user]);

  // --------------------------------------------
  // ➕ MANUAL ADD TRANSACTION
  // --------------------------------------------
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

    try {
      await addTransaction({
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        description: formData.description,
        date: new Date(), // wrapper converts automatically
      });

      toast({
        title: "Transaction added!",
        description: `${formData.type === "income" ? "Income" : "Expense"} of ₹${
          formData.amount
        } recorded.`,
      });

      setFormData({
        amount: "",
        category: "",
        type: "expense",
        description: "",
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  // --------------------------------------------
  // 📂 CSV PARSE HANDLER
  // --------------------------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseFile(file);
      setFullData(parsed);
      setPreview(parsed.slice(0, 5));
      setFileName(file.name);

      toast({
        title: "File loaded",
        description: `${parsed.length} rows ready to import.`,
      });
    } catch {
      toast({
        title: "Error parsing file",
        description: "Please upload a valid CSV or Excel file.",
        variant: "destructive",
      });
    }
  };

  // --------------------------------------------
  // ⬆️ CSV UPLOAD
  // --------------------------------------------
  const handleUpload = async () => {
    if (!user?.uid) {
      toast({
        title: "Not authenticated",
        description: "You must be signed in to import transactions.",
        variant: "destructive",
      });
      return;
    }

    if (!fullData.length) {
      toast({
        title: "No data",
        description: "Please select a valid file first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const normalized = normalizeTransactions(fullData, user.uid);
      const res = await uploadTransactions(normalized, user.uid);

      toast({
        title: "Import successful!",
        description: `${res.uploaded} transactions imported, ${res.invalidCount} invalid.`,
      });

      setIsImportOpen(false);
      setFileName("");
      setPreview([]);
      setFullData([]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload data to Firestore.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // ✏️ EDIT MODAL HANDLER
  // --------------------------------------------
  const handleEditClick = (txn: UITransaction) => {
    setSelectedTransaction(txn);
    setIsModalOpen(true);
  };

  const getModalTransaction = () => {
    if (!selectedTransaction) return undefined;

    return {
      id: selectedTransaction.id,
      amount: selectedTransaction.amount,
      category: selectedTransaction.category,
      type: selectedTransaction.type,
      description: selectedTransaction.description,
      date: selectedTransaction.date, // return string
      createdAt: selectedTransaction.createdAt, // wrapper accepts Timestamp.fromDate internally
    };
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  // --------------------------------------------
  // PAGE UI
  // --------------------------------------------
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
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2 gradient-text">
                    Transactions
                  </h1>
                  <p className="text-muted-foreground">
                    Track your income and expenses in real-time
                  </p>
                </div>

                <Button
                  onClick={() => setIsImportOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" /> Import CSV
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ADD FORM */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <h2 className="text-2xl font-semibold gradient-text mb-2">
                    Add Transaction
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* TYPE */}
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

                    {/* AMOUNT */}
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
                          required
                        />
                      </div>
                    </div>

                    {/* CATEGORY */}
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

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="Add notes about this transaction..."
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
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
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
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="glass-card p-4 rounded-2xl border border-white/10 flex justify-between items-center hover:border-primary/30"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`p-2 rounded-xl ${
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
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}₹
                              {transaction.amount.toLocaleString()}
                            </p>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(transaction)}
                              className="mt-2 border-primary/30 hover:bg-primary/10"
                            >
                              <PencilLine className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* CSV IMPORT MODAL */}
              {isImportOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4"
                  >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-500" /> Import
                      Transactions
                    </h2>

                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileChange}
                      className="w-full text-sm"
                    />

                    {fileName && (
                      <p className="text-xs text-gray-500">Selected: {fileName}</p>
                    )}

                    {preview.length > 0 && (
                      <pre className="bg-gray-100 rounded-lg p-2 text-xs max-h-40 overflow-auto">
                        {JSON.stringify(preview, null, 2)}
                      </pre>
                    )}

                    <div className="flex justify-end gap-2 pt-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsImportOpen(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpload} disabled={loading}>
                        {loading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* EDIT TRANSACTION MODAL */}
              <EditTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedTransaction(null);
                }}
                transaction={getModalTransaction()}
              />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Transactions;
