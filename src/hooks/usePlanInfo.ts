
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
  const fetchingData = useRef(false);
  const authChecked = useRef(false);
  const initialLoadComplete = useRef(false);

  // Single useEffect to handle the entire data fetching flow
  useEffect(() => {
    const controller = new AbortController();
    
    const loadPlanInfo = async () => {
      // Prevent concurrent fetches and avoid refetching if already loaded
      if (fetchingData.current || initialLoadComplete.current) return;
      fetchingData.current = true;
      
      try {
        // Step 1: Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("usePlanInfo: User not authenticated");
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

        authChecked.current = true;
        
        // Step 2: Get user's plan
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
        
        // Step 3: Get plan restrictions
        const restrictions = await getUserPlanRestrictions();
        
        if (planData) {
          const isPremium = planData.name === "Professional" || planData.name === "Enterprise";
          const isEnterprise = planData.name === "Enterprise";
          
          if (isMounted.current && !controller.signal.aborted) {
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
          if (isMounted.current && !controller.signal.aborted) {
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
        if (isMounted.current && !controller.signal.aborted) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load subscription information"
          }));
        }
        initialLoadComplete.current = true;
      } finally {
        fetchingData.current = false;
      }
    };

    loadPlanInfo();
    
    return () => {
      isMounted.current = false;
      controller.abort();
    };
  }, []); // Only run on mount, no dependencies

  return planInfo;
};
