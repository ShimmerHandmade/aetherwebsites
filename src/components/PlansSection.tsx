
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CircleCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/pages/Dashboard";
import { Plan, getPlans } from "@/api/websites";

interface PlansSectionProps {
  profile: Profile | null;
  onPlanSelected: () => void;
}

const PlansSection = ({ profile, onPlanSelected }: PlansSectionProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getPlans();
        
        if (error) {
          console.error("Error fetching plans:", error);
          return;
        }
        
        if (data) {
          // Sort plans by tier level to ensure proper feature filtering
          const sortedPlans = data.sort((a, b) => {
            const tiers: Record<string, number> = { 'Basic': 1, 'Professional': 2, 'Enterprise': 3 };
            return (tiers[a.name] || 0) - (tiers[b.name] || 0);
          });
          setPlans(sortedPlans);
        }
      } catch (error) {
        console.error("Error in fetchPlans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter features based on plan tier (each plan should only show features for its tier)
  const getFilteredFeaturesForPlan = (plan: Plan, allPlans: Plan[]): string[] => {
    // Find plan index to determine tier level
    const planIndex = allPlans.findIndex(p => p.id === plan.id);
    
    if (!plan.features || !Array.isArray(plan.features)) {
      return [];
    }

    // Filter features for this specific plan
    return plan.features.filter(feature => {
      // If the feature contains tier information (T1:, T2:, T3:)
      if (typeof feature === 'string' && feature.match(/^T[1-3]:/)) {
        const featureTier = parseInt(feature.charAt(1));
        // Only show features with tier <= current plan tier
        return featureTier <= planIndex + 1;
      }
      // Otherwise include all features (backward compatibility)
      return true;
    }).map(feature => {
      // Remove tier prefix if present
      return typeof feature === 'string' ? feature.replace(/^T[1-3]:/, '').trim() : String(feature);
    });
  };

  const handleSelectPlan = async (plan: Plan) => {
    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to select a plan");
        // Redirect to auth page
        window.location.href = '/auth';
        return;
      }
      
      setIsProcessing(true);
      
      // Use create-checkout edge function to redirect to Stripe checkout
      const billingType = isAnnual ? 'annual' : 'monthly';
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          billing_type: billingType,
          plan_id: plan.id
        }
      });
      
      if (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Failed to create checkout session");
        return;
      }
      
      // Redirect to Stripe checkout
      if (data?.url) {
        toast.info("Redirecting to secure checkout...");
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error in handleSelectPlan:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Select the perfect plan for your business needs.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center">
          <span className={`text-lg ${!isAnnual ? 'text-brand-600 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={toggleBilling}
            className="mx-4 relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200"
          >
            <span
              className={`${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
            />
            <span
              className={`${
                isAnnual ? 'bg-brand-600' : 'bg-gray-200'
              } absolute inset-0 rounded-full transition-colors duration-200 ease-in-out`}
            />
          </button>
          <span className={`text-lg ${isAnnual ? 'text-brand-600 font-medium' : 'text-gray-500'}`}>
            Annual <span className="text-green-500 text-sm font-medium ml-1">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, planIndex) => {
          const isPopular = plan.name === 'Professional';
          // Get features specific to this plan tier
          const planFeatures = getFilteredFeaturesForPlan(plan, plans);
          
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg p-6 shadow-md border ${
                isPopular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200'
              } relative`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annual_price : plan.monthly_price}
                  </span>
                  <span className="text-gray-500 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>

              <Button 
                onClick={() => handleSelectPlan(plan)}
                className={`w-full ${
                  isPopular 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Choose {plan.name}</>
                )}
              </Button>

              <div className="mt-8 space-y-4">
                <p className="text-sm uppercase font-semibold text-gray-500">What's included:</p>
                {planFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <CircleCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansSection;
