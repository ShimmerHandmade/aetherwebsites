
import { supabase } from '@/integrations/supabase/client';

export const openCustomerPortal = async () => {
  try {
    // Call the Supabase Edge Function for customer portal
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      method: 'POST'
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { url: data?.url, error: null };
  } catch (error: any) {
    console.error('Error managing subscription:', error);
    return { error: 'Failed to manage subscription' };
  }
};

// For backward compatibility
export const manageSubscription = openCustomerPortal;
