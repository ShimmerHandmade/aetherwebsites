
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/general';

interface PlanStatusBadgeProps {
  profile: Profile | null;
}

const PlanStatusBadge = ({ profile }: PlanStatusBadgeProps) => {
  if (!profile) {
    return (
      <Badge variant="outline" className="text-gray-500 bg-gray-100">
        No plan data
      </Badge>
    );
  }

  if (!profile.is_subscribed) {
    return (
      <Badge variant="outline" className="text-gray-500 bg-gray-100">
        Free Plan
      </Badge>
    );
  }

  switch (profile.subscription_type?.toLowerCase()) {
    case 'pro':
      return (
        <Badge className="bg-indigo-500 hover:bg-indigo-600">
          Professional Plan
        </Badge>
      );
    case 'basic':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          Basic Plan
        </Badge>
      );
    case 'enterprise':
      return (
        <Badge className="bg-purple-500 hover:bg-purple-600">
          Enterprise Plan
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-gray-500 bg-gray-100">
          {profile.subscription_type || 'Unknown Plan'}
        </Badge>
      );
  }
};

export default PlanStatusBadge;
