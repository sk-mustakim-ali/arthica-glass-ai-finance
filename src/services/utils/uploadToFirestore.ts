// src/utils/uploadToFirestore.ts
// Placeholder - upload your actual uploadToFirestore.ts

import { NormalizedTransaction } from "./normalize";

export interface UploadResult {
  uploaded: number;
  invalidCount: number;
  invalidRows: number[];
}

export async function uploadTransactions(
  transactions: NormalizedTransaction[],
  userId: string
): Promise<UploadResult> {
  // TODO: Implement actual Firestore upload
  console.warn("uploadTransactions is a placeholder - implement actual upload");
  return {
    uploaded: 0,
    invalidCount: 0,
    invalidRows: [],
  };
}
