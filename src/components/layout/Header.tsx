import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { demoUser } from "@/services/mockData";
import arthicaLogo from "@/assets/arthica-logo.png";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.displayName || demoUser.displayName;
  const healthScore = demoUser.healthScore;

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("arthica:toggleSidebar"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={handleToggleSidebar}
      >
        <img src={arthicaLogo} alt="Arthica Logo" className="h-8 w-auto" />
        <h1 className="font-bold text-lg sm:text-xl">Arthica</h1>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions, budgets..." className="pl-10" />
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
              <div className="flex flex-col text-left">
                <span className="hidden md:inline text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">
                  Health: {healthScore}/100
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
