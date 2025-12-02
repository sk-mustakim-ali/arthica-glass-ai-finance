# Business Dashboard Module

## Overview
This module contains all business accounting functionality for Arthica, including transaction management, masters, reports, and company administration.

## Structure
```
src/modules/business/
├─ services/         # Business logic and data operations
├─ components/       # UI components (Sidebar, Forms, Lists)
├─ hooks/           # React hooks for business data
├─ types/           # TypeScript type definitions
└─ pages/           # Dashboard pages and routes
```

## Phase-1 Implementation
- ✅ Company creation with default budget
- ✅ Dashboard layout with sidebar navigation
- ✅ Transaction module skeletons (Sales, Purchases, Receipts, Payments, Journals, Returns)
- ✅ Masters module skeletons (Accounts, Tax Categories, Customers/Vendors)
- ✅ Reports module skeletons
- ✅ Settings module skeletons
- ✅ Admin panel for user management

## Fallback Files (Local Development)
Since Firebase is currently removed, the following files use local fallbacks:
- `services/companyService.ts` - Uses localStorage for company data
- `services/transactionService.ts` - Uses mock data arrays
- `hooks/useBusiness.ts` - Returns local/mock data

### Replacing Fallbacks with Real Backend
When integrating with Lovable Cloud or Firebase:
1. Update `companyService.ts` to use Firestore writeBatch
2. Replace localStorage calls with Firestore read/write operations
3. Update hooks to use real-time Firestore listeners
4. Implement proper authentication checks

## TODO: Phase-2 Features
- [ ] Real-time charts and analytics
- [ ] Advanced reports with filtering
- [ ] Transaction reconciliation
- [ ] Multi-currency support
- [ ] Export functionality (PDF, Excel)
- [ ] Audit logs
- [ ] Email notifications

## Roadmap Links
- Phase-1: Company setup + basic CRUD
- Phase-2: Analytics + advanced features
