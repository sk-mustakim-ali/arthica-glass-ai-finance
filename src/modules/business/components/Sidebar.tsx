import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Database,
  FileText,
  Settings,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  CreditCard,
  BookOpen,
  RotateCcw,
  Building2,
  Tag,
  BarChart3,
  Scale,
  TrendingUp,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

export function BusinessSidebar() {
  const location = useLocation();
  const { companyId } = useParams();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    transactions: true,
    masters: false,
    reports: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: `/business/dashboard/${companyId}`,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: 'Transactions',
      path: '#transactions',
      icon: <Receipt className="h-4 w-4" />,
      children: [
        {
          label: 'Sales',
          path: `/business/dashboard/${companyId}/transactions/sales`,
          icon: <ShoppingCart className="h-4 w-4" />,
        },
        {
          label: 'Purchases',
          path: `/business/dashboard/${companyId}/transactions/purchases`,
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          label: 'Receipts',
          path: `/business/dashboard/${companyId}/transactions/receipts`,
          icon: <Wallet className="h-4 w-4" />,
        },
        {
          label: 'Payments',
          path: `/business/dashboard/${companyId}/transactions/payments`,
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: 'Journals / Contra',
          path: `/business/dashboard/${companyId}/transactions/journals`,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: 'Returns / Notes',
          path: `/business/dashboard/${companyId}/transactions/returns`,
          icon: <RotateCcw className="h-4 w-4" />,
        },
      ],
    },
    {
      label: 'Masters',
      path: '#masters',
      icon: <Database className="h-4 w-4" />,
      children: [
        {
          label: 'Accounts',
          path: `/business/dashboard/${companyId}/masters/accounts`,
          icon: <Building2 className="h-4 w-4" />,
        },
        {
          label: 'Tax Categories',
          path: `/business/dashboard/${companyId}/masters/tax-categories`,
          icon: <Tag className="h-4 w-4" />,
        },
        {
          label: 'Customers / Vendors',
          path: `/business/dashboard/${companyId}/masters/customers-vendors`,
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
    {
      label: 'Budgets & Alerts',
      path: `/business/dashboard/${companyId}/budgets-alerts`,
      icon: <AlertCircle className="h-4 w-4" />,
    },
    {
      label: 'Reports',
      path: '#reports',
      icon: <FileText className="h-4 w-4" />,
      children: [
        {
          label: 'Trial Balance',
          path: `/business/dashboard/${companyId}/reports/trial-balance`,
          icon: <Scale className="h-4 w-4" />,
        },
        {
          label: 'Ledger',
          path: `/business/dashboard/${companyId}/reports/ledger`,
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          label: 'P&L',
          path: `/business/dashboard/${companyId}/reports/pnl`,
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          label: 'Outstanding',
          path: `/business/dashboard/${companyId}/reports/outstanding`,
          icon: <FileCheck className="h-4 w-4" />,
        },
        {
          label: 'GST Summary',
          path: `/business/dashboard/${companyId}/reports/gst-summary`,
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ],
    },
    {
      label: 'Settings',
      path: `/business/dashboard/${companyId}/settings/company`,
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const isActive = location.pathname === item.path;
    const isSection = item.path.startsWith('#');
    const sectionKey = item.path.replace('#', '');
    const isExpanded = expandedSections[sectionKey];

    if (isSection) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
              'hover:bg-accent',
              depth > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
          {isExpanded && item.children && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
          'hover:bg-accent',
          isActive && 'bg-primary text-primary-foreground',
          depth > 0 && 'ml-6'
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => renderNavItem(item))}
      </nav>
    </aside>
  );
}
