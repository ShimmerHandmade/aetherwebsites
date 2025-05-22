
import { Profile } from '@/types/general';

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
    return basicFeatures.includes(featureName);
  }
  
  return false;
};

// Helper to get limits based on plan
export const getPlanLimits = (profile: Profile | null) => {
  const defaults = {
    maxProducts: 10,
    maxPages: 5,
    maxWebsites: 1,
    hasAdvancedAnalytics: false,
    hasCustomDomain: false,
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
    };
  }
  
  if (planType === 'basic') {
    return {
      maxProducts: 100,
      maxPages: 20,
      maxWebsites: 3,
      hasAdvancedAnalytics: false,
      hasCustomDomain: true,
    };
  }
  
  return defaults;
};
