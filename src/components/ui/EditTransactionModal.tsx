import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  note: string;
  date: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction = {
    id: "1",
    amount: 1250,
    category: "Salary",
    type: "income",
    note: "Monthly salary payment",
    date: "2025-01-15",
  },
}) => {
  const [formData, setFormData] = React.useState(transaction);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const handleInputChange = (field: keyof Transaction, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Placeholder success
    setStatusMessage({ type: "success", text: "✓ Transaction updated successfully!" });
    setIsLoading(false);

    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Placeholder success
    setStatusMessage({ type: "success", text: "✓ Transaction deleted successfully!" });
    setIsLoading(false);
    setShowDeleteConfirm(false);

    // Auto-close after success
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="glass-card p-6 md:p-8 bg-card/95 backdrop-blur-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold gradient-text">
                    Edit Transaction
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>

                {/* Status Message */}
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

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                  className="space-y-6"
                >
                  {/* Amount Field */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-foreground/80">
                      Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}
                        className="pl-8 h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Category Field */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-foreground/80">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="focus:bg-primary/10 focus:text-primary cursor-pointer"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Field */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground/80">Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value as "income" | "expense")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <div
                          className={`flex-1 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${
                            formData.type === "income"
                              ? "border-accent bg-accent/10 shadow-[0_0_20px_rgba(110,231,183,0.2)]"
                              : "border-border/50 bg-muted/20 hover:border-border"
                          }`}
                          onClick={() => handleInputChange("type", "income")}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="income" id="income" />
                            <Label
                              htmlFor="income"
                              className={`cursor-pointer font-medium ${
                                formData.type === "income" ? "text-accent" : "text-foreground/70"
                              }`}
                            >
                              💰 Income
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-1">
                        <div
                          className={`flex-1 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${
                            formData.type === "expense"
                              ? "border-destructive bg-destructive/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                              : "border-border/50 bg-muted/20 hover:border-border"
                          }`}
                          onClick={() => handleInputChange("type", "expense")}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="expense" id="expense" />
                            <Label
                              htmlFor="expense"
                              className={`cursor-pointer font-medium ${
                                formData.type === "expense" ? "text-destructive" : "text-foreground/70"
                              }`}
                            >
                              💸 Expense
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Date Field */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium text-foreground/80">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Note Field */}
                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-sm font-medium text-foreground/80">
                      Note (Optional)
                    </Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => handleInputChange("note", e.target.value)}
                      placeholder="Add a note..."
                      className="min-h-[100px] bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {/* Save Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 sm:flex-none h-12 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>

                    {/* Cancel Button */}
                    <Button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      variant="ghost"
                      className="flex-1 sm:flex-none h-12 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={() => setShowDeleteConfirm(false)}
                />

                <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card p-6 bg-card/95 backdrop-blur-2xl max-w-md w-full"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                        <Trash2 className="w-8 h-8 text-destructive" />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Delete Transaction?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This action cannot be undone. This will permanently delete the transaction
                          from your records.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="outline"
                          disabled={isLoading}
                          className="flex-1 h-11"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDelete}
                          disabled={isLoading}
                          className="flex-1 h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
