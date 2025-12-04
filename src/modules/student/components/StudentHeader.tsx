import React from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudentProfile, useVibeMessage } from '../hooks/useStudent';
import arthicaLogo from '@/assets/arthica-logo.png';

export const StudentHeader: React.FC = () => {
  const { profile } = useStudentProfile();
  const vibeMessage = useVibeMessage();

  return (
    <header className="h-16 border-b border-student-border bg-card/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <img src={arthicaLogo} alt="Arthica" className="h-8" />
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-student-primary/10 to-student-accent/10 border border-student-primary/20">
          <Sparkles className="w-4 h-4 text-student-primary" />
          <span className="text-sm text-muted-foreground">{vibeMessage}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-9 w-64 bg-muted/50 border-student-border focus:border-student-primary"
          />
        </div>

        {/* Points Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-student-warning/10 border border-student-warning/20">
          <span className="text-lg">⭐</span>
          <span className="font-semibold text-student-warning">{profile?.points || 0}</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-student-error rounded-full" />
        </Button>
      </div>
    </header>
  );
};
