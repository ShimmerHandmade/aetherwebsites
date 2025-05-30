
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
      allowedThemes: [
        "business",
        "blog", 
        "ecommerce",
        "fashion",
        "electronics", 
        "food"
      ]
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const loadPlanInfo = async () => {
      try {
        console.log("🔄 Loading plan restrictions...");
        const restrictions = await getUserPlanRestrictions();
        
        if (isMounted) {
          setPlanInfo({
            restrictions,
            loading: false,
            error: null
          });
          console.log("✅ Plan restrictions loaded:", restrictions);
        }
      } catch (error) {
        console.error("❌ Error loading plan info:", error);
        if (isMounted) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load plan information"
          }));
        }
      }
    };

    loadPlanInfo();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return planInfo;
};
