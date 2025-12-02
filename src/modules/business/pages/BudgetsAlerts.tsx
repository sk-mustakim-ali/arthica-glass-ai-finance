import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function BudgetsAlertsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets & Alerts</h2>
          <p className="text-muted-foreground">Set financial targets and alerts</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>Set and track budgets - Coming in Phase-2</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Budget features coming soon</p>
              <p className="text-sm mt-2">Phase-2: Set category-wise budgets and track spending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Configure spending alerts - Coming in Phase-2</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Alert configuration coming soon</p>
              <p className="text-sm mt-2">Phase-2: Get notified when spending exceeds limits</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
