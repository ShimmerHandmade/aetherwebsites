
import { supabase } from '@/integrations/supabase/client';

// Define the Plan type
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  is_active: boolean;
  stripe_price_id: string;
}

export const getPlans = async () => {
  try {
    const { data, error } = await supabase.from('plans').select('*').eq('is_active', true);
    
    if (error) {
      console.error('Error fetching plans:', error);
      return { plans: [], error: error.message };
    }
    
    return { plans: data as Plan[], error: null };
  } catch (err: any) {
    console.error('Error in getPlans:', err);
    return { plans: [], error: 'Failed to fetch plans' };
  }
};
