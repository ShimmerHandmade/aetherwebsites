
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

  // Clean up the useEffect to improve loading stability
  useEffect(() => {
    const loadPlanInfo = async () => {
      // Prevent reloading if already completed
      if (initialLoadComplete.current) return;
      
      try {
        console.log("Loading plan info...");
        
        // Load restrictions and plan data in parallel
        const [restrictions, planData] = await Promise.all([
          getUserPlanRestrictions().catch(() => null),
          getUserPlanSimplified().catch(() => ({ planName: null, subscriptionEnd: null, isActive: false }))
        ]);
        
        if (planData && planData.isActive) {
          const isPremium = planData.planName === "Professional" || planData.planName === "Enterprise";
          const isEnterprise = planData.planName === "Enterprise";
          
          console.log("Plan data loaded successfully:", {
            planName: planData.planName,
            isPremium,
            isEnterprise
          });
          
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
          console.log("No active plan found, using default values");
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
