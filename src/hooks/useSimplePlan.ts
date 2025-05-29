
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";

export interface SimplePlanInfo {
  restrictions: PlanRestriction;
  loading: boolean;
  error: string | null;
}

export const useSimplePlan = () => {
  const [planInfo, setPlanInfo] = useState<SimplePlanInfo>({
    restrictions: {
      maxProducts: 15,
      maxWebsites: 1,
      allowCoupons: false,
      allowDiscounts: false,
      allowAdvancedAnalytics: false,
      allowCustomDomain: false,
      allowPremiumTemplates: false,
      allowPremiumElements: false,
      allowPremiumAnimations: false,
      allowedThemes: ["business", "blog", "ecommerce", "fashion", "electronics", "food"]
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const loadPlan = async () => {
      try {
        const restrictions = await getUserPlanRestrictions();
        
        if (mounted) {
          setPlanInfo({
            restrictions,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error("Error loading plan:", error);
        if (mounted) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load plan"
          }));
        }
      }
    };

    loadPlan();

    return () => {
      mounted = false;
    };
  }, []);

  return planInfo;
};
