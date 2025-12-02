import { useParams, useNavigate } from 'react-router-dom';
import { useTransactionsByType } from '../../hooks/useTransactions';
import { TransactionsList } from '../../components/TransactionsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function JournalsList() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useTransactionsByType(companyId!, 'journal', 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journals & Contra</h2>
          <p className="text-muted-foreground">Manage journal entries and contra vouchers</p>
        </div>
        <Button onClick={() => navigate(`/business/dashboard/${companyId}/transactions/journals/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          New Journal
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
