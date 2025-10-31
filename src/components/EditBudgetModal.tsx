import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

export interface EditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedBudget: Record<string, number>) => void;
  currentBudgets: Record<string, number>;
}

const categories = [
  { key: "Food", label: "Food", emoji: "🍔" },
  { key: "Transport", label: "Transport", emoji: "🚗" },
  { key: "Entertainment", label: "Entertainment", emoji: "🎬" },
  { key: "Utilities", label: "Utilities", emoji: "💡" },
  { key: "Others", label: "Others", emoji: "📦" },
];

export const EditBudgetModal = ({
  open,
  onClose,
  onSave,
  currentBudgets,
}: EditBudgetModalProps) => {
  const [budgets, setBudgets] = useState<Record<string, number>>(currentBudgets);

  useEffect(() => {
    setBudgets(currentBudgets);
  }, [currentBudgets, open]);

  const handleInputChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets((prev) => ({
      ...prev,
      [category]: numValue,
    }));
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);

  const handleSave = () => {
    onSave(budgets);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[500px]">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">Edit Your Budget</DialogTitle>
                <DialogDescription>
                  Adjust your monthly limits for each category.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-2"
                  >
                    <Label htmlFor={category.key} className="flex items-center gap-2">
                      <span className="text-lg">{category.emoji}</span>
                      <span>{category.label}</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        id={category.key}
                        type="number"
                        min="0"
                        step="100"
                        value={budgets[category.key] || 0}
                        onChange={(e) => handleInputChange(category.key, e.target.value)}
                        className="pl-8"
                        placeholder="0"
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Total Monthly Budget</span>
                    </div>
                    <span className="text-2xl font-bold gradient-text">
                      ₹{totalBudget.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="glass-button">
                  Save Changes
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
