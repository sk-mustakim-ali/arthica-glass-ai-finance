// src/components/liabilities/AddLiabilityModal.tsx
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { addLiability } from "@/services/queryWrappers";
import { Timestamp } from "firebase/firestore";

interface AddLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // optional callback to refresh list after add
}

export function AddLiabilityModal({ isOpen, onClose, onSuccess }: AddLiabilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    status: "active" as "active" | "overdue" | "closed",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dueDateValue =
        formData.dueDate.trim() !== ""
          ? Timestamp.fromDate(new Date(formData.dueDate))
          : Timestamp.now();

      // ✅ Use queryWrapper instead of Firestore calls
      await addLiability({
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        dueDate: dueDateValue,
        status: formData.status,
        createdAt: Timestamp.now(),
      });

      // reset form + refresh parent list
      setFormData({
        name: "",
        amount: "",
        interestRate: "",
        dueDate: "",
        status: "active",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding liability:", error);
      alert("Failed to add liability. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Add Liability
          </DialogTitle>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-5 mt-4"
        >
          {/* Liability Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Liability Name</Label>
            <Input
              id="name"
              placeholder="e.g., Car Loan, EMI"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "overdue" | "closed") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {isSubmitting ? "Adding..." : "Add Liability"}
          </Button>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
