
import React from "react";
import { usePlan } from "@/contexts/PlanContext";
import { Shield, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PlanCheckProps {
  children: React.ReactNode;
  featureName: string;
  requiresEnterprise?: boolean;
}

const PlanCheck: React.FC<PlanCheckProps> = ({
  children,
  featureName,
  requiresEnterprise = false,
}) => {
  const { isPremium, isEnterprise, loading, planName } = usePlan();
  
  // Determine if user can access this feature
  const canAccess = 
    (requiresEnterprise && isEnterprise) || 
    (!requiresEnterprise && (isPremium || isEnterprise));
  
  // Handle "upgrade" button click
  const handleUpgrade = () => {
    toast.info("Upgrade your plan", {
      description: `This ${requiresEnterprise ? 'Enterprise' : 'Premium'} feature requires a plan upgrade.`
    });
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading plan information...</div>;
  }
  
  if (canAccess) {
    return (
      <div className="relative">
        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
          <CheckCircle className="h-3 w-3" />
          <span>Available with {planName || "your plan"}</span>
        </div>
        {children}
      </div>
    );
  }
  
  return (
    <div className="relative border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/40 flex flex-col items-center justify-center p-4 z-10">
        <div className="flex items-center gap-2 mb-2 text-indigo-700">
          {requiresEnterprise ? (
            <Shield className="h-5 w-5" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
          <h3 className="font-bold">{requiresEnterprise ? 'Enterprise' : 'Premium'} Feature</h3>
        </div>
        <p className="mb-4 text-center text-gray-700">
          {featureName} requires a {requiresEnterprise ? 'Enterprise' : 'Professional or Enterprise'} plan
        </p>
        <Button onClick={handleUpgrade}>
          Upgrade Your Plan
        </Button>
      </div>
      
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default PlanCheck;
