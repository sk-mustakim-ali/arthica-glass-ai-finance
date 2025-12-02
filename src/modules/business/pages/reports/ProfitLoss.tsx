import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ProfitLossPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profit & Loss</h2>
          <p className="text-muted-foreground">Income and expense statement</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>P&L Statement</CardTitle>
          <CardDescription>Profit and loss report - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>P&L report coming soon</p>
            <p className="text-sm mt-2">Phase-2: Income vs expenses with period comparison</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
