import { Home, Receipt, Wallet, CreditCard, Brain, User, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import arthicaLogo from "@/assets/arthica-logo.png";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/dashboard/transactions", icon: Receipt },
  { title: "Budgets", url: "/dashboard/budgets", icon: Wallet },
  { title: "Liabilities", url: "/dashboard/liabilities", icon: CreditCard },
  { title: "AI Advisor", url: "/dashboard/advisor", icon: Brain },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/dashboard">
              <img src={arthicaLogo} alt="Arthica" className="h-8" />
            </Link>
          )}
          <SidebarTrigger>
            <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </SidebarTrigger>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 ${
                        location.pathname === item.url
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
