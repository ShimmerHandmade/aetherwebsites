
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction, getUserPlanName } from "@/utils/planRestrictions";
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
  const [authChecked, setAuthChecked] = useState(false);

  // First check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("usePlanInfo: User not authenticated");
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Not authenticated"
          }));
        }
        
        setAuthChecked(!!user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthChecked(true); // Set to true to allow next effect to run
        setPlanInfo(prev => ({
          ...prev,
          loading: false,
          error: "Authentication check failed"
        }));
      }
    };
    
    checkAuth();
  }, []);

  // Then fetch plan information if authenticated - using the direct API call
  useEffect(() => {
    if (!authChecked) return;
    
    const fetchPlanInfo = async () => {
      try {
        // Use the getUserPlan API instead of direct database queries
        const { data: planData, error: planError } = await getUserPlan();
        
        if (planError) {
          console.error("Error fetching plan information:", planError);
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: planError
          }));
          return;
        }
        
        // Get restrictions regardless of plan status
        const restrictions = await getUserPlanRestrictions();
        
        // Determine plan status based on the API response
        if (planData) {
          const isPremium = planData.name === "Professional" || planData.name === "Enterprise";
          const isEnterprise = planData.name === "Enterprise";
          
          setPlanInfo({
            planName: planData.name,
            restrictions,
            loading: false,
            error: null,
            isPremium,
            isEnterprise
          });
        } else {
          // No plan found
          setPlanInfo({
            planName: null,
            restrictions,
            loading: false,
            error: null,
            isPremium: false,
            isEnterprise: false
          });
        }
      } catch (error) {
        console.error("Error in fetchPlanInfo:", error);
        setPlanInfo(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load subscription information"
        }));
      }
    };

    fetchPlanInfo();
  }, [authChecked]); // Only depends on authChecked, not any other state

  return planInfo;
};
