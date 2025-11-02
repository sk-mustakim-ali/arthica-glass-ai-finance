import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Liability {
  id: number;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  status: "active" | "overdue" | "closed";
}

interface DeleteLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability: Liability | null;
}

export function DeleteLiabilityModal({ isOpen, onClose, liability }: DeleteLiabilityModalProps) {
  const handleDelete = () => {
    // TODO: Add functionality to delete liability
    console.log("Deleting liability:", liability);
    onClose();
  };

  if (!liability) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-destructive/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Delete Liability
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-6 mt-4"
        >
          <div className="glass-card border-destructive/20 p-4 rounded-xl">
            <p className="text-muted-foreground mb-3">
              Are you sure you want to delete this liability?
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold">{liability.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">₹{liability.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <p className="text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>This action cannot be undone. This will permanently delete the liability from your records.</span>
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Liability
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
