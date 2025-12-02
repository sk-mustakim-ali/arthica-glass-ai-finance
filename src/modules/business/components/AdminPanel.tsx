import { useState } from 'react';
import { Company, CompanyMember } from '../types/business';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { updateMemberRole } from '../services/companyService';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Eye, UserCog } from 'lucide-react';

interface AdminPanelProps {
  company: Company;
  onUpdate?: () => void;
}

const roleIcons = {
  owner: Shield,
  admin: UserCog,
  accountant: User,
  viewer: Eye,
};

const roleColors = {
  owner: 'bg-purple-500',
  admin: 'bg-blue-500',
  accountant: 'bg-green-500',
  viewer: 'bg-gray-500',
};

export function AdminPanel({ company, onUpdate }: AdminPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const isOwner = company.members.some(
    (m) => m.uid === user?.uid && m.role === 'owner'
  );

  const handleRoleChange = async (memberId: string, newRole: CompanyMember['role']) => {
    if (!isOwner) {
      toast({
        title: 'Permission denied',
        description: 'Only owner can change member roles',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(memberId);
      await updateMemberRole(company.id, memberId, newRole);
      toast({
        title: 'Role updated',
        description: 'Member role has been updated successfully',
      });
      onUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage team members and their roles
          {!isOwner && ' (View only - Owner access required)'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {company.members.map((member) => {
            const RoleIcon = roleIcons[member.role];
            const isCurrentUser = member.uid === user?.uid;

            return (
              <div
                key={member.uid}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${roleColors[member.role]}`}>
                    <RoleIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.displayName || member.email || member.uid}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2">
                          You
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined {member.joinedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner && !isCurrentUser ? (
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleRoleChange(member.uid, value as CompanyMember['role'])
                      }
                      disabled={updating === member.uid}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="capitalize">
                      {member.role}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {company.members.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No members yet
          </p>
        )}

        {/* TODO: Add invite member functionality in Phase-2 */}
        {isOwner && (
          <Button variant="outline" className="w-full mt-4" disabled>
            Invite Member (Coming Soon)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
