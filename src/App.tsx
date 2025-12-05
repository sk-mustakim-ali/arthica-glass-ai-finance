import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Liabilities from "./pages/Liabilities";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import { BusinessDashboardLayout } from "./modules/business/pages/dashboard/BusinessDashboard";
import { DashboardHome } from "./modules/business/pages/dashboard/DashboardHome";
import { CreateCompanyPage } from "./modules/business/pages/CreateCompany";
import { SalesList } from "./modules/business/pages/transactions/SalesList";
import { SalesCreate } from "./modules/business/pages/transactions/SalesCreate";
import { PurchasesList } from "./modules/business/pages/transactions/PurchasesList";
import { PurchasesCreate } from "./modules/business/pages/transactions/PurchasesCreate";
import { ReceiptsList } from "./modules/business/pages/transactions/ReceiptsList";
import { ReceiptsCreate } from "./modules/business/pages/transactions/ReceiptsCreate";
import { PaymentsList } from "./modules/business/pages/transactions/PaymentsList";
import { PaymentsCreate } from "./modules/business/pages/transactions/PaymentsCreate";
import { JournalsList } from "./modules/business/pages/transactions/JournalsList";
import { JournalsCreate } from "./modules/business/pages/transactions/JournalsCreate";
import { ReturnsList } from "./modules/business/pages/transactions/ReturnsList";
import { ReturnsCreate } from "./modules/business/pages/transactions/ReturnsCreate";
import { AccountsPage } from "./modules/business/pages/masters/Accounts";
import { TaxCategoriesPage } from "./modules/business/pages/masters/TaxCategories";
import { CustomersVendorsPage } from "./modules/business/pages/masters/CustomersVendors";
import { BudgetsAlertsPage } from "./modules/business/pages/BudgetsAlerts";
import { TrialBalancePage } from "./modules/business/pages/reports/TrialBalance";
import { LedgerPage } from "./modules/business/pages/reports/Ledger";
import { ProfitLossPage } from "./modules/business/pages/reports/ProfitLoss";
import { OutstandingPage } from "./modules/business/pages/reports/Outstanding";
import { GSTSummaryPage } from "./modules/business/pages/reports/GSTSummary";
import { CompanySettingsPage } from "./modules/business/pages/settings/CompanySettings";
import { UsersSettingsPage } from "./modules/business/pages/settings/UsersSettings";
import { ConfigurationSettingsPage } from "./modules/business/pages/settings/ConfigurationSettings";

// Student Module imports
import { StudentDashboardLayout } from "./modules/student/pages/StudentDashboardLayout";
import { StudentDashboardHome } from "./modules/student/pages/StudentDashboardHome";
import { TransactionsPage as StudentTransactions } from "./modules/student/pages/TransactionsPage";
import { BudgetsPage as StudentBudgets } from "./modules/student/pages/BudgetsPage";
import { GoalsPage as StudentGoals } from "./modules/student/pages/GoalsPage";
import { InsightsPage as StudentInsights } from "./modules/student/pages/InsightsPage";
import { ChallengesPage as StudentChallenges } from "./modules/student/pages/ChallengesPage";
import { SubscriptionsPage as StudentSubscriptions } from "./modules/student/pages/SubscriptionsPage";
import { AICoachPage as StudentAICoach } from "./modules/student/pages/AICoachPage";
import { SettingsPage as StudentSettings } from "./modules/student/pages/SettingsPage";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user hasn't completed onboarding, redirect to onboarding
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

// Smart dashboard router based on account type
function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.accountType === "business" && user.companyId) {
    return <Navigate to={`/business/dashboard/${user.companyId}`} replace />;
  }
  
  if (user?.accountType === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  return <Dashboard />;
}

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/onboarding" element={<Onboarding />} />

    {/* Protected Personal Dashboard routes */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
    <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
    <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
    <Route path="/liabilities" element={<ProtectedRoute><Liabilities /></ProtectedRoute>} />

    {/* Business Module routes */}
    <Route path="/business/create" element={<ProtectedRoute><CreateCompanyPage /></ProtectedRoute>} />
    <Route path="/business/dashboard/:companyId" element={<ProtectedRoute><BusinessDashboardLayout /></ProtectedRoute>}>
      <Route index element={<DashboardHome />} />
      <Route path="transactions/sales" element={<SalesList />} />
      <Route path="transactions/sales/create" element={<SalesCreate />} />
      <Route path="transactions/purchases" element={<PurchasesList />} />
      <Route path="transactions/purchases/create" element={<PurchasesCreate />} />
      <Route path="transactions/receipts" element={<ReceiptsList />} />
      <Route path="transactions/receipts/create" element={<ReceiptsCreate />} />
      <Route path="transactions/payments" element={<PaymentsList />} />
      <Route path="transactions/payments/create" element={<PaymentsCreate />} />
      <Route path="transactions/journals" element={<JournalsList />} />
      <Route path="transactions/journals/create" element={<JournalsCreate />} />
      <Route path="transactions/returns" element={<ReturnsList />} />
      <Route path="transactions/returns/create" element={<ReturnsCreate />} />
      <Route path="masters/accounts" element={<AccountsPage />} />
      <Route path="masters/tax-categories" element={<TaxCategoriesPage />} />
      <Route path="masters/customers-vendors" element={<CustomersVendorsPage />} />
      <Route path="budgets-alerts" element={<BudgetsAlertsPage />} />
      <Route path="reports/trial-balance" element={<TrialBalancePage />} />
      <Route path="reports/ledger" element={<LedgerPage />} />
      <Route path="reports/pnl" element={<ProfitLossPage />} />
      <Route path="reports/outstanding" element={<OutstandingPage />} />
      <Route path="reports/gst-summary" element={<GSTSummaryPage />} />
      <Route path="settings/company" element={<CompanySettingsPage />} />
      <Route path="settings/users" element={<UsersSettingsPage />} />
      <Route path="settings/configuration" element={<ConfigurationSettingsPage />} />
    </Route>

    {/* Student Module routes */}
    <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboardLayout /></ProtectedRoute>}>
      <Route index element={<StudentDashboardHome />} />
      <Route path="transactions" element={<StudentTransactions />} />
      <Route path="budgets" element={<StudentBudgets />} />
      <Route path="goals" element={<StudentGoals />} />
      <Route path="insights" element={<StudentInsights />} />
      <Route path="challenges" element={<StudentChallenges />} />
      <Route path="subscriptions" element={<StudentSubscriptions />} />
      <Route path="ai-coach" element={<StudentAICoach />} />
      <Route path="settings" element={<StudentSettings />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
