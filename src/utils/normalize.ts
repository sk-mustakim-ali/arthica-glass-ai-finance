// src/utils/normalize.ts
// Placeholder - upload your actual normalize.ts

export interface RawRow {
  [key: string]: unknown;
}

export interface NormalizedTransaction {
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  date: Date;
  userId: string;
}

export function normalizeTransactions(rows: RawRow[], userId: string): NormalizedTransaction[] {
  // TODO: Implement actual normalization
  console.warn("normalizeTransactions is a placeholder - implement actual normalization");
  return [];
}
