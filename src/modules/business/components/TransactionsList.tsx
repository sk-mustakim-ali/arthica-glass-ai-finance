import { Transaction } from '../types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Eye } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onView?: (transaction: Transaction) => void;
}

const transactionTypeLabels: Record<string, string> = {
  sales: 'Sales',
  purchase: 'Purchase',
  receipt: 'Receipt',
  payment: 'Payment',
  journal: 'Journal',
  contra: 'Contra',
  'sales-return': 'Sales Return',
  'purchase-return': 'Purchase Return',
  'debit-note': 'Debit Note',
  'credit-note': 'Credit Note',
};

const transactionTypeColors: Record<string, string> = {
  sales: 'bg-green-500',
  purchase: 'bg-red-500',
  receipt: 'bg-blue-500',
  payment: 'bg-orange-500',
  journal: 'bg-purple-500',
  contra: 'bg-gray-500',
};

export function TransactionsList({
  transactions,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
}: TransactionsListProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No transactions found</p>
          <p className="text-sm mt-2">Create your first transaction to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={transactionTypeColors[transaction.type] || 'bg-gray-500'}
                  >
                    {transactionTypeLabels[transaction.type] || transaction.type}
                  </Badge>
                  {transaction.reference && (
                    <span className="text-sm text-muted-foreground">
                      {transaction.reference}
                    </span>
                  )}
                </div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{transaction.date.toLocaleDateString()}</span>
                  {transaction.partyName && <span>• {transaction.partyName}</span>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {formatCurrency(transaction.amount)}
                  </p>
                  {transaction.taxAmount && (
                    <p className="text-xs text-muted-foreground">
                      Tax: {formatCurrency(transaction.taxAmount)}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(transaction)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper to format currency (can be moved to utils)
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}
