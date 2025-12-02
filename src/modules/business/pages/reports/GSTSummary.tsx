import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function GSTSummaryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">GST Summary</h2>
          <p className="text-muted-foreground">GST input and output summary</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export GSTR-1
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GST Report</CardTitle>
          <CardDescription>GST summary for filing - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>GST summary report coming soon</p>
            <p className="text-sm mt-2">Phase-2: GSTR-1, GSTR-3B ready reports</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
