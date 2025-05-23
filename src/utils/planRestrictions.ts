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

// Helper function to check if a user has access to a feature based on their subscription
export const hasFeatureAccess = (profile: Profile | null, featureName: string): boolean => {
  if (!profile) return false;
  
  // If the profile is not subscribed, only allow basic features
  if (!profile.is_subscribed) {
    const basicFeatures = ['basic_builder', 'single_website'];
    return basicFeatures.includes(featureName);
  }
  
  // For subscribed users, check the plan level
  const planType = profile.subscription_type?.toLowerCase() || '';
  
  if (planType === 'pro') {
    return true; // Pro plan has access to all features
  }
  
  if (planType === 'basic') {
    const basicPlanFeatures = [
      'basic_builder',
      'custom_domain',
      'limited_products',
      'limited_pages',
      'single_website',
    ];
    return basicPlanFeatures.includes(featureName);
  }
  
  return false;
};

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
  
  const planType = profile.subscription_type?.toLowerCase() || '';
  
  if (planType === 'pro') {
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
  
  if (planType === 'basic') {
    return {
      maxProducts: 100,
      maxPages: 20,
      maxWebsites: 3,
      hasAdvancedAnalytics: false,
      hasCustomDomain: true,
      hasAllowCoupons: true,
      hasAllowDiscounts: false,
      hasAllowPremiumTemplates: false,
      hasAllowPremiumElements: false
    };
  }
  
  return defaults;
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
  
  // All themes are accessible for subscribed users
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
