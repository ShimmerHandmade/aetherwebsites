
import { useState, useEffect, useRef } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";
import { supabase } from "@/integrations/supabase/client";
import { getUserPlan } from "@/api/websites/getUserPlan";

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
  const isLoadingData = useRef(false);
  const initialLoadComplete = useRef(false);

  // Single useEffect to handle data loading
  useEffect(() => {
    const loadPlanInfo = async () => {
      // Prevent concurrent loading or reloading after initial load
      if (isLoadingData.current || initialLoadComplete.current) return;
      
      isLoadingData.current = true;
      
      try {
        // Check for authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (isMounted.current) {
            setPlanInfo(prev => ({
              ...prev,
              loading: false,
              error: "Not authenticated"
            }));
          }
          initialLoadComplete.current = true;
          return;
        }
        
        // Get user's plan
        const { data: planData, error: planError } = await getUserPlan();
        
        if (planError) {
          console.error("Error fetching plan information:", planError);
          if (isMounted.current) {
            setPlanInfo(prev => ({
              ...prev,
              loading: false,
              error: planError
            }));
          }
          initialLoadComplete.current = true;
          return;
        }
        
        // Get plan restrictions
        const restrictions = await getUserPlanRestrictions();
        
        if (planData) {
          const isPremium = planData.name === "Professional" || planData.name === "Enterprise";
          const isEnterprise = planData.name === "Enterprise";
          
          if (isMounted.current) {
            setPlanInfo({
              planName: planData.name,
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
        }
        initialLoadComplete.current = true;
      } finally {
        isLoadingData.current = false;
      }
    };

    loadPlanInfo();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Only run on mount

  return planInfo;
};
