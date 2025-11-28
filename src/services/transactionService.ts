import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  CollectionReference,
  DocumentData,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

/**
 * Data structure for new transactions being created
 */
export interface TransactionData {
  amount: number;
  category: string;
  type: "income" | "expense";
  description?: string;
  date?: Date;
}

/**
 * Data structure for transactions fetched from Firestore
 */
export interface FirestoreTransactionDoc {
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date?: Timestamp;
  createdAt?: Timestamp;
}

/**
 * Helper to get reference to the user's transactions subcollection
 * Path → users/{uid}/transactions
 */
function userTransactionsRef(): CollectionReference<DocumentData> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return collection(db, "users", user.uid, "transactions");
}

/**
 * Add a new transaction under users/{uid}/transactions
 */
export const addTransaction = async (data: TransactionData): Promise<void> => {
  const colRef = userTransactionsRef();

  await addDoc(colRef, {
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description || "",
    date: data.date ? Timestamp.fromDate(data.date) : Timestamp.now(),
    createdAt: Timestamp.now(),
  });
};

/**
 * Listen to real-time transaction updates for the logged-in user
 */
export const listenToTransactions = (
  callback: (
    transactions: {
      id: string;
      type: "income" | "expense";
      amount: number;
      category: string;
      description: string;
      timestamp: Date;
    }[]
  ) => void
): (() => void) => {
  const colRef = userTransactionsRef();
  const q = query(colRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const txns = snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreTransactionDoc;
      return {
        id: doc.id,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description || "",
        timestamp:
          data.date?.toDate?.() ?? data.createdAt?.toDate?.() ?? new Date(),
      };
    });
    callback(txns);
  });
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (
  transactionId: string,
  data: Partial<TransactionData>
): Promise<void> => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error("User not authenticated");

  const txnRef = doc(db, "users", auth.currentUser.uid, "transactions", transactionId);
  await updateDoc(txnRef, {
    ...data,
    date: data.date ? Timestamp.fromDate(data.date) : Timestamp.now(),
  });
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error("User not authenticated");

  const txnRef = doc(db, "users", auth.currentUser.uid, "transactions", transactionId);
  await deleteDoc(txnRef);
};
