
import React, { createContext, useContext, ReactNode } from "react";
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
  
  return (
    <PlanContext.Provider value={planInfo}>
      {children}
    </PlanContext.Provider>
  );
};

// Custom hook to use the plan context
export const usePlan = () => useContext(PlanContext);
