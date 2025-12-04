import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, Flame, Medal, Star, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useChallenges } from '../hooks/useStudent';
import { useToast } from '@/hooks/use-toast';

export const ChallengesPage: React.FC = () => {
  const { challenges } = useChallenges();
  const { toast } = useToast();
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['ch1']);

  const handleJoin = (challengeId: string) => {
    setJoinedChallenges(prev => [...prev, challengeId]);
    toast({ 
      title: 'Challenge joined! 🎯', 
      description: 'Good luck! You got this!' 
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-medium">#{rank}</span>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Challenges 🏆</h1>
        <p className="text-muted-foreground">Compete, save, and win rewards!</p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-student-border text-center">
          <Trophy className="w-6 h-6 text-student-warning mx-auto mb-2" />
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">Challenges Completed</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <Star className="w-6 h-6 text-student-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">450</p>
          <p className="text-xs text-muted-foreground">Points Earned</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <Flame className="w-6 h-6 text-student-error mx-auto mb-2" />
          <p className="text-2xl font-bold">7</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </Card>
        <Card className="p-4 border-student-border text-center">
          <Users className="w-6 h-6 text-student-accent mx-auto mb-2" />
          <p className="text-2xl font-bold">234</p>
          <p className="text-xs text-muted-foreground">Total Challengers</p>
        </Card>
      </div>

      {/* Challenge Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {challenges.map((challenge, index) => {
            const isJoined = joinedChallenges.includes(challenge.id);
            const userProgress = challenge.leaderboard.find(e => e.isCurrentUser);
            const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-student-border overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Challenge Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-student-primary/20 to-student-accent/20 flex items-center justify-center text-3xl">
                          {challenge.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{challenge.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {challenge.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              {challenge.participants} participants
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {daysLeft} days left
                            </span>
                            <span className="flex items-center gap-1 text-student-warning">
                              <Star className="w-4 h-4" />
                              {challenge.reward} points reward
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress (if joined) */}
                      {isJoined && userProgress && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Your Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {userProgress.progress}/{challenge.target} days
                            </span>
                          </div>
                          <Progress value={(userProgress.progress / challenge.target) * 100} className="h-3" />
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="mt-6">
                        {isJoined ? (
                          <Button variant="outline" className="w-full sm:w-auto">
                            View Progress
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleJoin(challenge.id)}
                            className="w-full sm:w-auto bg-student-primary hover:bg-student-primary/90"
                          >
                            Join Challenge 🎯
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Leaderboard */}
                    {challenge.leaderboard.length > 0 && (
                      <div className="lg:w-72 p-4 rounded-xl bg-muted/50">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-student-warning" />
                          Leaderboard
                        </h4>
                        <div className="space-y-2">
                          {challenge.leaderboard.slice(0, 5).map((entry) => (
                            <div
                              key={entry.rank}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                entry.isCurrentUser ? 'bg-student-primary/10 border border-student-primary/20' : ''
                              }`}
                            >
                              <div className="w-6 flex items-center justify-center">
                                {getRankIcon(entry.rank)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate ${entry.isCurrentUser ? 'font-semibold' : ''}`}>
                                  {entry.name} {entry.isCurrentUser && '(You)'}
                                </p>
                              </div>
                              <span className="text-sm font-medium">{entry.progress}/{challenge.target}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="upcoming">
          <Card className="p-12 border-student-border text-center">
            <p className="text-4xl mb-4">🔜</p>
            <h3 className="font-semibold mb-2">New Challenges Coming Soon!</h3>
            <p className="text-muted-foreground">Check back next week for exciting new challenges</p>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-6 border-student-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-student-success/20 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h3 className="font-semibold">No Swiggy Week</h3>
                <p className="text-sm text-student-success">Completed! +50 points earned</p>
                <p className="text-xs text-muted-foreground mt-1">Completed on Dec 1, 2024</p>
              </div>
              <Badge className="ml-auto bg-student-success">Winner</Badge>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
