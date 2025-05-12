
import { supabase } from "@/integrations/supabase/client";

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  features: string[];
}

/**
 * Fetches all plans from the database
 */
export const getPlans = async (): Promise<{
  data: Plan[] | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("monthly_price", { ascending: true });
    
    if (error) {
      console.error("Error fetching plans:", error);
      return {
        data: null,
        error: "Failed to fetch pricing plans"
      };
    }
    
    // Process the plans data
    const processedPlans = data.map(plan => ({
      ...plan,
      // Ensure features is always an array
      features: Array.isArray(plan.features) ? plan.features : plan.features
    }));
    
    return { data: processedPlans };
  } catch (error) {
    console.error("Error in getPlans:", error);
    return {
      data: null,
      error: "An unexpected error occurred"
    };
  }
};
