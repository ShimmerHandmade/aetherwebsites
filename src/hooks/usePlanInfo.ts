
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";
import { supabase } from "@/integrations/supabase/client";

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
    let isLoading = false;

    const loadPlanInfo = async () => {
      if (isLoading) return; // Prevent concurrent calls
      isLoading = true;

      try {
        console.log("🔄 Loading plan info...");
        
        // Get restrictions (this handles auth internally)
        const restrictions = await getUserPlanRestrictions();
        
        if (!isMounted) return;

        // Check auth status without throwing
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.log("⚠️ Session error:", sessionError.message);
        }
        
        // Default values for unauthenticated users
        if (!session?.user) {
          console.log("👤 No user session, using defaults");
          if (isMounted) {
            setPlanInfo({
              planName: null,
              restrictions,
              loading: false,
              error: null,
              isPremium: false,
              isEnterprise: false
            });
          }
          return;
        }
        
        console.log("🔍 Fetching plan for authenticated user");
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_subscribed, subscription_end, plan_id")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("❌ Profile error:", profileError);
          if (isMounted) {
            setPlanInfo({
              planName: null,
              restrictions,
              loading: false,
              error: profileError.message,
              isPremium: false,
              isEnterprise: false
            });
          }
          return;
        }
        
        let planName = null;
        let isPremium = false;
        let isEnterprise = false;
        
        // Check subscription status
        const hasActiveSubscription = profile?.is_subscribed && 
          (!profile.subscription_end || new Date(profile.subscription_end) > new Date());
        
        if (hasActiveSubscription && profile.plan_id) {
          // Get plan name
          const { data: planData, error: planError } = await supabase
            .from("plans")
            .select("name")
            .eq("id", profile.plan_id)
            .maybeSingle();
          
          if (!planError && planData) {
            planName = planData.name;
            
            // Set flags based on plan name
            if (planName) {
              const lowerPlanName = planName.toLowerCase();
              isPremium = lowerPlanName.includes("professional") || 
                         lowerPlanName.includes("premium") ||
                         lowerPlanName.includes("enterprise");
              isEnterprise = lowerPlanName.includes("enterprise");
            }
          }
        }
        
        console.log("✅ Plan info loaded:", { planName, isPremium, isEnterprise });
        
        if (isMounted) {
          setPlanInfo({
            planName,
            restrictions,
            loading: false,
            error: null,
            isPremium,
            isEnterprise
          });
        }
      } catch (error) {
        console.error("💥 Error in usePlanInfo:", error);
        if (isMounted) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load plan information"
          }));
        }
      } finally {
        isLoading = false;
      }
    };

    loadPlanInfo();
    
    return () => {
      isMounted = false;
    };
  }, []); // No dependencies to prevent loops

  return planInfo;
};
