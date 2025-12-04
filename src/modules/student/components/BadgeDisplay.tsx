import React from 'react';
import { motion } from 'framer-motion';
import { Badge as BadgeType } from '../types/student';

interface BadgeDisplayProps {
  badges: BadgeType[];
  size?: 'sm' | 'md' | 'lg';
  maxShow?: number;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityGlow = {
  common: 'shadow-gray-400/30',
  rare: 'shadow-blue-400/30',
  epic: 'shadow-purple-400/30',
  legendary: 'shadow-yellow-400/30',
};

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, size = 'md', maxShow = 5 }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const displayBadges = badges.slice(0, maxShow);
  const remaining = badges.length - maxShow;

  return (
    <div className="flex items-center gap-2">
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          className={`${sizes[size]} rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center shadow-lg ${rarityGlow[badge.rarity]} cursor-pointer`}
          title={`${badge.name}: ${badge.description}`}
        >
          <span>{badge.icon}</span>
        </motion.div>
      ))}
      {remaining > 0 && (
        <div className={`${sizes[size]} rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

// Single badge card for detailed view
export const BadgeCard: React.FC<{ badge: BadgeType }> = ({ badge }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} bg-opacity-10 border border-${badge.rarity === 'legendary' ? 'yellow' : badge.rarity === 'epic' ? 'purple' : 'blue'}-500/20`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-2xl shadow-lg ${rarityGlow[badge.rarity]}`}>
          {badge.icon}
        </div>
        <div>
          <h4 className="font-semibold">{badge.name}</h4>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
