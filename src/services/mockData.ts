// Mock data for demo mode - no Firebase required

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  name: string;
  limit: number;
  spent: number;
}

export interface Budget {
  id: string;
  month: string;
  categories: Category[];
  timeline: "weekly" | "monthly" | "yearly";
  totalLimit: number;
  createdAt: Date;
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: Date | null;
  status: "active" | "overdue" | "closed";
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  healthScore: number;
  currency: string;
  occupation: string;
  financialGoal: string;
  desiredSavings: number;
}

// Demo User
export const demoUser: UserProfile = {
  id: "demo-user-1",
  displayName: "Demo User",
  email: "demo@arthica.app",
  avatarUrl: null,
  healthScore: 72,
  currency: "INR",
  occupation: "Software Engineer",
  financialGoal: "Save for house",
  desiredSavings: 50000,
};

// Demo Transactions
export const demoTransactions: Transaction[] = [
  {
    id: "txn-1",
    amount: 85000,
    category: "Salary",
    type: "income",
    description: "Monthly salary",
    date: new Date("2025-11-01"),
    createdAt: new Date("2025-11-01"),
  },
  {
    id: "txn-2",
    amount: 15000,
    category: "Rent",
    type: "expense",
    description: "Monthly rent",
    date: new Date("2025-11-05"),
    createdAt: new Date("2025-11-05"),
  },
  {
    id: "txn-3",
    amount: 5000,
    category: "Food",
    type: "expense",
    description: "Groceries",
    date: new Date("2025-11-10"),
    createdAt: new Date("2025-11-10"),
  },
  {
    id: "txn-4",
    amount: 2500,
    category: "Transport",
    type: "expense",
    description: "Uber rides",
    date: new Date("2025-11-12"),
    createdAt: new Date("2025-11-12"),
  },
  {
    id: "txn-5",
    amount: 12000,
    category: "Freelance",
    type: "income",
    description: "Website project",
    date: new Date("2025-11-15"),
    createdAt: new Date("2025-11-15"),
  },
  {
    id: "txn-6",
    amount: 3500,
    category: "Entertainment",
    type: "expense",
    description: "Movie & dinner",
    date: new Date("2025-11-18"),
    createdAt: new Date("2025-11-18"),
  },
  {
    id: "txn-7",
    amount: 8000,
    category: "Shopping",
    type: "expense",
    description: "Clothes",
    date: new Date("2025-11-20"),
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "txn-8",
    amount: 4500,
    category: "Bills",
    type: "expense",
    description: "Electricity & Internet",
    date: new Date("2025-11-22"),
    createdAt: new Date("2025-11-22"),
  },
  {
    id: "txn-9",
    amount: 2000,
    category: "Health",
    type: "expense",
    description: "Gym membership",
    date: new Date("2025-11-25"),
    createdAt: new Date("2025-11-25"),
  },
  {
    id: "txn-10",
    amount: 5000,
    category: "Investment",
    type: "income",
    description: "Dividend",
    date: new Date("2025-11-28"),
    createdAt: new Date("2025-11-28"),
  },
];

// Demo Budget
export const demoBudget: Budget = {
  id: "budget-1",
  month: "2025-11",
  timeline: "monthly",
  totalLimit: 60000,
  createdAt: new Date("2025-11-01"),
  categories: [
    { name: "Rent", limit: 15000, spent: 15000 },
    { name: "Food", limit: 10000, spent: 5000 },
    { name: "Transport", limit: 5000, spent: 2500 },
    { name: "Entertainment", limit: 5000, spent: 3500 },
    { name: "Shopping", limit: 10000, spent: 8000 },
    { name: "Bills", limit: 8000, spent: 4500 },
    { name: "Health", limit: 7000, spent: 2000 },
  ],
};

// Demo Liabilities
export const demoLiabilities: Liability[] = [
  {
    id: "liability-1",
    name: "Car Loan",
    amount: 450000,
    interestRate: 8.5,
    dueDate: new Date("2027-06-15"),
    status: "active",
    createdAt: new Date("2024-06-15"),
  },
  {
    id: "liability-2",
    name: "Credit Card",
    amount: 25000,
    interestRate: 18,
    dueDate: new Date("2025-12-10"),
    status: "active",
    createdAt: new Date("2025-10-01"),
  },
  {
    id: "liability-3",
    name: "Personal Loan",
    amount: 100000,
    interestRate: 12,
    dueDate: new Date("2026-03-01"),
    status: "active",
    createdAt: new Date("2025-03-01"),
  },
];

// Helper functions
export const getTransactionTotals = () => {
  const income = demoTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = demoTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome: income,
    totalExpense: expense,
    cashBalance: income - expense,
  };
};

export const getTotalLiabilities = () => {
  return demoLiabilities.reduce((sum, l) => sum + l.amount, 0);
};

export const getOverspentCategories = () => {
  return demoBudget.categories.filter((c) => c.spent > c.limit);
};

export const getBudgetSummary = () => {
  const totalSpent = demoBudget.categories.reduce((sum, c) => sum + c.spent, 0);
  const totalLimit = demoBudget.totalLimit;

  return {
    budget: demoBudget,
    pieData: demoBudget.categories.map((c) => ({ name: c.name, value: c.spent })),
    totalLimit,
    totalSpent,
    totalRemaining: Math.max(totalLimit - totalSpent, 0),
  };
};

export const getTransactionTrendData = (timeline: "weekly" | "monthly" | "yearly" = "monthly") => {
  if (timeline === "weekly") {
    return [
      { label: "Mon", income: 0, expenses: 5000 },
      { label: "Tue", income: 85000, expenses: 0 },
      { label: "Wed", income: 0, expenses: 15000 },
      { label: "Thu", income: 12000, expenses: 2500 },
      { label: "Fri", income: 0, expenses: 3500 },
      { label: "Sat", income: 5000, expenses: 8000 },
      { label: "Sun", income: 0, expenses: 6500 },
    ];
  }

  return [
    { label: "Jan", income: 90000, expenses: 45000 },
    { label: "Feb", income: 85000, expenses: 42000 },
    { label: "Mar", income: 95000, expenses: 48000 },
    { label: "Apr", income: 88000, expenses: 44000 },
    { label: "May", income: 92000, expenses: 46000 },
    { label: "Jun", income: 87000, expenses: 43000 },
    { label: "Jul", income: 98000, expenses: 50000 },
    { label: "Aug", income: 91000, expenses: 47000 },
    { label: "Sep", income: 89000, expenses: 45000 },
    { label: "Oct", income: 94000, expenses: 48000 },
    { label: "Nov", income: 102000, expenses: 40500 },
    { label: "Dec", income: 0, expenses: 0 },
  ];
};
