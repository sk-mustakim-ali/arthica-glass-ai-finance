import { useParams } from 'react-router-dom';
import { TransactionForm } from '../../components/TransactionForm';

export function ReceiptsCreate() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Receipt</h2>
        <p className="text-muted-foreground">Record a new payment receipt</p>
      </div>

      <TransactionForm companyId={companyId!} type="receipt" />
    </div>
  );
}
