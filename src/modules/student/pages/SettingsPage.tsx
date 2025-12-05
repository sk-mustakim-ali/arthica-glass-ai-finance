import React from 'react';
import { motion } from 'framer-motion';
import { Palette, User, Bell, Shield, Award, Moon, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useStudentProfile } from '../hooks/useStudent';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { ThemeStyle } from '../types/student';
import { useTheme } from 'next-themes';

const themes: { id: ThemeStyle; name: string; colors: string[] }[] = [
  { id: 'neon', name: 'Neon', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB5E8', '#B5DEFF', '#E7FFAC'] },
  { id: 'dark', name: 'Dark', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
  { id: 'anime', name: 'Anime', colors: ['#FF61D2', '#FE9090', '#BF66FF'] },
  { id: 'vaporwave', name: 'Vaporwave', colors: ['#FF71CE', '#01CDFE', '#05FFA1'] },
];

export const SettingsPage: React.FC = () => {
  const { profile } = useStudentProfile();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings ⚙️</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* Profile */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <User className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-student-primary to-student-accent flex items-center justify-center text-3xl text-white">
            {profile?.displayName?.charAt(0) || '🎓'}
          </div>
          <div>
            <p className="font-semibold text-lg">{profile?.displayName || 'Student'}</p>
            <p className="text-muted-foreground">Level {profile?.level || 1} • {profile?.points || 0} points</p>
          </div>
        </div>
      </Card>

      {/* Dark Mode Toggle */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <Palette className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        
        {/* Light/Dark Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-6">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-student-primary" />
            ) : (
              <Sun className="w-5 h-5 text-student-warning" />
            )}
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
          </div>
          <Switch 
            checked={theme === 'dark'} 
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>

        {/* Color Themes (Visual only for now) */}
        <p className="text-sm text-muted-foreground mb-4">Color Themes (Coming Soon)</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themes.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                t.id === 'dark' && theme === 'dark' ? 'border-student-primary' : 'border-transparent bg-muted'
              }`}
              onClick={() => t.id === 'dark' && setTheme('dark')}
            >
              <div className="flex gap-1 mb-2">
                {t.colors.map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <p className="text-sm font-medium">{t.name}</p>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <Award className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Your Badges</h3>
        </div>
        <BadgeDisplay badges={profile?.badges || []} size="lg" maxShow={10} />
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <Bell className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          {['Daily spending alerts', 'Budget warnings', 'Challenge updates', 'Goal milestones'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span>{item}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Privacy</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show on leaderboards</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Anonymous peer comparison</span>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
};
