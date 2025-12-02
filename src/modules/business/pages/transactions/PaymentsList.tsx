import { useParams, useNavigate } from 'react-router-dom';
import { useTransactionsByType } from '../../hooks/useTransactions';
import { TransactionsList } from '../../components/TransactionsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function PaymentsList() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useTransactionsByType(companyId!, 'payment', 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage outgoing payments</p>
        </div>
        <Button onClick={() => navigate(`/business/dashboard/${companyId}/transactions/payments/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </div>

      <TransactionsList
        transactions={transactions}
        loading={loading}
        error={error}
      />
    </div>
  );
}
