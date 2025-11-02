import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Liability {
  id: number;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  status: "active" | "overdue" | "closed";
}

interface EditLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability: Liability | null;
}

export function EditLiabilityModal({ isOpen, onClose, liability }: EditLiabilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    interestRate: "",
    dueDate: "",
    status: "active",
  });

  useEffect(() => {
    if (liability) {
      setFormData({
        name: liability.name,
        amount: liability.amount.toString(),
        interestRate: liability.interestRate.toString(),
        dueDate: liability.dueDate,
        status: liability.status,
      });
    }
  }, [liability]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add functionality to update liability
    console.log("Updating liability:", formData);
    onClose();
  };

  if (!liability) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Edit Liability</DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-name">Liability Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Car Loan, EMI"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-interestRate">Interest Rate (%)</Label>
            <Input
              id="edit-interestRate"
              type="number"
              placeholder="0"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-white/5 backdrop-blur-md border-white/10 focus:border-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
