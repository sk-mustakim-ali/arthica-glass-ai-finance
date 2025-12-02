import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AccountsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your ledger accounts</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Ledger</CardTitle>
          <CardDescription>List of all accounts - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Account management coming soon</p>
            <p className="text-sm mt-2">Phase-2: Full chart of accounts with groups and types</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
