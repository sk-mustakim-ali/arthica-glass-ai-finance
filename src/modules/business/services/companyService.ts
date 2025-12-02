// Company service - handles company creation and management
// FALLBACK: Uses localStorage - replace with Lovable Cloud when available

import { Company, CompanyMember, CreateCompanyPayload, Budget } from '../types/business';

const COMPANIES_KEY = 'arthica-business-companies';
const BUDGETS_KEY = 'arthica-business-budgets';

// FALLBACK - replace with shared helper if/when available
function getCurrentUserId(): string {
  const user = localStorage.getItem('arthica-user');
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.uid || parsed.id;
  }
  return 'demo-user-1';
}

// Helper to generate UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get all companies (from localStorage)
function getCompanies(): Company[] {
  const data = localStorage.getItem(COMPANIES_KEY);
  if (!data) return [];
  return JSON.parse(data).map((c: any) => ({
    ...c,
    createdAt: new Date(c.createdAt),
    members: c.members.map((m: any) => ({
      ...m,
      joinedAt: new Date(m.joinedAt),
    })),
  }));
}

// Save companies to localStorage
function saveCompanies(companies: Company[]): void {
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
}

// Get budgets
function getBudgets(): Budget[] {
  const data = localStorage.getItem(BUDGETS_KEY);
  if (!data) return [];
  return JSON.parse(data).map((b: any) => ({
    ...b,
    createdAt: new Date(b.createdAt),
  }));
}

// Save budgets
function saveBudgets(budgets: Budget[]): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

/**
 * Creates a new company with default budget and updates user profile
 * TODO: Replace with Firestore writeBatch when backend is available
 * TODO: Implement Firestore rules for company ownership
 * 
 * @param payload - Company creation data
 * @returns Created company ID
 */
export async function createCompanyAndInit(
  payload: CreateCompanyPayload
): Promise<{ companyId: string }> {
  try {
    const userId = getCurrentUserId();
    const companyId = generateId();
    const budgetId = generateId();
    const now = new Date();

    // Create company
    const newCompany: Company = {
      id: companyId,
      name: payload.name,
      ownerId: userId,
      currency: payload.currency || 'INR',
      timezone: payload.timezone || 'Asia/Kolkata',
      financialYearStart: payload.financialYearStart,
      gstNumber: payload.gstNumber,
      address: payload.address,
      members: [
        {
          uid: userId,
          role: 'owner',
          joinedAt: now,
        },
      ],
      createdAt: now,
    };

    // Create default budget
    const defaultBudget: Budget = {
      id: budgetId,
      companyId,
      name: 'Default Budget',
      total: 0,
      spentToDate: 0,
      period: 'monthly',
      categories: [
        { name: 'Sales', allocated: 0, spent: 0 },
        { name: 'Purchases', allocated: 0, spent: 0 },
        { name: 'Operating Expenses', allocated: 0, spent: 0 },
      ],
      createdAt: now,
    };

    // Save to localStorage (FALLBACK)
    const companies = getCompanies();
    companies.push(newCompany);
    saveCompanies(companies);

    const budgets = getBudgets();
    budgets.push(defaultBudget);
    saveBudgets(budgets);

    // Update user profile with companyId
    // TODO: When backend is available, update /users/{uid} with { companyId, role: 'owner' }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { companyId };
  } catch (error) {
    console.error('Error creating company:', error);
    throw new Error('Failed to create company. Please try again.');
  }
}

/**
 * Get company by ID
 */
export async function getCompanyById(companyId: string): Promise<Company | null> {
  const companies = getCompanies();
  return companies.find((c) => c.id === companyId) || null;
}

/**
 * Get all companies for current user
 */
export async function getUserCompanies(): Promise<Company[]> {
  const userId = getCurrentUserId();
  const companies = getCompanies();
  return companies.filter((c) => 
    c.members.some((m) => m.uid === userId)
  );
}

/**
 * Update company member role (owner-only action)
 */
export async function updateMemberRole(
  companyId: string,
  memberId: string,
  newRole: CompanyMember['role']
): Promise<void> {
  const userId = getCurrentUserId();
  const companies = getCompanies();
  const company = companies.find((c) => c.id === companyId);

  if (!company) {
    throw new Error('Company not found');
  }

  // Check if current user is owner
  const isOwner = company.members.some(
    (m) => m.uid === userId && m.role === 'owner'
  );
  
  if (!isOwner) {
    throw new Error('Only owner can change member roles');
  }

  // Update member role
  const memberIndex = company.members.findIndex((m) => m.uid === memberId);
  if (memberIndex === -1) {
    throw new Error('Member not found');
  }

  company.members[memberIndex].role = newRole;
  saveCompanies(companies);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
}

/**
 * Check if user has access to company
 */
export function checkCompanyAccess(
  company: Company,
  userId: string
): { hasAccess: boolean; role?: CompanyMember['role'] } {
  const member = company.members.find((m) => m.uid === userId);
  return {
    hasAccess: !!member,
    role: member?.role,
  };
}
