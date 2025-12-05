import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  Lightbulb,
  Trophy,
  CreditCard,
  Bot,
  Settings,
  Sparkles,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudentProfile } from '../hooks/useStudent';
import arthicaLogo from '@/assets/arthica-logo.png';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  emoji?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '', emoji: '🏠' },
  { icon: Receipt, label: 'Transactions', path: 'transactions', emoji: '💸' },
  { icon: PiggyBank, label: 'Budgets', path: 'budgets', emoji: '🐷' },
  { icon: Target, label: 'Goals', path: 'goals', emoji: '🎯' },
  { icon: Lightbulb, label: 'Insights', path: 'insights', emoji: '💡' },
  { icon: Trophy, label: 'Challenges', path: 'challenges', emoji: '🏆' },
  { icon: CreditCard, label: 'Subscriptions', path: 'subscriptions', emoji: '📱' },
  { icon: Bot, label: 'AI Coach', path: 'ai-coach', emoji: '🤖' },
  { icon: Settings, label: 'Settings', path: 'settings', emoji: '⚙️' },
];

export const StudentSidebar: React.FC = () => {
  const location = useLocation();
  const { profile } = useStudentProfile();
  const basePath = '/student/dashboard';
  const [isOpen, setIsOpen] = useState(false);

  // Listen for header toggle event (logo click)
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener('arthica:toggleSidebar', handler as EventListener);
    return () => {
      window.removeEventListener('arthica:toggleSidebar', handler as EventListener);
    };
  }, []);

  // Close sidebar on navigation
  const handleNavigate = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-student-sidebar to-student-sidebar-dark border-r border-student-border shadow-lg z-40 flex flex-col"
          >
            {/* Logo Header */}
            <div className="flex items-center justify-center py-6 border-b border-student-border/50">
              <img src={arthicaLogo} alt="Arthica Logo" className="w-10 h-10 mr-2" />
              <h1 className="text-2xl font-bold gradient-text">Arthica</h1>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-b border-student-border/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-student-primary to-student-accent flex items-center justify-center text-xl">
                    {profile?.displayName?.charAt(0) || '🎓'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-student-success flex items-center justify-center">
                    <Flame className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{profile?.displayName || 'Student'}</p>
                  <div className="flex items-center gap-1 text-xs text-student-primary">
                    <Sparkles className="w-3 h-3" />
                    <span>Level {profile?.level || 1}</span>
                    <span className="text-muted-foreground">• {profile?.points || 0} pts</span>
                  </div>
                </div>
              </div>

              {/* Streak Display */}
              <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-student-primary/10">
                <Flame className="w-4 h-4 text-student-warning" />
                <span className="text-sm font-medium text-foreground">{profile?.streaks?.logging || 0} day streak</span>
                <span className="text-xs text-muted-foreground">🔥</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path ? `${basePath}/${item.path}` : basePath}
                  end={item.path === ''}
                  onClick={handleNavigate}
                  className={({ isActive: active }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-student-primary to-student-accent text-white shadow-lg shadow-student-primary/25'
                        : 'text-muted-foreground hover:bg-student-muted hover:text-foreground'
                    )
                  }
                >
                  {({ isActive: active }) => (
                    <>
                      <span className="text-lg">{item.emoji}</span>
                      <span>{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 rounded-full bg-white"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Section - Points Summary */}
            <div className="p-4 border-t border-student-border/50">
              <div className="p-3 rounded-xl bg-gradient-to-r from-student-primary/20 to-student-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Next Reward</span>
                  <span className="text-xs text-student-primary">{500 - ((profile?.points || 0) % 500)} pts</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-student-primary to-student-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${((profile?.points || 0) % 500) / 5}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
