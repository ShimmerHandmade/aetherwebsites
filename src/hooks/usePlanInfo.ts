
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

  useEffect(() => {
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

        const [restrictions, planName] = await Promise.all([
          getUserPlanRestrictions(),
          getUserPlanName()
        ]);

        console.log("Plan name fetched:", planName);
        
        // Determine premium status
        const isPremium = planName === "Professional" || planName === "Enterprise";
        const isEnterprise = planName === "Enterprise";

        setPlanInfo({
          planName,
          restrictions,
          loading: false,
          error: null,
          isPremium,
          isEnterprise
        });
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
  }, []);

  return planInfo;
};
