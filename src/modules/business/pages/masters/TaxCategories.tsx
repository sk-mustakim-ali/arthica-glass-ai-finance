import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TaxCategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tax Categories</h2>
          <p className="text-muted-foreground">Manage GST and tax settings</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          New Tax Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Configuration</CardTitle>
          <CardDescription>GST rates and tax categories - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Tax category management coming soon</p>
            <p className="text-sm mt-2">Phase-2: Configure GST, IGST, CGST/SGST rates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
