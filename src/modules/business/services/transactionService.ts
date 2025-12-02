// Transaction service - handles all transaction CRUD operations
// FALLBACK: Uses mock data - replace with Lovable Cloud when available

import { Transaction, TransactionType } from '../types/business';

const TRANSACTIONS_KEY = 'arthica-business-transactions';

// Helper to generate UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get current user ID
function getCurrentUserId(): string {
  const user = localStorage.getItem('arthica-user');
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.uid || parsed.id;
  }
  return 'demo-user-1';
}

// Get transactions from localStorage
function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) {
    // Initialize with sample data
    const sampleData = generateSampleTransactions();
    saveTransactions(sampleData);
    return sampleData;
  }
  return JSON.parse(data).map((t: any) => ({
    ...t,
    date: new Date(t.date),
    createdAt: new Date(t.createdAt),
  }));
}

// Save transactions to localStorage
function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

// Generate sample transactions for demo
function generateSampleTransactions(): Transaction[] {
  const companyId = 'demo-company-1';
  const userId = getCurrentUserId();
  const now = new Date();

  return [
    {
      id: generateId(),
      companyId,
      type: 'sales',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      amount: 50000,
      accountId: 'acc-001',
      partyId: 'party-001',
      partyName: 'ABC Corporation',
      description: 'Product sale invoice #INV-001',
      taxCategoryId: 'tax-001',
      taxAmount: 9000,
      reference: 'INV-001',
      createdBy: userId,
      createdAt: now,
    },
    {
      id: generateId(),
      companyId,
      type: 'purchase',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      amount: 35000,
      accountId: 'acc-002',
      partyId: 'party-002',
      partyName: 'XYZ Suppliers',
      description: 'Raw material purchase',
      taxCategoryId: 'tax-001',
      taxAmount: 6300,
      reference: 'PUR-001',
      createdBy: userId,
      createdAt: now,
    },
  ];
}

/**
 * Get transactions by company and type
 * TODO: Replace with Firestore query when backend available
 */
export async function getTransactionsByType(
  companyId: string,
  type: TransactionType,
  limit: number = 10
): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network

  const transactions = getTransactions();
  return transactions
    .filter((t) => t.companyId === companyId && t.type === type)
    .slice(0, limit);
}

/**
 * Get all transactions for a company
 */
export async function getCompanyTransactions(
  companyId: string,
  limit: number = 50
): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const transactions = getTransactions();
  return transactions
    .filter((t) => t.companyId === companyId)
    .slice(0, limit);
}

/**
 * Create a new transaction
 * TODO: Replace with Firestore write when backend available
 */
export async function createTransaction(
  data: Omit<Transaction, 'id' | 'createdBy' | 'createdAt'>
): Promise<Transaction> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newTransaction: Transaction = {
    ...data,
    id: generateId(),
    createdBy: getCurrentUserId(),
    createdAt: new Date(),
  };

  const transactions = getTransactions();
  transactions.push(newTransaction);
  saveTransactions(transactions);

  return newTransaction;
}

/**
 * Update transaction
 */
export async function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error('Transaction not found');
  }

  transactions[index] = { ...transactions[index], ...updates };
  saveTransactions(transactions);
}

/**
 * Delete transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered);
}
