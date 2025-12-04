import React from 'react';
import { motion } from 'framer-motion';

interface SpendingRingProps {
  spent: number;
  budget: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  emoji?: string;
}

export const SpendingRing: React.FC<SpendingRingProps> = ({
  spent,
  budget,
  size = 120,
  strokeWidth = 12,
  label,
  emoji,
}) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 100) return 'hsl(var(--student-error))';
    if (percentage >= 80) return 'hsl(var(--student-warning))';
    return 'hsl(var(--student-success))';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {emoji && <span className="text-2xl mb-1">{emoji}</span>}
        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
};

// Mini ring for category budgets
export const MiniSpendingRing: React.FC<{
  spent: number;
  budget: number;
  emoji: string;
  name: string;
  color: string;
}> = ({ spent, budget, emoji, name, color }) => {
  const percentage = Math.min((spent / budget) * 100, 100);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {emoji}
        </div>
        {/* Progress indicator */}
        <svg className="absolute inset-0 w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={percentage >= 100 ? 'hsl(var(--student-error))' : color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.26} 126`}
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">
          ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
        </p>
      </div>
      <span className={`text-sm font-semibold ${percentage >= 100 ? 'text-student-error' : 'text-student-success'}`}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
};
