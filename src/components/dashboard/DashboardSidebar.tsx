import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Receipt, Wallet, CreditCard, Brain, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import arthicaLogo from "@/assets/arthica-logo.png";

export const DashboardSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Listen for header toggle event (logo click)
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener("arthica:toggleSidebar", handler as EventListener);
    return () => {
      window.removeEventListener("arthica:toggleSidebar", handler as EventListener);
    };
  }, []);

  // 🔹 Handle navigation click (close sidebar)
  const handleNavigate = () => setIsOpen(false);

  // 🔹 Links
  const links = [
    { to: "/dashboard", label: "Overview", icon: Home },
    { to: "/transactions", label: "Transactions", icon: Receipt },
    { to: "/budget", label: "Budget", icon: Wallet },
    { to: "/liabilities", label: "Liabilities", icon: CreditCard },
    { to: "/ai-advisor", label: "AI Advisor", icon: Brain },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🔹 Blur Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* 🔹 Sidebar Panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-72 border-r bg-background/90 backdrop-blur-lg shadow-lg z-40"
          >
            <div className="flex items-center justify-center py-6 border-b">
              <img src={arthicaLogo} alt="Arthica Logo" className="w-10 h-10 mr-2" />
              <h1 className="text-2xl font-bold gradient-text">Arthica</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {links.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleNavigate}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
