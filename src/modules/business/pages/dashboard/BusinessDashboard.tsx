import { useParams, Outlet } from 'react-router-dom';
import { BusinessSidebar } from '../../components/Sidebar';
import { BusinessDashboardHeader } from '../../components/DashboardHeader';
import { useCompany } from '../../hooks/useBusiness';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BusinessDashboardLayout() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, loading, error } = useCompany(companyId!);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-border px-6 flex items-center">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex">
          <div className="w-64 border-r border-border p-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            {error || 'You do not have access to this company.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessDashboardHeader company={company} />
      <div className="flex">
        <BusinessSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
