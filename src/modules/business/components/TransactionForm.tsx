import { useState } from 'react';
import { TransactionType } from '../types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createTransaction } from '../services/transactionService';
import { useNavigate } from 'react-router-dom';

interface TransactionFormProps {
  companyId: string;
  type: TransactionType;
  onSuccess?: () => void;
}

export function TransactionForm({ companyId, type, onSuccess }: TransactionFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    accountId: 'acc-001',
    partyName: '',
    description: '',
    taxCategoryId: '',
    taxAmount: '',
    reference: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: 'Validation error',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please enter a description',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        companyId,
        type,
        date: new Date(formData.date),
        amount: parseFloat(formData.amount),
        accountId: formData.accountId,
        partyName: formData.partyName || undefined,
        description: formData.description,
        taxCategoryId: formData.taxCategoryId || undefined,
        taxAmount: formData.taxAmount ? parseFloat(formData.taxAmount) : undefined,
        reference: formData.reference || undefined,
      });

      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(-1);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create {type.charAt(0).toUpperCase() + type.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="INV-001"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partyName">Customer / Vendor Name</Label>
            <Input
              id="partyName"
              placeholder="Enter party name"
              value={formData.partyName}
              onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax Amount</Label>
              <Input
                id="taxAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.taxAmount}
                onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acc-001">Cash Account</SelectItem>
                <SelectItem value="acc-002">Bank Account</SelectItem>
                <SelectItem value="acc-003">Sales Account</SelectItem>
                <SelectItem value="acc-004">Purchase Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction details"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
