
import { Profile } from '@/types/general';
import { supabase } from '@/integrations/supabase/client';

export interface PlanRestriction {
  maxProducts: number;
  maxPages: number;
  maxWebsites: number;
  hasAdvancedAnalytics: boolean;
  hasCustomDomain: boolean;
  hasAllowCoupons: boolean;
  hasAllowDiscounts: boolean;
  hasAllowPremiumTemplates: boolean;
  hasAllowPremiumElements: boolean;
}

// Helper to get limits based on plan
export const getPlanLimits = (profile: Profile | null): PlanRestriction => {
  const defaults: PlanRestriction = {
    maxProducts: 10,
    maxPages: 5,
    maxWebsites: 1,
    hasAdvancedAnalytics: false,
    hasCustomDomain: false,
    hasAllowCoupons: false,
    hasAllowDiscounts: false,
    hasAllowPremiumTemplates: false,
    hasAllowPremiumElements: false
  };
  
  if (!profile || !profile.is_subscribed) {
    return defaults;
  }
  
  const planName = profile.plan_id ? profile.plan_id.toLowerCase() : '';
  
  // Check if plan is enterprise/professional based on the plan name
  const isEnterprise = planName.includes('enterprise') || profile.subscription_type?.toLowerCase() === 'enterprise';
  const isProfessional = planName.includes('pro') || profile.subscription_type?.toLowerCase() === 'professional';
  
  if (isEnterprise) {
    return {
      maxProducts: 1000,
      maxPages: 100,
      maxWebsites: 10,
      hasAdvancedAnalytics: true,
      hasCustomDomain: true,
      hasAllowCoupons: true,
      hasAllowDiscounts: true,
      hasAllowPremiumTemplates: true,
      hasAllowPremiumElements: true
    };
  }
  
  if (isProfessional) {
    return {
      maxProducts: 100,
      maxPages: 20,
      maxWebsites: 3,
      hasAdvancedAnalytics: true,
      hasCustomDomain: true,
      hasAllowCoupons: true,
      hasAllowDiscounts: true,
      hasAllowPremiumTemplates: true,
      hasAllowPremiumElements: false
    };
  }
  
  return {
    maxProducts: 20,
    maxPages: 10,
    maxWebsites: 1,
    hasAdvancedAnalytics: false,
    hasCustomDomain: true,
    hasAllowCoupons: false,
    hasAllowDiscounts: false,
    hasAllowPremiumTemplates: false,
    hasAllowPremiumElements: false
  };
};

// Function to check product limits based on profile
export const checkProductLimit = async (currentCount: number): Promise<boolean> => {
  // Get the current user
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) return false;
  
  // Get the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (!profile) return false;
  
  // Get the plan limits
  const limits = getPlanLimits(profile);
  
  // Check if adding a new product would exceed the limit
  return currentCount < limits.maxProducts;
};

// Function to check theme access based on profile
export const checkThemeAccess = async (themeName: string): Promise<boolean> => {
  // Get the current user
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) return false;
  
  // Get the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (!profile) return false;
  
  // If not subscribed, only allow basic themes
  if (!profile.is_subscribed) {
    const basicThemes = ['basic', 'simple', 'minimal'];
    return basicThemes.includes(themeName.toLowerCase());
  }
  
  const planType = profile.subscription_type?.toLowerCase() || '';
  
  // Premium themes only available for Professional and Enterprise plans
  if (themeName.toLowerCase().includes('premium') && 
     !(planType === 'professional' || planType === 'enterprise')) {
    return false;
  }
  
  // All themes are accessible for subscribed users with appropriate plan
  return true;
};

// Function to get plan restrictions
export const getUserPlanRestrictions = async (): Promise<PlanRestriction> => {
  // Get the current user
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) {
    return {
      maxProducts: 10,
      maxPages: 5,
      maxWebsites: 1,
      hasAdvancedAnalytics: false,
      hasCustomDomain: false,
      hasAllowCoupons: false,
      hasAllowDiscounts: false,
      hasAllowPremiumTemplates: false,
      hasAllowPremiumElements: false
    };
  }
  
  // Get the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  return getPlanLimits(profile);
};
