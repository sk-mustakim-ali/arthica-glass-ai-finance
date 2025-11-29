import { useState, useEffect, useContext } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { getUserProfile, getUserHealthScore } from "@/services/queryWrappers"; // ✅ new import
import arthicaLogo from "@/assets/arthica-logo.png"; // ✅ Logo import

export function DashboardHeader() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const [profile, setProfile] = useState<{
    displayName?: string;
    avatarUrl?: string | null;
    healthScore?: number | null;
  }>({
    displayName: "",
    avatarUrl: null,
    healthScore: null,
  });

  // ✅ Fetch user profile + health score via wrapper
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, score] = await Promise.all([
          getUserProfile(),
          getUserHealthScore(),
        ]);

        if (profileData) {
          setProfile({
            displayName:
              profileData.displayName ||
              user?.displayName ||
              user?.email?.split("@")[0] ||
              "User",
            avatarUrl: profileData.avatarUrl || null,
            healthScore: score,
          });
        } else {
          setProfile({
            displayName:
              user?.displayName || user?.email?.split("@")[0] || "User",
            avatarUrl: null,
            healthScore: score,
          });
        }
      } catch (err) {
        console.error("Error fetching profile via wrapper:", err);
      }
    };

    if (user) fetchProfileData();
  }, [user]);

  const displayName = loading
    ? "Loading..."
    : profile.displayName || user?.displayName || user?.email?.split("@")[0] || "User";

  // ✅ Sidebar toggle dispatcher
  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("arthica:toggleSidebar"));
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card">
      {/* ✅ Logo — triggers sidebar toggle */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={handleToggleSidebar}
      >
        <img src={arthicaLogo} alt="Arthica Logo" className="h-8 w-auto" />
        <h1 className="font-bold text-lg sm:text-xl">Arthica</h1>
      </div>

      {/* 🔍 Search Bar */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions, budgets..." className="pl-10 glass-button" />
        </div>
      </div>

      {/* 🔔 Notifications + Profile */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt="User Avatar" />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {displayName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="hidden md:inline text-sm font-medium">{displayName}</span>
                {profile.healthScore !== null && (
                  <span className="text-xs text-muted-foreground">
                    Health: {profile.healthScore}/100
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 glass-card">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
