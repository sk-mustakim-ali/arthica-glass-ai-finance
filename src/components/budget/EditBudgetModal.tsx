import React, { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BudgetsMap = Record<string, number>;

interface EditBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedBudgets: BudgetsMap) => void;
  currentBudgets?: BudgetsMap;
}

const DEFAULT_CATEGORIES = [
  "Food",
  "Rent",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
];

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  open,
  onClose,
  onSave,
  currentBudgets = {},
}) => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    DEFAULT_CATEGORIES.forEach((cat) => {
      const v = currentBudgets?.[cat] ?? 0;
      init[cat] = String(v);
    });
    setValues(init);
  }, [open, currentBudgets]);

  const numericMap: BudgetsMap = useMemo(() => {
    const out: BudgetsMap = {};
    DEFAULT_CATEGORIES.forEach((cat) => {
      const val = parseFloat(values[cat]) || 0;
      out[cat] = Math.max(0, Number(val.toFixed(2)));
    });
    return out;
  }, [values]);

  const totalLimit = useMemo(
    () => Object.values(numericMap).reduce((sum, v) => sum + v, 0),
    [numericMap]
  );

  const handleChange = (cat: string, val: string) => {
    const sanitized = val.replace(/[^\d.]/g, "");
    setValues((prev) => ({ ...prev, [cat]: sanitized }));
  };

  const handleSave = () => {
    onSave(numericMap);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-2xl rounded-2xl p-6">
        <CardHeader className="flex justify-between items-start pb-3">
          <CardTitle>Edit Budget</CardTitle>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-1">
                <Label className="text-sm">{cat}</Label>
                <Input
                  value={values[cat] ?? ""}
                  onChange={(e) => handleChange(cat, e.target.value)}
                  placeholder="0"
                  inputMode="decimal"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Budget (auto)
              </p>
              <p className="text-2xl font-bold">₹{totalLimit.toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBudgetModal;
