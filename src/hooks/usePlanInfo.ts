
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

    const loadPlanInfo = async () => {
      try {
        console.log("🔄 Starting plan info load...");
        
        // Get restrictions first (this handles auth internally)
        const restrictions = await getUserPlanRestrictions();
        console.log("📊 Restrictions loaded:", restrictions);
        
        if (!isMounted) return;

        // Check authentication for plan details
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log("🔄 No authenticated user, using default plan");
          setPlanInfo({
            planName: null,
            restrictions,
            loading: false,
            error: null,
            isPremium: false,
            isEnterprise: false
          });
          return;
        }
        
        console.log("👤 User found, fetching plan details...");
        
        // Get user profile with plan info
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_subscribed, subscription_end, plan_id, plans(name)")
          .eq("id", user.id)
          .maybeSingle();
        
        console.log("📊 Profile data:", { profile, error: profileError });
        
        if (profileError) {
          console.error("❌ Profile error:", profileError);
          setPlanInfo({
            planName: null,
            restrictions,
            loading: false,
            error: null,
            isPremium: false,
            isEnterprise: false
          });
          return;
        }
        
        let planName = null;
        let isPremium = false;
        let isEnterprise = false;
        
        // Check if user has active subscription
        if (profile?.is_subscribed && 
            (!profile.subscription_end || new Date(profile.subscription_end) > new Date())) {
          
          // Try to get plan name from the relationship with comprehensive null safety
          if (profile.plans && 
              typeof profile.plans === 'object' && 
              profile.plans !== null && 
              !Array.isArray(profile.plans) && 
              'name' in profile.plans) {
            planName = (profile.plans as { name: string }).name;
          } else if (profile.plan_id) {
            // Fallback: fetch plan separately
            const { data: planData } = await supabase
              .from("plans")
              .select("name")
              .eq("id", profile.plan_id)
              .maybeSingle();
            
            planName = planData?.name || null;
          }
          
          isPremium = planName === "Professional" || planName === "Enterprise";
          isEnterprise = planName === "Enterprise";
        }
        
        console.log("✅ Final plan info:", { planName, isPremium, isEnterprise });
        
        if (!isMounted) return;
        
        setPlanInfo({
          planName,
          restrictions,
          loading: false,
          error: null,
          isPremium,
          isEnterprise
        });
      } catch (error) {
        console.error("❌ Error in usePlanInfo:", error);
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
