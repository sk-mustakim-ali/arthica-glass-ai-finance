import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function LedgerPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ledger Report</h2>
          <p className="text-muted-foreground">Account-wise transaction history</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Ledger</CardTitle>
          <CardDescription>Detailed transaction ledger - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Ledger report coming soon</p>
            <p className="text-sm mt-2">Phase-2: Account-wise ledger with running balance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
