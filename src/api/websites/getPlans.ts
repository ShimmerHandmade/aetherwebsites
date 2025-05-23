
import { supabase } from '@/integrations/supabase/client';

// Define the Plan type with explicit types to avoid recursive instantiation
export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  interval?: string;
  features: string[];
  is_active?: boolean;
  stripe_price_id?: string;
  price?: number; // Kept for backward compatibility
}

export const getPlans = async () => {
  try {
    // Removing the is_active filter as the column doesn't exist according to the error log
    const { data, error } = await supabase
      .from('plans')
      .select('*');
    
    if (error) {
      console.error('Error fetching plans:', error);
      return { plans: [], error: error.message };
    }
    
    // Transform data to match the Plan interface
    const plans = data.map(plan => ({
      ...plan,
      features: Array.isArray(plan.features) ? plan.features : []
    })) as Plan[];
    
    return { plans, error: null };
  } catch (err: any) {
    console.error('Error in getPlans:', err);
    return { plans: [], error: 'Failed to fetch plans' };
  }
};
