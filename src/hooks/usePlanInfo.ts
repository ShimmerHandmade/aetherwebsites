
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction } from "@/utils/planRestrictions";
import { getUserPlanSimplified } from "@/api/websites/getUserPlanSimplified";
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
        
        // Check authentication first
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log("👤 Auth check:", { user: user?.id, error: authError });
        
        if (authError) {
          console.error("❌ Auth error:", authError);
          if (isMounted) {
            setPlanInfo({
              planName: null,
              restrictions: null,
              loading: false,
              error: "Authentication error",
              isPremium: false,
              isEnterprise: false
            });
          }
          return;
        }

        if (!user) {
          console.log("🔄 No authenticated user, using default plan");
          const restrictions = await getUserPlanRestrictions();
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
        
        console.log("🔄 Loading plan data for authenticated user...");
        
        const [restrictions, planData] = await Promise.all([
          getUserPlanRestrictions(),
          getUserPlanSimplified()
        ]);
        
        console.log("📊 Plan data loaded:", {
          restrictions,
          planData,
          planName: planData?.planName,
          isActive: planData?.isActive
        });
        
        if (!isMounted) return;

        const isPremium = planData?.planName === "Professional" || planData?.planName === "Enterprise";
        const isEnterprise = planData?.planName === "Enterprise";
        
        console.log("✅ Plan info processed:", {
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

  // Log plan info changes
  useEffect(() => {
    console.log("📋 Plan info state updated:", planInfo);
  }, [planInfo]);

  return planInfo;
};
