import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plan, getPlans } from "@/api/websites";

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plans, setPlans] = useState<(Plan & { isPopular?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getPlans();
        
        if (error) {
          console.error("Error fetching plans:", error);
          toast.error("Failed to load pricing plans");
          return;
        }
        
        if (data) {
          // Sort plans by tier level and add isPopular flag to the Professional plan
          const processedPlans = data
            .sort((a, b) => {
              const tiers: Record<string, number> = { 'Basic': 1, 'Professional': 2, 'Enterprise': 3 };
              return (tiers[a.name] || 0) - (tiers[b.name] || 0);
            })
            .map(plan => ({
              ...plan,
              // Mark the Professional plan as popular
              isPopular: plan.name === 'Professional'
            }));
          
          setPlans(processedPlans);
        }
      } catch (error) {
        console.error("Error in fetchPlans:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, []);

  // Filter features based on plan tier
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
        // Only show features exactly matching this plan's tier
        return featureTier === planIndex + 1;
      }
      // Otherwise include all features (backward compatibility)
      return true;
    }).map(feature => {
      // Remove tier prefix if present
      return typeof feature === 'string' ? feature.replace(/^T[1-3]:/, '').trim() : String(feature);
    });
  };

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };
  
  const handlePlanSelect = async (plan: Plan & { isPopular?: boolean }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Save selected plan to sessionStorage for later use after authentication
      sessionStorage.setItem('selectedPlan', JSON.stringify({
        planName: plan.name,
        isAnnual: isAnnual
      }));
      navigate('/auth');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center">
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-md h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              // Get features specific to this plan tier
              const planFeatures = getFilteredFeaturesForPlan(plan, plans);
              
              return (
                <div
                  key={plan.id}
                  className={`pricing-card bg-white rounded-lg shadow-lg p-6 border ${
                    plan.isPopular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200'
                  } relative`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                      Popular
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${isAnnual ? plan.annual_price : plan.monthly_price}</span>
                      <span className="text-gray-500 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>

                  <Button 
                    className={`w-full ${plan.isPopular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Choose {plan.name}
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
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
