
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { usePlan } from "@/contexts/PlanContext";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanLimitsInfoProps {
  productCount?: number;
  websiteCount?: number; // Changed from pageCount to websiteCount
}

const PlanLimitsInfo: React.FC<PlanLimitsInfoProps> = ({ 
  productCount = 0, 
  websiteCount = 0 // Changed from pageCount to websiteCount
}) => {
  const { planName, restrictions, loading, error, isPremium, isEnterprise } = usePlan();

  if (loading) {
    return (
      <div className="p-4 border rounded-md bg-gray-50 flex items-center justify-center h-40">
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Loading plan information...</p>
        </div>
      </div>
    );
  }

  if (error || !restrictions) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
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
  const websitePercentage = (websiteCount / restrictions.maxWebsites) * 100; // Changed from maxPages to maxWebsites

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-lg">
          {planName ? `${planName} Plan` : 'Free Plan'}
        </h3>
        {isPremium && (
          <Badge variant={isEnterprise ? "default" : "secondary"} className={isEnterprise ? "bg-indigo-600" : ""}>
            {isEnterprise ? "Enterprise" : "Premium"}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">
              Products: {productCount} / {restrictions.maxProducts}
            </span>
            <span className="text-xs font-medium">
              {Math.round(productPercentage)}%
            </span>
          </div>
          <Progress 
            value={productPercentage} 
            className={cn("h-2", productPercentage > 80 ? "bg-amber-100" : "")}
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">
              Websites: {websiteCount} / {restrictions.maxWebsites}
            </span>
            <span className="text-xs font-medium">
              {Math.round(websitePercentage)}%
            </span>
          </div>
          <Progress 
            value={websitePercentage}
            className={cn("h-2", websitePercentage > 80 ? "bg-amber-100" : "")}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex items-center">
            {restrictions.allowCoupons ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Coupon Codes
          </div>
          
          <div className="flex items-center">
            {restrictions.allowDiscounts ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Product Discounts
          </div>
          
          <div className="flex items-center">
            {restrictions.allowAdvancedAnalytics ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Analytics
          </div>
          
          <div className="flex items-center">
            {restrictions.allowCustomDomain ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Custom Domain
          </div>
          
          <div className="flex items-center">
            {restrictions.allowPremiumTemplates ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Premium Templates
          </div>
          
          <div className="flex items-center">
            {restrictions.allowPremiumElements ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Premium Elements
          </div>
        </div>

        {!planName && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No active plan</AlertTitle>
            <AlertDescription>
              Subscribe to a plan to unlock more features and increase your limits.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default PlanLimitsInfo;
