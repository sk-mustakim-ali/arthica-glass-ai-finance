import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/liabilities" element={<Liabilities />} />
            
            {/* Business Dashboard Routes */}
            <Route path="/business/create" element={<CreateCompanyPage />} />
            <Route path="/business/dashboard/:companyId" element={<BusinessDashboardLayout />}>
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
