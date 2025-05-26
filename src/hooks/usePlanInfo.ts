
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";
import { getUserPlanSimplified } from "@/api/websites/getUserPlanSimplified";

export interface PlanInfo {
  planName: string | null;
  restrictions: PlanRestriction | null;
  loading: boolean;
  error: string | null;
  isPremium: boolean;
  isEnterprise: boolean;
}

export const usePlanInfo = () => {
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    planName: null,
    restrictions: null,
    loading: true,
    error: null,
    isPremium: false,
    isEnterprise: false
  });

  useEffect(() => {
    let isMounted = true;

    const loadPlanInfo = async () => {
      try {
        console.log("Loading plan info...");
        
        const [restrictions, planData] = await Promise.all([
          getUserPlanRestrictions(),
          getUserPlanSimplified()
        ]);
        
        if (!isMounted) return;

        const isPremium = planData?.planName === "Professional" || planData?.planName === "Enterprise";
        const isEnterprise = planData?.planName === "Enterprise";
        
        console.log("Plan data loaded:", {
          planName: planData?.planName,
          isPremium,
          isEnterprise,
          isActive: planData?.isActive
        });
        
        setPlanInfo({
          planName: planData?.planName || null,
          restrictions,
          loading: false,
          error: null,
          isPremium,
          isEnterprise
        });
      } catch (error) {
        console.error("Error in usePlanInfo:", error);
        if (isMounted) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load subscription information"
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
