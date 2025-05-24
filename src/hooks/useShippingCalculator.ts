
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeightBasedRate {
  id: string;
  minWeight: number;
  maxWeight: number;
  rate: number;
}

interface ShippingSettings {
  flatRateEnabled: boolean;
  flatRateAmount: number;
  weightBasedEnabled: boolean;
  weightBasedRates: WeightBasedRate[];
  freeShippingEnabled: boolean;
  freeShippingMinimum: number;
}

interface ShippingCalculation {
  cost: number;
  method: string;
  isFree: boolean;
}

export const useShippingCalculator = (websiteId: string) => {
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_settings')
          .select('*')
          .eq('website_id', websiteId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setShippingSettings({
            flatRateEnabled: data.flat_rate_enabled,
            flatRateAmount: data.flat_rate_amount || 0,
            weightBasedEnabled: data.weight_based_enabled,
            weightBasedRates: data.weight_based_rates || [],
            freeShippingEnabled: data.free_shipping_enabled,
            freeShippingMinimum: data.free_shipping_minimum || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching shipping settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (websiteId) {
      fetchShippingSettings();
    }
  }, [websiteId]);

  const calculateShipping = (orderTotal: number, totalWeight: number = 0): ShippingCalculation => {
    if (!shippingSettings) {
      return { cost: 0, method: 'No shipping settings', isFree: true };
    }

    // Check for free shipping first
    if (shippingSettings.freeShippingEnabled && orderTotal >= shippingSettings.freeShippingMinimum) {
      return { cost: 0, method: 'Free shipping', isFree: true };
    }

    // Check weight-based shipping
    if (shippingSettings.weightBasedEnabled && totalWeight > 0) {
      const applicableRate = shippingSettings.weightBasedRates.find(
        rate => totalWeight >= rate.minWeight && totalWeight <= rate.maxWeight
      );
      
      if (applicableRate) {
        return { 
          cost: applicableRate.rate, 
          method: `Weight-based (${applicableRate.minWeight}-${applicableRate.maxWeight} lbs)`,
          isFree: false 
        };
      }
    }

    // Fall back to flat rate shipping
    if (shippingSettings.flatRateEnabled) {
      return { 
        cost: shippingSettings.flatRateAmount, 
        method: 'Flat rate shipping',
        isFree: false 
      };
    }

    // No shipping method configured
    return { cost: 0, method: 'No shipping required', isFree: true };
  };

  return {
    shippingSettings,
    loading,
    calculateShipping,
  };
};
