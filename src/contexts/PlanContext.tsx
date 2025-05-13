
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { usePlanInfo, PlanInfo } from "@/hooks/usePlanInfo";

// Create context with default values
const PlanContext = createContext<PlanInfo>({
  planName: null,
  restrictions: null,
  loading: true,
  error: null,
  isPremium: false,
  isEnterprise: false
});

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const planInfo = usePlanInfo();
  
  // Log plan information when it changes for debugging
  useEffect(() => {
    if (!planInfo.loading) {
      console.log("Plan context updated:", {
        planName: planInfo.planName,
        isPremium: planInfo.isPremium,
        isEnterprise: planInfo.isEnterprise,
        hasRestrictions: !!planInfo.restrictions
      });
    }
  }, [planInfo.loading, planInfo.planName, planInfo.isPremium, planInfo.isEnterprise, planInfo.restrictions]);
  
  return (
    <PlanContext.Provider value={planInfo}>
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook to use the plan context
export const usePlan = () => useContext(PlanContext);
