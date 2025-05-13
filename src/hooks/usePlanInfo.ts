
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
  const [authChecked, setAuthChecked] = useState(false);
  const isMounted = useRef(true);
  const fetchingData = useRef(false);

  // First check authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (fetchingData.current) return;
      
      try {
        fetchingData.current = true;
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
        }
        
        if (isMounted.current) {
          setAuthChecked(!!user);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        if (isMounted.current) {
          setAuthChecked(true); // Set to true to allow next effect to run
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Authentication check failed"
          }));
        }
      } finally {
        fetchingData.current = false;
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Then fetch plan information if authenticated - using the direct API call
  useEffect(() => {
    if (!authChecked || fetchingData.current) return;
    
    const fetchPlanInfo = async () => {
      if (fetchingData.current) return;
      fetchingData.current = true;
      
      try {
        // Use the getUserPlan API instead of direct database queries
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
          return;
        }
        
        // Get restrictions regardless of plan status
        const restrictions = await getUserPlanRestrictions();
        
        // Determine plan status based on the API response
        if (planData) {
          const isPremium = planData.name === "Professional" || planData.name === "Enterprise";
          const isEnterprise = planData.name === "Enterprise";
          
          if (isMounted.current) {
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
          // No plan found
          if (isMounted.current) {
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
      } catch (error) {
        console.error("Error in fetchPlanInfo:", error);
        if (isMounted.current) {
          setPlanInfo(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load subscription information"
          }));
        }
      } finally {
        fetchingData.current = false;
      }
    };

    fetchPlanInfo();
    
    return () => {
      isMounted.current = false;
    };
  }, [authChecked]); // Only depends on authChecked, not any other state

  return planInfo;
};
