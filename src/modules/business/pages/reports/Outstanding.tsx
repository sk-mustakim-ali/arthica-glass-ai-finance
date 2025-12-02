import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function OutstandingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Outstanding Analysis</h2>
          <p className="text-muted-foreground">Receivables and payables</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Tabs defaultValue="receivables">
        <TabsList>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="payables">Payables</TabsTrigger>
        </TabsList>

        <TabsContent value="receivables">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Receivables</CardTitle>
              <CardDescription>Customer outstanding - Coming in Phase-2</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Receivables report coming soon</p>
                <p className="text-sm mt-2">Phase-2: Age-wise customer outstanding analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Payables</CardTitle>
              <CardDescription>Vendor outstanding - Coming in Phase-2</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Payables report coming soon</p>
                <p className="text-sm mt-2">Phase-2: Age-wise vendor outstanding analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
