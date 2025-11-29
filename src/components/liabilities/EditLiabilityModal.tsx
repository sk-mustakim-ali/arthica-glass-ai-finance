// src/components/liabilities/EditLiabilityModal.tsx
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { updateLiability , Liability } from "@/services/queryWrappers";

interface EditLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability: Liability | null;
  onSuccess?: () => void; // ✅ optional callback for refresh
}

export function EditLiabilityModal({
  isOpen,
  onClose,
  liability,
  onSuccess,
}: EditLiabilityModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    status: "active" as "active" | "overdue" | "closed",
  });

  // 🧩 Pre-fill form from liability data
  useEffect(() => {
    if (liability) {
      const formattedDate =
        liability.dueDate instanceof Timestamp
          ? liability.dueDate.toDate().toISOString().split("T")[0]
          : (liability.dueDate as string) || "";

      setFormData({
        name: liability.name,
        amount: liability.amount.toString(),
        interestRate: liability.interestRate.toString(),
        dueDate: formattedDate,
        status: liability.status,
      });
    }
  }, [liability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liability?.id) return;

    setLoading(true);
    try {
      const dueDateValue =
        formData.dueDate !== ""
          ? Timestamp.fromDate(new Date(formData.dueDate))
          : Timestamp.now();

      await updateLiability(liability.id, {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        dueDate: dueDateValue,
        status: formData.status,
      });

      console.log("✅ Liability updated successfully via wrapper");

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Error updating liability:", error);
      alert("Failed to update liability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!liability) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Edit Liability
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Liability Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Car Loan, EMI"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              step="0.01"
              required
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
            <Input
              id="edit-interestRate"
              type="number"
              placeholder="0"
              value={formData.interestRate}
              onChange={(e) =>
                setFormData({ ...formData, interestRate: e.target.value })
              }
              min="0"
              step="0.1"
              required
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "overdue" | "closed") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
