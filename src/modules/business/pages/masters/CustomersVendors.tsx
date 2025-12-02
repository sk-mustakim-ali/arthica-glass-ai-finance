import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CustomersVendorsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers & Vendors</h2>
          <p className="text-muted-foreground">Manage business relationships</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </Button>
      </div>

      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Manage your customers - Coming in Phase-2</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Customer management coming soon</p>
                <p className="text-sm mt-2">Phase-2: Add customers with contact details and credit limits</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor List</CardTitle>
              <CardDescription>Manage your vendors - Coming in Phase-2</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Vendor management coming soon</p>
                <p className="text-sm mt-2">Phase-2: Add vendors with payment terms and details</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
