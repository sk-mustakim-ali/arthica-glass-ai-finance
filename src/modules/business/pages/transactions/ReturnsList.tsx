import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyTransactions } from '../../hooks/useTransactions';
import { TransactionsList } from '../../components/TransactionsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ReturnsList() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { transactions, loading, error } = useCompanyTransactions(companyId!, 10);

  // Filter for returns
  const returns = transactions.filter(t => 
    t.type.includes('return') || t.type.includes('note')
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Returns & Credit/Debit Notes</h2>
          <p className="text-muted-foreground">Manage returns and adjustment notes</p>
        </div>
        <Button onClick={() => navigate(`/business/dashboard/${companyId}/transactions/returns/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          New Return
        </Button>
      </div>

      <TransactionsList
        transactions={returns}
        loading={loading}
        error={error}
      />
    </div>
  );
}
