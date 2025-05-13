
import { useState, useEffect, useRef } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";
import { getUserPlanSimplified } from "@/api/websites/getUserPlanSimplified";
import { toast } from "sonner";

export interface PlanInfo {
  planName: string | null;
  restrictions: PlanRestriction | null;
  loading: boolean;
  error: string | null;
  isPremium: boolean; // Professional or Enterprise plan
  isEnterprise: boolean;
}

/**
 * Custom hook to provide plan information throughout the application
 */
export const usePlanInfo = () => {
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    planName: null,
    restrictions: null,
    loading: true,
    error: null,
    isPremium: false,
    isEnterprise: false
  });
  
  const isMounted = useRef(true);
  const initialLoadComplete = useRef(false);

  // Single useEffect to handle data loading
  useEffect(() => {
    const loadPlanInfo = async () => {
      // Prevent reloading after initial load
      if (initialLoadComplete.current) return;
      
      try {
        // Use the simplified plan info function which avoids the database join issue
        const planData = await getUserPlanSimplified();
        
        // Get plan restrictions
        const restrictions = await getUserPlanRestrictions();
        
        if (planData && planData.isActive) {
          const isPremium = planData.planName === "Professional" || planData.planName === "Enterprise";
          const isEnterprise = planData.planName === "Enterprise";
          
          if (isMounted.current) {
            setPlanInfo({
              planName: planData.planName,
              restrictions,
              loading: false,
              error: null,
              isPremium,
              isEnterprise
            });
          }
        } else {
          if (isMounted.current) {
            setPlanInfo({
              planName: null,
              restrictions,
              loading: false,
              error: null,
              isPremium: false,
              isEnterprise: false
            });
          }
        }
        
        initialLoadComplete.current = true;
      } catch (error) {
        console.error("Error in usePlanInfo:", error);
        if (isMounted.current) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load subscription information"
          }));
          
          toast.error("Failed to load plan information. Please try again later.");
        }
        initialLoadComplete.current = true;
      }
    };

    loadPlanInfo();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Only run on mount

  return planInfo;
};
