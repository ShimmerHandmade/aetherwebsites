
import React from 'react';
import { usePlan } from '@/contexts/PlanContext';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanStatusBadgeProps {
  className?: string;
  showIcon?: boolean;
}

const PlanStatusBadge: React.FC<PlanStatusBadgeProps> = ({ 
  className,
  showIcon = true
}) => {
  const { planName, loading, isPremium, isEnterprise } = usePlan();
  
  if (loading) {
    return (
      <Badge 
        variant="outline" 
        className={cn("bg-gray-100 text-gray-600", className)}
      >
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Loading...
      </Badge>
    );
  }
  
  // If there's no plan name, it's the free plan
  if (!planName) {
    return (
      <Badge 
        variant="outline" 
        className={cn("bg-gray-100 text-gray-600", className)}
      >
        Free Plan
      </Badge>
    );
  }
  
  // Determine badge appearance based on plan
  if (isEnterprise) {
    return (
      <Badge 
        className={cn("bg-gradient-to-r from-purple-600 to-indigo-600", className)}
      >
        {showIcon && <span className="mr-1">✦</span>}
        Enterprise
      </Badge>
    );
  }
  
  if (isPremium) {
    return (
      <Badge 
        variant="secondary" 
        className={cn("bg-indigo-100 text-indigo-700", className)}
      >
        {showIcon && <span className="mr-1">★</span>}
        Professional
      </Badge>
    );
  }
  
  // For Basic plan or any other non-premium plans
  return (
    <Badge 
      variant="outline" 
      className={cn("bg-blue-50 text-blue-700", className)}
    >
      {showIcon && <span className="mr-1">•</span>}
      {planName}
    </Badge>
  );
};

export default PlanStatusBadge;
