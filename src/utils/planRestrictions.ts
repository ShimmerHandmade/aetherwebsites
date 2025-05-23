
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
    console.log('Using default plan restrictions');
    return defaults;
  }
  
  // Check subscription type and plan ID for more accurate detection
  const subscriptionType = profile.subscription_type?.toLowerCase() || '';
  const planId = profile.plan_id?.toLowerCase() || '';
  
  console.log(`Determining plan limits for subscription type: ${subscriptionType}, plan ID: ${planId}`);
  
  const isEnterprise = 
    subscriptionType === 'enterprise' || 
    planId.includes('enterprise') ||
    planId.includes('tier3');
    
  const isProfessional = 
    subscriptionType === 'professional' || 
    subscriptionType === 'premium' || 
    planId.includes('pro') ||
    planId.includes('premium') ||
    planId.includes('tier2');
  
  if (isEnterprise) {
    console.log('Enterprise plan detected');
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
    console.log('Professional plan detected');
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
  
  console.log('Basic paid plan detected');
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
  try {
    // Get the current user
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      console.log('No authenticated user found for product limit check');
      return false;
    }
    
    // Get the profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (!profile) {
      console.log('No profile found for product limit check');
      return false;
    }
    
    // Get the plan limits
    const limits = getPlanLimits(profile);
    
    console.log(`Checking product limit: current count ${currentCount}, limit ${limits.maxProducts}`);
    
    // Check if adding a new product would exceed the limit
    return currentCount < limits.maxProducts;
  } catch (error) {
    console.error('Error checking product limit:', error);
    return false;
  }
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
  try {
    // Get the current user
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      console.log('No authenticated user found for plan restrictions');
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
    
    if (!profile) {
      console.log('No profile found for plan restrictions');
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
    
    return getPlanLimits(profile);
  } catch (error) {
    console.error('Error getting user plan restrictions:', error);
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
};
