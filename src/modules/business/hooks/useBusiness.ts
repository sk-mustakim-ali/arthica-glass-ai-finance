// Business hooks for company and member management
import { useState, useEffect } from 'react';
import { Company, CompanyMember } from '../types/business';
import { getCompanyById, getUserCompanies, checkCompanyAccess } from '../services/companyService';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to fetch company data
 */
export function useCompany(companyId: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCompanyById(companyId);
        
        if (!data) {
          setError('Company not found');
          setCompany(null);
          return;
        }

        // Check access
        if (user) {
          const access = checkCompanyAccess(data, user.uid);
          if (!access.hasAccess) {
            setError('You do not have access to this company');
            setCompany(null);
            return;
          }
        }

        setCompany(data);
      } catch (err) {
        setError('Failed to load company');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (companyId) {
      fetchCompany();
    }
  }, [companyId, user]);

  return { company, loading, error };
}

/**
 * Hook to get current user's companies
 */
export function useUserCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Failed to load companies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return { companies, loading, error };
}

/**
 * Hook to get company members with role information
 */
export function useCompanyMembers(companyId: string) {
  const { company, loading, error } = useCompany(companyId);
  const [members, setMembers] = useState<CompanyMember[]>([]);

  useEffect(() => {
    if (company) {
      setMembers(company.members);
    }
  }, [company]);

  return { members, loading, error };
}
