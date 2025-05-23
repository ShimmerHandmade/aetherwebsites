
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { usePlan } from "@/contexts/PlanContext";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PlanLimitsInfoProps {
  productCount?: number;
  websiteCount?: number;
}

const PlanLimitsInfo: React.FC<PlanLimitsInfoProps> = ({ 
  productCount = 0, 
  websiteCount = 0
}) => {
  const { planName, restrictions, loading, error, isPremium, isEnterprise } = usePlan();

  if (loading) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-soft flex items-center justify-center h-40">
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 text-brand-600 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Loading plan information...</p>
        </div>
      </div>
    );
  }

  if (error || !restrictions) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-soft">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Failed to load plan information. Please try refreshing the page."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const productPercentage = (productCount / restrictions.maxProducts) * 100;
  const websitePercentage = (websiteCount / restrictions.maxWebsites) * 100;

  return (
    <div className="bg-white p-6 rounded-lg border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          {planName ? `${planName} Plan` : 'Free Plan'}
        </h3>
        {isPremium && (
          <Badge variant={isEnterprise ? "default" : "secondary"} className={cn("ml-2", isEnterprise ? "bg-indigo-600" : "")}>
            {isEnterprise ? "Enterprise" : "Premium"}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Products: {productCount} / {restrictions.maxProducts}
            </span>
            <span className="text-xs font-semibold">
              {Math.round(productPercentage)}%
            </span>
          </div>
          <Progress 
            value={productPercentage} 
            className={cn(
              "h-2 rounded-full", 
              productPercentage > 80 
                ? "bg-amber-100" 
                : productPercentage > 95 
                  ? "bg-red-100" 
                  : "bg-gray-100"
            )}
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Websites: {websiteCount} / {restrictions.maxWebsites}
            </span>
            <span className="text-xs font-semibold">
              {Math.round(websitePercentage)}%
            </span>
          </div>
          <Progress 
            value={websitePercentage}
            className={cn(
              "h-2 rounded-full", 
              websitePercentage > 80 
                ? "bg-amber-100" 
                : websitePercentage > 95 
                  ? "bg-red-100" 
                  : "bg-gray-100"
            )}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
          <Feature 
            name="Custom Domain" 
            enabled={restrictions.hasCustomDomain} 
            premium={false}
          />
          <Feature 
            name="Coupon Codes" 
            enabled={restrictions.hasAllowCoupons} 
            premium={true}
          />
          <Feature 
            name="Product Discounts" 
            enabled={restrictions.hasAllowDiscounts} 
            premium={true}
          />
          <Feature 
            name="Advanced Analytics" 
            enabled={restrictions.hasAdvancedAnalytics} 
            premium={true}
          />
          <Feature 
            name="Premium Templates" 
            enabled={restrictions.hasAllowPremiumTemplates} 
            premium={true}
          />
          <Feature 
            name="Premium Elements" 
            enabled={restrictions.hasAllowPremiumElements} 
            premium={true}
          />
        </div>

        {!planName && (
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-700 mb-2">Upgrade to unlock more features</h4>
            <p className="text-xs text-indigo-600 mb-4">Get access to premium features and increase your limits.</p>
            <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              View Plans
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface FeatureProps {
  name: string;
  enabled: boolean;
  premium: boolean;
}

const Feature: React.FC<FeatureProps> = ({ name, enabled, premium }) => (
  <div className="flex items-center">
    {enabled ? (
      <CheckCircle2 className={`h-4 w-4 ${premium ? 'text-indigo-500' : 'text-green-500'} mr-2`} />
    ) : (
      <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
    )}
    <span className={enabled ? 'text-gray-800' : 'text-gray-500'}>
      {name}
      {premium && !enabled && <span className="text-xs ml-1 text-gray-400">(Premium)</span>}
    </span>
  </div>
);

export default PlanLimitsInfo;
