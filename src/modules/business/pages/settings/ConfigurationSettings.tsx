import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function ConfigurationSettingsPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground">System preferences and features</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features & Options</CardTitle>
          <CardDescription>Enable or disable features - Coming in Phase-2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-currency</Label>
              <p className="text-sm text-muted-foreground">Enable multiple currency support</p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Inventory Management</Label>
              <p className="text-sm text-muted-foreground">Track stock and inventory</p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Automatic daily backups</p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send alerts via email</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
