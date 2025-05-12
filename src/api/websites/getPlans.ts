
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
    
    // Process the plans data - ensure features is properly parsed to string[]
    const processedPlans = data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      monthly_price: plan.monthly_price,
      annual_price: plan.annual_price,
      // Parse features from jsonb to ensure it's a string array
      features: Array.isArray(plan.features) 
        ? plan.features.map(feature => String(feature))
        : typeof plan.features === 'string'
          ? [plan.features]
          : plan.features instanceof Object 
            ? Object.keys(plan.features).map(key => String(plan.features[key])) 
            : []
    })) as Plan[];
    
    return { data: processedPlans };
  } catch (error) {
    console.error("Error in getPlans:", error);
    return {
      data: null,
      error: "An unexpected error occurred"
    };
  }
};
