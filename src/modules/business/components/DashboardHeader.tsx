import { Building2, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Company } from '../types/business';

interface BusinessDashboardHeaderProps {
  company: Company | null;
}

export function BusinessDashboardHeader({ company }: BusinessDashboardHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.displayName || 'User';

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-bold text-lg">{company?.name || 'Business Dashboard'}</h1>
          <p className="text-xs text-muted-foreground">
            {company?.currency || 'INR'} • {company?.timezone || 'Asia/Kolkata'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {displayName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Business Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/')}>
              Personal Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/business/dashboard/${company?.id}/settings/company`)}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
