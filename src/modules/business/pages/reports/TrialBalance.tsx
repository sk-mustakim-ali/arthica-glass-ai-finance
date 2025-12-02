import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function TrialBalancePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trial Balance</h2>
          <p className="text-muted-foreground">View debit and credit totals</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trial Balance Report</CardTitle>
          <CardDescription>Account-wise debit and credit summary - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Trial Balance report coming soon</p>
            <p className="text-sm mt-2">Phase-2: Real-time trial balance with drill-down</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
