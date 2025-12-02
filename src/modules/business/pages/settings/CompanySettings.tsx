import { useParams } from 'react-router-dom';
import { useCompany } from '../../hooks/useBusiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function CompanySettingsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, loading } = useCompany(companyId!);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Company Settings</h2>
        <p className="text-muted-foreground">Manage company information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" value={company.name} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={company.currency} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" value={company.timezone} disabled />
            </div>
          </div>

          {company.gstNumber && (
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input id="gst" value={company.gstNumber} disabled />
            </div>
          )}

          {company.financialYearStart && (
            <div className="space-y-2">
              <Label htmlFor="fyStart">Financial Year Start</Label>
              <Input id="fyStart" value={company.financialYearStart} disabled />
            </div>
          )}

          <Button disabled>Save Changes (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
