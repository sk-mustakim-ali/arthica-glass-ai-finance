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
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/services/mockData";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  onUpdate?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onUpdate,
  onDelete,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Transaction | null>(null);
  const [transactionDateString, setTransactionDateString] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    if (transaction) {
      const isoDate = transaction.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      setTransactionDateString(isoDate);
      setFormData({ ...transaction });
    }
  }, [transaction]);

  const categories = [
    "Salary", "Freelance", "Investment", "Food", "Transport",
    "Entertainment", "Shopping", "Bills", "Health", "Other",
  ];

  const handleChange = (field: keyof Transaction, value: unknown) => {
    if (!formData) return;
    setFormData((prev) => prev && { ...prev, [field]: value });
  };

  const handleUpdate = async () => {
    if (!formData) return;
    setIsLoading(true);

    try {
      const updated = { ...formData, date: new Date(transactionDateString) };
      onUpdate?.(updated);
      toast({ title: "Transaction Updated", description: "Successfully updated!" });
      setTimeout(() => onClose(), 500);
    } catch {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData) return;
    setIsLoading(true);

    try {
      onDelete?.(formData.id);
      toast({ title: "Transaction Deleted" });
      setShowDeleteConfirm(false);
      setTimeout(() => onClose(), 500);
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Edit Transaction</h2>
                  <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(v) => handleChange("type", v)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">Income</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">Expense</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={transactionDateString}
                      onChange={(e) => setTransactionDateString(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Note</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="destructive"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-6 border border-border max-w-sm text-center"
              >
                <Trash2 className="w-8 h-8 text-destructive mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Delete Transaction?</h3>
                <p className="text-sm text-muted-foreground mb-4">This cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} variant="destructive" disabled={isLoading} className="flex-1">
                    Delete
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
