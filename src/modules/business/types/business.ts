// TypeScript types for Business Dashboard module

export interface Company {
  id: string;
  name: string;
  ownerId: string;
  members: CompanyMember[];
  currency: string;
  timezone: string;
  createdAt: Date;
  financialYearStart?: string;
  gstNumber?: string;
  address?: string;
}

export interface CompanyMember {
  uid: string;
  role: 'owner' | 'admin' | 'accountant' | 'viewer';
  joinedAt: Date;
  email?: string;
  displayName?: string;
}

export interface CreateCompanyPayload {
  name: string;
  currency?: string;
  timezone?: string;
  financialYearStart?: string;
  gstNumber?: string;
  address?: string;
}

export interface Budget {
  id: string;
  companyId: string;
  name: string;
  total: number;
  spentToDate: number;
  categories?: BudgetCategory[];
  period: 'monthly' | 'quarterly' | 'yearly';
  createdAt: Date;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

export type TransactionType = 
  | 'sales' 
  | 'purchase' 
  | 'receipt' 
  | 'payment' 
  | 'journal' 
  | 'contra'
  | 'sales-return'
  | 'purchase-return'
  | 'debit-note'
  | 'credit-note';

export interface Transaction {
  id: string;
  companyId: string;
  type: TransactionType;
  date: Date;
  amount: number;
  accountId: string;
  partyId?: string;
  partyName?: string;
  description: string;
  taxCategoryId?: string;
  taxAmount?: number;
  reference?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Account {
  id: string;
  companyId: string;
  name: string;
  code: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  group: string;
  balance: number;
  isActive: boolean;
}

export interface TaxCategory {
  id: string;
  companyId: string;
  name: string;
  rate: number;
  type: 'GST' | 'IGST' | 'CGST_SGST' | 'VAT' | 'None';
  isActive: boolean;
}

export interface Party {
  id: string;
  companyId: string;
  name: string;
  type: 'customer' | 'vendor' | 'both';
  email?: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
  outstandingBalance: number;
}
