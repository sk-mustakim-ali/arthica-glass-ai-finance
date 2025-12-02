import { useParams } from 'react-router-dom';
import { useCompany } from '../../hooks/useBusiness';
import { AdminPanel } from '../../components/AdminPanel';

export function UsersSettingsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company } = useCompany(companyId!);

  if (!company) return null;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage team members and permissions</p>
      </div>

      <AdminPanel company={company} />
    </div>
  );
}
