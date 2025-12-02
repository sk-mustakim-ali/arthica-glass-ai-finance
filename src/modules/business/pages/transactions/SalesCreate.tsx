import { useParams } from 'react-router-dom';
import { TransactionForm } from '../../components/TransactionForm';

export function SalesCreate() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Sale</h2>
        <p className="text-muted-foreground">Create a new sales invoice</p>
      </div>

      <TransactionForm companyId={companyId!} type="sales" />
    </div>
  );
}
