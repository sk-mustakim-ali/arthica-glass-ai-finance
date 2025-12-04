import React from 'react';
import { motion } from 'framer-motion';
import { Palette, User, Bell, Shield, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useStudentProfile } from '../hooks/useStudent';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { ThemeStyle } from '../types/student';

const themes: { id: ThemeStyle; name: string; colors: string[] }[] = [
  { id: 'neon', name: 'Neon', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB5E8', '#B5DEFF', '#E7FFAC'] },
  { id: 'dark', name: 'Dark', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
  { id: 'anime', name: 'Anime', colors: ['#FF61D2', '#FE9090', '#BF66FF'] },
  { id: 'vaporwave', name: 'Vaporwave', colors: ['#FF71CE', '#01CDFE', '#05FFA1'] },
];

export const SettingsPage: React.FC = () => {
  const { profile } = useStudentProfile();

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

      {/* Themes */}
      <Card className="p-6 border-student-border">
        <div className="flex items-center gap-4 mb-6">
          <Palette className="w-5 h-5 text-student-primary" />
          <h3 className="font-semibold">Themes</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                profile?.theme === theme.id ? 'border-student-primary' : 'border-transparent bg-muted'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {theme.colors.map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <p className="text-sm font-medium">{theme.name}</p>
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
