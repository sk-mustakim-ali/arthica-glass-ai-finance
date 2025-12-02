import { useParams } from 'react-router-dom';
import { TransactionForm } from '../../components/TransactionForm';

export function ReturnsCreate() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Return</h2>
        <p className="text-muted-foreground">Create a sales/purchase return or credit/debit note</p>
      </div>

      <TransactionForm companyId={companyId!} type="sales-return" />
    </div>
  );
}
