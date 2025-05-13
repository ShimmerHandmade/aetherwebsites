
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction, getUserPlanName } from "@/utils/planRestrictions";
import { supabase } from "@/integrations/supabase/client";

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

  // Then fetch plan information if authenticated
  useEffect(() => {
    if (!authChecked) return;
    
    const fetchPlanInfo = async () => {
      try {
        console.log("Fetching plan information...");

        // Try to get the plan ID directly first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No authenticated user found");
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Not authenticated"
          }));
          return;
        }

        // Query profile directly to check plan_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan_id, is_subscribed")
          .eq("id", user.id)
          .single();

        console.log("Profile data from direct query:", profile);

        // If we have a profile with plan_id, fetch plan details
        if (profile && profile.plan_id) {
          const [restrictions, planName] = await Promise.all([
            getUserPlanRestrictions(),
            getUserPlanName()
          ]);
          
          console.log("Plan name fetched:", planName);
          
          // Default to "Basic" plan if we have a plan_id but no plan name (migration case)
          const effectivePlanName = planName || (profile.is_subscribed ? "Basic" : null);
          
          // Determine premium status
          const isPremium = effectivePlanName === "Professional" || effectivePlanName === "Enterprise";
          const isEnterprise = effectivePlanName === "Enterprise";

          setPlanInfo({
            planName: effectivePlanName,
            restrictions,
            loading: false,
            error: null,
            isPremium,
            isEnterprise
          });
        } else {
          // No plan found
          const restrictions = await getUserPlanRestrictions();
          
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
        console.error("Error fetching plan information:", error);
        setPlanInfo(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load subscription information"
        }));
      }
    };

    fetchPlanInfo();
  }, [authChecked]);

  return planInfo;
};
