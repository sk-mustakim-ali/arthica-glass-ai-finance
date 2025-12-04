import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, TrendingDown, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '../hooks/useStudent';

const subscriptionLogos: Record<string, string> = {
  'Spotify': '🎵',
  'Netflix': '🎬',
  'Amazon Prime': '📦',
  'Canva Pro': '🎨',
  'YouTube Premium': '▶️',
};

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions } = useSubscriptions();

  const activeSubscriptions = subscriptions.filter(s => s.isActive);
  const totalMonthly = activeSubscriptions
    .filter(s => s.billingCycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  const totalYearly = activeSubscriptions
    .filter(s => s.billingCycle === 'yearly')
    .reduce((sum, s) => sum + s.amount / 12, 0);

  const upcomingRenewals = subscriptions
    .filter(s => s.isActive && new Date(s.nextBilling).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Subscriptions 📱</h1>
        <p className="text-muted-foreground">Track your recurring payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-student-border">
          <p className="text-sm text-muted-foreground mb-2">Monthly Spend</p>
          <p className="text-3xl font-bold">₹{Math.round(totalMonthly + totalYearly)}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeSubscriptions.length} active subscriptions</p>
        </Card>
        <Card className="p-6 border-student-border">
          <p className="text-sm text-muted-foreground mb-2">Yearly Projection</p>
          <p className="text-3xl font-bold">₹{Math.round((totalMonthly + totalYearly) * 12).toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on current subscriptions</p>
        </Card>
        <Card className="p-6 border-student-border bg-student-warning/5">
          <p className="text-sm text-muted-foreground mb-2">Potential Savings</p>
          <p className="text-3xl font-bold text-student-success">₹328</p>
          <p className="text-xs text-muted-foreground mt-1">By optimizing unused services</p>
        </Card>
      </div>

      {/* Upcoming Renewals Alert */}
      {upcomingRenewals.length > 0 && (
        <Card className="p-4 border-student-warning/50 bg-student-warning/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-student-warning" />
            <div>
              <p className="font-medium">Upcoming Renewals</p>
              <p className="text-sm text-muted-foreground">
                {upcomingRenewals.length} subscription(s) renewing in the next 7 days
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Subscription Radar */}
      <Card className="p-6 border-student-border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-student-primary" />
          Silent Money Leaks
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-student-error/5 border border-student-error/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">▶️</span>
              <div className="flex-1">
                <p className="font-medium">YouTube Premium</p>
                <p className="text-sm text-muted-foreground">Unused for 45 days • ₹129/month</p>
              </div>
              <Button size="sm" variant="outline" className="text-student-error border-student-error/50">
                Cancel
              </Button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-student-warning/5 border border-student-warning/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div className="flex-1">
                <p className="font-medium">Canva Pro</p>
                <p className="text-sm text-muted-foreground">Your college provides free access! • ₹499/month</p>
              </div>
              <Button size="sm" variant="outline" className="text-student-warning border-student-warning/50">
                Review
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* All Subscriptions */}
      <div>
        <h3 className="font-semibold mb-4">All Subscriptions</h3>
        <div className="space-y-3">
          {subscriptions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 border-student-border ${!sub.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {subscriptionLogos[sub.name] || '📦'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{sub.name}</p>
                      <Badge variant={sub.isActive ? 'default' : 'secondary'} className="text-xs">
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{sub.amount}
                      <span className="text-xs text-muted-foreground font-normal">
                        /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sub.nextBilling).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Tip */}
      <Card className="p-6 border-student-border bg-gradient-to-br from-student-primary/5 to-student-accent/5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h4 className="font-semibold">Student Tip</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Many services offer student discounts! Check if you can get Spotify, Apple Music, or Amazon Prime at reduced rates with your college email.
            </p>
            <Button variant="link" className="px-0 mt-2 text-student-primary">
              Learn more about student discounts →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
