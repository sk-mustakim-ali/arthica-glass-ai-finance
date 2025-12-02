import { useParams } from 'react-router-dom';
import { useCompany } from '../../hooks/useBusiness';
import { useCompanyTransactions } from '../../hooks/useTransactions';
import { AdminPanel } from '../../components/AdminPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Wallet, Users } from 'lucide-react';

export function DashboardHome() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company } = useCompany(companyId!);
  const { transactions } = useCompanyTransactions(companyId!, 10);

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹0.00',
      icon: TrendingUp,
      description: 'This month',
    },
    {
      title: 'Total Expenses',
      value: '₹0.00',
      icon: Wallet,
      description: 'This month',
    },
    {
      title: 'Transactions',
      value: transactions.length,
      icon: BarChart3,
      description: 'Recent',
    },
    {
      title: 'Team Members',
      value: company?.members.length || 0,
      icon: Users,
      description: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to {company?.name || 'Business Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholder - TODO: Phase-2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder - Coming in Phase-2
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder - Coming in Phase-2
          </CardContent>
        </Card>
      </div>

      {/* Admin Panel */}
      {company && <AdminPanel company={company} />}
    </div>
  );
}
