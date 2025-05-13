
import { useState, useEffect } from "react";
import { getUserPlanRestrictions, PlanRestriction, getUserPlanName } from "@/utils/planRestrictions";

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
        const [restrictions, planName] = await Promise.all([
          getUserPlanRestrictions(),
          getUserPlanName()
        ]);

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
