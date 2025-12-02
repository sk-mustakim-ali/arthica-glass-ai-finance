// Hooks for transaction data
import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types/business';
import { getTransactionsByType, getCompanyTransactions } from '../services/transactionService';

/**
 * Hook to fetch transactions by type
 */
export function useTransactionsByType(
  companyId: string,
  type: TransactionType,
  limit: number = 10
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactionsByType(companyId, type, limit);
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (companyId) {
      fetchTransactions();
    }
  }, [companyId, type, limit]);

  return { transactions, loading, error, refetch: () => {} };
}

/**
 * Hook to fetch all company transactions
 */
export function useCompanyTransactions(companyId: string, limit: number = 50) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyTransactions(companyId, limit);
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (companyId) {
      fetchTransactions();
    }
  }, [companyId, limit]);

  return { transactions, loading, error };
}
