import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  updateTransaction,
  deleteTransaction,
} from "@/services/queryWrappers";

import { useToast } from "@/hooks/use-toast";
import type { UITransaction } from "@/pages/Transactions";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: UITransaction;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { toast } = useToast();

  // 🔹 formData always stores a Date object
  const [formData, setFormData] = React.useState<UITransaction | null>(null);

  // 🔹 this string is ONLY for the <input type="date">
  const [transactionDateString, setTransactionDateString] =
    React.useState<string>("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --------------------------------------------
  // Sync modal when a new transaction is opened
  // --------------------------------------------
  React.useEffect(() => {
    if (transaction) {
      const isoDate = transaction.date
        ? transaction.date.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      setTransactionDateString(isoDate);

      setFormData({
        ...transaction,
        description: transaction.description ?? "",
        date: transaction.date, // this stays as Date
      });
    }
  }, [transaction]);

  const categories = [
    "Salary",
    "Freelance",
    "Investment",
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Education",
    "Other",
  ];

  const handleChange = (field: keyof UITransaction, value: unknown) => {
    if (!formData) return;
    setFormData((prev) => prev && { ...prev, [field]: value });
  };

  // --------------------------------------------
  // UPDATE FIRESTORE TRANSACTION
  // --------------------------------------------
  const handleUpdate = async () => {
    if (!formData) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await updateTransaction(formData.id, {
        amount: formData.amount,
        category: formData.category,
        type: formData.type,
        description: formData.description ?? "",
        date: new Date(transactionDateString),
      });

      toast({
        title: "Transaction Updated",
        description: `Successfully updated ${formData.category} (${formData.type}).`,
      });

      setStatusMessage({
        type: "success",
        text: "✓ Transaction updated successfully!",
      });

      setTimeout(() => onClose(), 900);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Failed to update transaction.",
        variant: "destructive",
      });

      setStatusMessage({
        type: "error",
        text: "⚠️ Failed to update transaction.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------
  // DELETE TRANSACTION
  // --------------------------------------------
  const handleDelete = async () => {
    if (!formData) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await deleteTransaction(formData.id);

      toast({
        title: "Transaction Deleted",
        description: `${formData.category} has been removed.`,
      });

      setStatusMessage({
        type: "success",
        text: "✓ Transaction deleted successfully!",
      });

      setShowDeleteConfirm(false);
      setTimeout(() => onClose(), 900);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive",
      });

      setStatusMessage({
        type: "error",
        text: "⚠️ Failed to delete transaction.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* MODAL */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card p-6 md:p-8 bg-card/95 backdrop-blur-2xl">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold gradient-text">
                    Edit Transaction
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-muted/50 transition-all"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* STATUS MESSAGE */}
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl ${
                      statusMessage.type === "success"
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {statusMessage.text}
                  </motion.div>
                )}

                {/* FORM */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                  className="space-y-6"
                >
                  {/* AMOUNT */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        handleChange("amount", parseFloat(e.target.value))
                      }
                      required
                    />
                  </div>

                  {/* CATEGORY */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TYPE */}
                  <div className="space-y-3">
                    <Label>Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(v) =>
                        handleChange("type", v as "income" | "expense")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">💰 Income</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">💸 Expense</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* DATE */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={transactionDateString}
                      onChange={(e) => setTransactionDateString(e.target.value)}
                      required
                    />
                  </div>

                  {/* NOTE / DESCRIPTION */}
                  <div className="space-y-2">
                    <Label>Note (Optional)</Label>
                    <Textarea
                      value={formData.description ?? ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Add a note..."
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 bg-gradient-primary"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 h-12 border-destructive/50 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>

                    <Button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      variant="ghost"
                      className="flex-1 h-12"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* DELETE CONFIRM */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 bg-card/95 backdrop-blur-2xl max-w-md w-full text-center"
                >
                  <Trash2 className="w-8 h-8 text-destructive mx-auto mb-3" />
                  <h3 className="text-xl font-semibold mb-2">
                    Delete Transaction?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    This action cannot be undone.
                  </p>

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="flex-1 bg-destructive text-destructive-foreground"
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
