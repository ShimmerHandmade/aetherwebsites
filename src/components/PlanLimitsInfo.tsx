
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getUserPlanRestrictions, PlanRestriction, getUserPlanName } from "@/utils/planRestrictions";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PlanLimitsInfoProps {
  productCount?: number;
  pageCount?: number;
}

const PlanLimitsInfo: React.FC<PlanLimitsInfoProps> = ({ 
  productCount = 0, 
  pageCount = 0 
}) => {
  const [restrictions, setRestrictions] = useState<PlanRestriction | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlanInfo = async () => {
      try {
        const [userRestrictions, userPlan] = await Promise.all([
          getUserPlanRestrictions(),
          getUserPlanName()
        ]);
        
        setRestrictions(userRestrictions);
        setPlanName(userPlan);
      } catch (error) {
        console.error("Error loading plan information:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlanInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-md animate-pulse bg-gray-50">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!restrictions) {
    return null;
  }

  const productPercentage = (productCount / restrictions.maxProducts) * 100;
  const pagePercentage = (pageCount / restrictions.maxPages) * 100;

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-lg mb-2">
        {planName ? `${planName} Plan Limits` : 'Free Plan Limits'}
      </h3>
      
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
          <Progress value={productPercentage} className="h-2" />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">
              Pages: {pageCount} / {restrictions.maxPages}
            </span>
            <span className="text-xs font-medium">
              {Math.round(pagePercentage)}%
            </span>
          </div>
          <Progress value={pagePercentage} className="h-2" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-sm flex items-center">
            {restrictions.allowCoupons ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Coupon Codes
          </div>
          
          <div className="text-sm flex items-center">
            {restrictions.allowDiscounts ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Product Discounts
          </div>
          
          <div className="text-sm flex items-center">
            {restrictions.allowAdvancedAnalytics ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Advanced Analytics
          </div>
          
          <div className="text-sm flex items-center">
            {restrictions.allowCustomDomain ? 
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : 
              <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />}
            Custom Domain
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
