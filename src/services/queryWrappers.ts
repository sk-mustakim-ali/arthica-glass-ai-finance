//--------------------------------------------------------------
// 🔹 Purpose:
// Centralized, reusable Firestore query wrappers for UI access.
// These wrap all Firestore reads + writes for Transactions,
// Budgets, Liabilities, Profiles, HealthScore, and Charts.
// Modified to support business onboarding flow (companies + members).
//--------------------------------------------------------------

import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
  onSnapshot,
  CollectionReference,
  DocumentData,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

//--------------------------------------------------------------
// 📘 Interfaces
//--------------------------------------------------------------

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  date: string;
  createdAt: Timestamp;
}

export interface Category {
  name: string;
  limit: number;
  spent: number;
}

export interface ListenerTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

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

export interface Budget {
  id?: string;
  month?: string;
  categories: Category[];
  timeline: "weekly" | "monthly" | "yearly";
  totalLimit: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  // ✅ Optional computed fields:
  totalSpent?: number;
  totalRemaining?: number;
  isOverspent?: boolean;
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: Timestamp | string | null;
  status: "active" | "overdue" | "closed";
  createdAt?: Timestamp | null;
}

export interface UserProfile {
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: Timestamp;
  currency?: string;
  occupation?: string;
  financialGoal?: string;
  desiredSavings?: number;
}

export interface UserDoc {
  email: string;
  name: string;
  createdAt?: Timestamp;
  role: "personal" | "business" | "premium";
  healthScore?: number;
}

// Onboarding payload shape (keeps what your UI sends)
export interface OnboardingData {
  // NEW: account type (personal | business)
  accountType?: "personal" | "business";

  // Personal fields
  fullName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  otherOccupation?: string;
  monthlyIncome: string;

  // Business fields (optional, used when accountType === 'business')
  gstin?: string;
  companyName?: string;
  address?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  fyBeginning?: string;

  // Optionally provide initial budgets for business/company onboarding
  initialBudgets?: Array<{ name?: string; amount?: number }>;

  // Step 2 - Goals & Priorities
  financialGoal: string;
  desiredSavings: string;
  timeFrame: string;
  personalizedInsights: string;

  // Step 3 - Financial Behavior
  moneyManagement: string;
  hasBudget: string;
  currentMonthBudget: string;
  monthlySpendingLimit: string;
  expenseCategories: string[];
  categoryAmounts: Record<string, string>;
  hasLoans: string;
  emiAmount: string;
}

//--------------------------------------------------------------
// 🧩 UID Resolver
//--------------------------------------------------------------
function resolveUid(): string | null {
  const auth = getAuth();
  const demoMode = localStorage.getItem("arthica-demo-mode") === "true";
  return demoMode ? "demoUser" : auth.currentUser?.uid || null;
}

// --------------------------------------------------------------
// 🔧 Type guards
// --------------------------------------------------------------
function isTimestamp(value: unknown): value is Timestamp {
  return typeof value === "object" && value !== null && "toDate" in value;
}

function normalizeToTimestamp(value: unknown): Timestamp {
  if (!value) return Timestamp.now();
  if (isTimestamp(value)) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  return Timestamp.fromDate(new Date(String(value)));
}

// ---------------------- TRANSACTIONS (unified) ----------------------
// Add / Update / Delete / Read / Listen / Totals / Trend helpers
// Option A: store BOTH `date` (user selected) and `createdAt` (system timestamp)

// Add a new transaction.
// Returns inserted document id.

function userTransactionsRef(): CollectionReference<DocumentData> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return collection(db, "users", user.uid, "transactions");
}
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


// Update an existing transaction.
// Keeps original `date` unless `date` is explicitly provided in `data`.
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

// Delete a transaction by id
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "transactions", transactionId);
  await deleteDoc(ref);
};

// Get all transactions (ordered newest first by createdAt)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = collection(db, "users", uid, "transactions");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as Transaction;
    return { id: d.id, ...data };
  });
};

// Get transactions filtered by monthKey (format: "YYYY-MM") using `date` field.
// Note: Firestore cannot filter by formatted string on Timestamp, so we fetch and filter client-side.
// If performance becomes an issue, add and maintain a `month` string field on write.
export const getTransactionsByMonth = async (monthKey: string): Promise<Transaction[]> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");

  const ref = collection(db, "users", uid, "transactions");
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc")));
  const all: Transaction[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }));

  return all.filter((t) => {
    try {
      const ts = normalizeToTimestamp(t.date ?? t.createdAt ?? Timestamp.now());
      const dateObj = ts.toDate();
      return dateObj.toISOString().slice(0, 7) === monthKey;
    } catch {
      return false;
    }
  });
};

// Compute totals (income, expense, balance)
export const getTransactionTotals = async () => {
  const txns = await getAllTransactions();
  let income = 0;
  let expense = 0;

  txns.forEach((t: Transaction) => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  return {
    totalIncome: income,
    totalExpense: expense,
    cashBalance: income - expense,
  };
};

// Realtime listener helper
// - onUpdate receives the latest transactions array
// - returns unsubscribe function
export const listenToTransactions = (
 callback: (transactions: ListenerTransaction[]) => void
): (() => void) => {
  const colRef = userTransactionsRef();
  const q = query(colRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
  const txns: ListenerTransaction[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as FirestoreTransactionDoc;

    return {
      id: docSnap.id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description || "",
      date: data.date?.toDate() ?? new Date(),
      createdAt: data.createdAt?.toDate() ?? new Date(),
    };
  });
  callback(txns);
  });

};

// Transaction trend data - groups by timeline using `date` (prefer) then `createdAt`
export const getTransactionTrendData = async (
  timeline: "weekly" | "monthly" | "yearly" = "monthly"
) => {
  const txns = await getAllTransactions();
  if (!txns.length) return [];

  const grouped: Record<string, { income: number; expenses: number }> = {};

  txns.forEach((t) => {
    const ts = normalizeToTimestamp(t.date ?? t.createdAt ?? Timestamp.now());
    const dateObj = ts.toDate();

    let label = "";

    if (timeline === "weekly") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      label = dayNames[dateObj.getDay()];
    } else {
      label = dateObj.toLocaleString("default", { month: "short" });
    }

    if (!grouped[label]) grouped[label] = { income: 0, expenses: 0 };
    if (t.type === "income") grouped[label].income += Number(t.amount);
    else grouped[label].expenses += Number(t.amount);
  });

  const orderedLabels =
    timeline === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return Object.entries(grouped)
    .map(([label, values]) => ({ label, income: values.income, expenses: values.expenses }))
    .sort((a, b) => orderedLabels.indexOf(a.label) - orderedLabels.indexOf(b.label));
};

//--------------------------------------------------------------
// 💼 BUDGET HELPERS
//--------------------------------------------------------------

export const getAllBudgets = async (): Promise<Budget[]> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = collection(db, "users", uid, "budgets");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Budget) }));
};

export const getActiveBudget = async (): Promise<Budget | null> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const monthKey = new Date().toISOString().slice(0, 7);
  const ref = collection(db, "users", uid, "budgets");
  const q = query(ref, where("month", "==", monthKey));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : ({ id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as Budget) });
};

// 🔹 CRUD Operations for Budgets
export const createBudget = async (data: Omit<Budget, "id">): Promise<string> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = collection(db, "users", uid, "budgets");
  const docRef = await addDoc(ref, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
};

export const updateBudget = async (budgetId: string | null, data: Partial<Budget>): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");

  const budgetsRef = collection(db, "users", uid, "budgets");

  let targetRef;

  if (budgetId) {
    // use provided ID if available
    targetRef = doc(budgetsRef, budgetId);
  } else {
    // fallback: update the latest budget
    const snapshot = await getDocs(query(budgetsRef, orderBy("createdAt", "desc"), limit(1)));
    if (snapshot.empty) throw new Error("No existing budget to update.");
    targetRef = doc(budgetsRef, snapshot.docs[0].id);
  }

  await updateDoc(targetRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBudget = async (budgetId: string): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "budgets", budgetId);
  await deleteDoc(ref);
};

export const getOverspentCategories = async (): Promise<Category[]> => {
  const budget = await getActiveBudget();
  if (!budget) return [];
  return budget.categories.filter((cat: Category) => cat.spent > cat.limit);
};

export const getResolvedActiveBudget = async (): Promise<Budget | null> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");

  const ref = collection(db, "users", uid, "budgets");
  const monthKey = new Date().toISOString().slice(0, 7);
  const q = query(ref, where("month", "==", monthKey));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as Budget) };
  }

  const allSnap = await getDocs(query(ref, orderBy("createdAt", "desc"), limit(1)));
  if (allSnap.empty) return null;
  return { id: allSnap.docs[0].id, ...(allSnap.docs[0].data() as Budget) };
};

export const getBudgetSummaryForCharts = async () => {
  const budget = await getResolvedActiveBudget();
  if (!budget) return null;

  const categories = budget.categories || [];
  const pieData = categories.map((cat) => ({
    name: cat.name,
    value: Math.max(Number(cat.spent ?? 0), 0),
  }));

  const totalSpent = categories.reduce((sum, c) => sum + Number(c.spent ?? 0), 0);
  const totalLimit = typeof budget.totalLimit === "number"
    ? budget.totalLimit
    : categories.reduce((sum, c) => sum + Number(c.limit ?? 0), 0);

  return {
    budget,
    pieData,
    totalLimit,
    totalSpent,
    totalRemaining: Math.max(totalLimit - totalSpent, 0),
  };
};

//--------------------------------------------------------------
// 💳 LIABILITY HELPERS
//--------------------------------------------------------------

export const getAllLiabilities = async (
  status?: "active" | "overdue" | "closed"
): Promise<Liability[]> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");

  const ref = collection(db, "users", uid, "liabilities");

  let q;
  if (status) {
    q = query(ref, where("status", "==", status), orderBy("createdAt", "desc"));
  } else {
    q = query(ref, orderBy("createdAt", "desc"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Liability) }));
};

export const getTotalLiabilities = async (): Promise<number> => {
  const liabilities = await getAllLiabilities();
  return liabilities.reduce((sum: number, l: Liability) => sum + l.amount, 0);
};

// CRUD for liabilities
export const addLiability = async (data: Omit<Liability, "id">): Promise<string> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = collection(db, "users", uid, "liabilities");
  const docRef = await addDoc(ref, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
};

export const updateLiability = async (liabilityId: string, data: Partial<Liability>): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "liabilities", liabilityId);
  await updateDoc(ref, { ...data });
};

export const deleteLiability = async (liabilityId: string): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "liabilities", liabilityId);
  await deleteDoc(ref);
};

//--------------------------------------------------------------
// 👤 PROFILE HELPERS
//--------------------------------------------------------------

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const profileRef = collection(db, "users", uid, "profile");
  const snapshot = await getDocs(profileRef);
  return snapshot.empty ? null : (snapshot.docs[0].data() as UserProfile);
};

export const createUserProfile = async (data: UserProfile): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "profile", "main");
  await setDoc(ref, { ...data, createdAt: Timestamp.now() });
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const ref = doc(db, "users", uid, "profile", "main");
  await updateDoc(ref, { ...data });
};

export const getUserHealthScore = async (): Promise<number | null> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? ((userDoc.data() as UserDoc).healthScore || null) : null;
};

//--------------------------------------------------------------
// 📊 DASHBOARD SUMMARY
//--------------------------------------------------------------

export const getDashboardSummary = async () => {
  const [totals, budget, liabilities, profile, score] = await Promise.all([
    getTransactionTotals(),
    getActiveBudget(),
    getTotalLiabilities(),
    getUserProfile(),
    getUserHealthScore(),
  ]);

  return {
    totals,
    activeBudget: budget,
    totalLiabilities: liabilities,
    profile,
    healthScore: score,
  };
};

//--------------------------------------------------------------
// 🚀 ONBOARDING HELPER (UPDATED)
//--------------------------------------------------------------

/**
 * saveOnboardingData now supports both:
 * - Personal onboarding (existing behavior)
 * - Business onboarding -> creates companies/{companyId}, members, budgets (optional),
 *   links company to user, creates profile, and writes a legacy fallback on user doc.
 */
export const saveOnboardingData = async (data: OnboardingData): Promise<void> => {
  const uid = resolveUid();
  if (!uid) throw new Error("User not authenticated.");

  const userRef = doc(db, "users", uid);

  // If business onboarding: create company + members + optional budgets + link companyId to user
  if (data.accountType === "business") {
    // Ensure we have auth/currentUser for email/displayName
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // 1. Create company doc under /companies
    const companiesRef = collection(db, "companies");
    const newCompanyRef = doc(companiesRef); // generates id but doesn't write
    const companyId = newCompanyRef.id;

    const companyPayload = {
      companyId: companyId,                      // must equal doc id (rules expect this)
      name: data.companyName || "Untitled Company",
      gstin: data.gstin || null,
      address: data.address || null,
      pincode: data.pincode || null,
      country: data.country || "India",
      state: data.state || null,
      city: data.city || null,
      fyBeginning: data.fyBeginning || null,
      currency: "INR",
      primaryTimezone: "Asia/Kolkata",
      logoUrl: null,
      status: "active",
      memberCount: 1,
      transactionCounters: {
        totalTransactions: 0,
        pendingApprovals: 0,
        unreconciled: 0,
        lastUpdated: Timestamp.now()
      },
      defaultViewPreferences: {},
      meta: {},
      ownerId: uid,
      createdAt: Timestamp.now(),
    };

    await setDoc(newCompanyRef, companyPayload);

    // 2. Add member record under companies/{companyId}/members using member UID as doc id
    await setDoc(doc(db, "companies", companyId, "members", uid), {
      uid,
      role: "owner",
      email: currentUser?.email || null,
      displayName: currentUser?.displayName || data.fullName || null,
      joinedAt: Timestamp.now(),
      lastSeenAt: null,
      permissions: {},
      status: "active",
    });

    // 3. Optional: create initial budgets for the company if provided
    if (Array.isArray(data.initialBudgets) && data.initialBudgets.length > 0) {
      const compBudgetsRef = collection(db, `companies/${companyId}/budgets`);
      for (const b of data.initialBudgets) {
        await addDoc(compBudgetsRef, {
          name: b.name || "Untitled",
          amount: Number(b.amount || 0),
          createdAt: Timestamp.now(),
          createdBy: uid,
        });
      }
    }

    // 4. Link companyId to user doc (companyIds array)
    await updateDoc(userRef, {
      companyIds: arrayUnion(companyId),
    });

    // 5. Create a personal profile for the creator under users/{uid}/profile (keep existing pattern)
    const profileRef = collection(db, `users/${uid}/profile`);
    await addDoc(profileRef, {
      displayName: data.fullName || currentUser?.displayName || "",
      avatarUrl: null,
      currency: "INR",
      occupation: data.occupation || null,
      createdAt: Timestamp.now(),
      linkedCompanyId: companyId,
    });

    // 6. Legacy fallback on user doc (merge)
    await setDoc(userRef, { companyId }, { merge: true });

    return;
  }

  // ---------- PERSONAL FLOW (existing behavior) ----------
  // 1. Create Profile Subcollection
  const profileRef = collection(db, `users/${uid}/profile`);
  await addDoc(profileRef, {
    displayName: data.fullName,
    avatarUrl: null,
    currency: "INR",
    notificationsEnabled: true,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    occupation: data.occupation === "other" ? data.otherOccupation : data.occupation,
    monthlyIncome: data.monthlyIncome,
    financialGoal: data.financialGoal,
    desiredSavings: data.desiredSavings,
    personalizedInsights: data.personalizedInsights,
    moneyManagement: data.moneyManagement,
    createdAt: Timestamp.now(),
  });

  // 2. Create Budget Subcollection
  const categories = (data.expenseCategories || []).map((category) => ({
    name: category,
    limit: Number(data.categoryAmounts?.[category]) || 0,
    spent: 0,
  }));

  const budgetsRef = collection(db, `users/${uid}/budgets`);
  const newBudgetRef = await addDoc(budgetsRef, {
    timeline: data.timeFrame || "monthly",
    categories,
    totalLimit: Number(data.currentMonthBudget) || 0,
    createdAt: Timestamp.now(),
  });

  // 3. Link budget reference in user doc
  await setDoc(userRef, { budgetRef: newBudgetRef }, { merge: true });

  // 4. Create Liabilities (if EMI)
  if (data.hasLoans === "yes" && Number(data.emiAmount) > 0) {
    const liabilitiesRef = collection(db, `users/${uid}/liabilities`);
    await addDoc(liabilitiesRef, {
      name: "EMI",
      amount: Number(data.emiAmount),
      interestRate: 0,
      dueDate: null,
      status: "active",
      createdAt: Timestamp.now(),
    });
  }
};

//--------------------------------------------------------------
// ✅ END OF WRAPPERS
//--------------------------------------------------------------
