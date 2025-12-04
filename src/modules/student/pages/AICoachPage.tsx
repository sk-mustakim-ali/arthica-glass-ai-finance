import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIPersona } from '../types/student';

const personas: { id: AIPersona; name: string; emoji: string; description: string }[] = [
  { id: 'friendly-bro', name: 'Friendly Bro', emoji: '😎', description: 'Casual and supportive' },
  { id: 'strict-sister', name: 'Strict Sister', emoji: '😤', description: 'Tough love approach' },
  { id: 'zen-monk', name: 'Zen Monk', emoji: '🧘', description: 'Calm and mindful' },
  { id: 'finance-nerd', name: 'Finance Nerd', emoji: '🤓', description: 'Data-driven advice' },
  { id: 'sass-queen', name: 'Sass Queen', emoji: '💅', description: 'Sassy and fun' },
];

export const AICoachPage: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>('friendly-bro');
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">AI Coach 🤖</h1>
        <p className="text-muted-foreground">Your personal finance buddy</p>
      </div>

      {/* Persona Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {personas.map((persona) => (
          <Button
            key={persona.id}
            variant={selectedPersona === persona.id ? 'default' : 'outline'}
            onClick={() => setSelectedPersona(persona.id)}
            className="flex-shrink-0"
          >
            <span className="mr-2">{persona.emoji}</span>
            {persona.name}
          </Button>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="p-6 border-student-border min-h-[400px] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-student-primary/20 to-student-accent/20 flex items-center justify-center text-4xl mx-auto mb-4">
              {personas.find(p => p.id === selectedPersona)?.emoji}
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {personas.find(p => p.id === selectedPersona)?.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              AI Coach coming soon! 🚀
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-student-primary">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-border">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="flex-1"
          />
          <Button className="bg-student-primary hover:bg-student-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
