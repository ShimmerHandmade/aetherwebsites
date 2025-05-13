
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/pages/Dashboard";
import PlanLimitsInfo from "./PlanLimitsInfo";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { getPlans, openCustomerPortal } from "@/api/websites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CreditCard, CheckCircle2, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionManagerProps {
  profile: Profile | null;
  productCount?: number;
  pageCount?: number;
  onSubscriptionUpdated?: () => void;
  subscriptionStatus?: {
    subscribed: boolean;
    plan: any;
    subscription_end: string | null;
  } | null;
  isLoading?: boolean;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  profile,
  productCount = 0,
  pageCount = 0,
  onSubscriptionUpdated,
  subscriptionStatus: initialSubscriptionStatus,
  isLoading: initialIsLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(initialIsLoading);
  const [plans, setPlans] = useState<any[]>([]);
  const [isAnnual, setIsAnnual] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    subscribed: boolean;
    plan: any;
    subscription_end: string | null;
  } | null>(initialSubscriptionStatus || null);
  const navigate = useNavigate();

  // Only fetch subscription status if not provided via props
  useEffect(() => {
    if (profile && !initialSubscriptionStatus) {
      checkSubscription();
    }
  }, [profile, initialSubscriptionStatus]);

  // Fetch plans only once when component mounts
  useEffect(() => {
    if (profile && plans.length === 0) {
      fetchPlans();
    }
  }, [profile, plans.length]);
  
  // Update local state when prop changes
  useEffect(() => {
    if (initialSubscriptionStatus) {
      setSubscriptionStatus(initialSubscriptionStatus);
    }
  }, [initialSubscriptionStatus]);

  // Update loading state when prop changes
  useEffect(() => {
    setSubscriptionLoading(initialIsLoading);
  }, [initialIsLoading]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await getPlans();
      if (error) {
        console.error("Error fetching plans:", error);
        return;
      }
      if (data) {
        // Sort plans by price for proper display
        const sortedPlans = data.sort((a, b) => a.monthly_price - b.monthly_price);
        setPlans(sortedPlans);
      }
    } catch (error) {
      console.error("Error in fetchPlans:", error);
    }
  };

  const checkSubscription = async () => {
    if (!profile) return;
    
    try {
      setSubscriptionLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        toast.error("Failed to check subscription status");
        console.error("Error checking subscription:", error);
        return;
      }
      
      setSubscriptionStatus(data);
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated();
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      const { url, error } = await openCustomerPortal();
      
      if (error) {
        toast.error("Failed to access customer portal");
        console.error("Error accessing customer portal:", error);
        return;
      }
      
      // Open customer portal in a new tab
      if (url) {
        window.open(url, '_blank');
        toast.info("Opening customer portal in a new tab");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          plan_id: planId,
          billing_type: isAnnual ? 'annual' : 'monthly'
        }
      });
      
      if (error) {
        toast.error("Failed to initiate subscription");
        console.error("Error creating checkout session:", error);
        return;
      }
      
      // Redirect to checkout
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.info(`Opening checkout for ${isAnnual ? 'annual' : 'monthly'} plan in a new tab`);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
    toast.info(`Switched to ${!isAnnual ? 'annual' : 'monthly'} billing`);
  };

  if (!profile) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>
          Manage your plan and subscription details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptionLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <PlanLimitsInfo 
                productCount={productCount} 
                pageCount={pageCount}
              />
            </div>
            
            {subscriptionStatus?.subscribed && subscriptionStatus.plan ? (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{subscriptionStatus.plan.name} Plan</h3>
                    <p className="text-sm text-gray-600">
                      Your subscription will renew on{" "}
                      {subscriptionStatus.subscription_end
                        ? new Date(subscriptionStatus.subscription_end).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-orange-800">
                  You're currently on the free plan with limited features. Upgrade to unlock more capabilities.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        {subscriptionStatus?.subscribed ? (
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Manage Subscription
          </Button>
        ) : (
          <div className="w-full">
            <Tabs defaultValue="monthly" className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly" onClick={() => setIsAnnual(false)}>Monthly</TabsTrigger>
                <TabsTrigger value="annual" onClick={() => setIsAnnual(true)}>Annual (Save 20%)</TabsTrigger>
              </TabsList>
            </Tabs>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              {plans.map(plan => (
                <Button 
                  key={plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                  variant={plan.name === 'Professional' ? 'default' : 'outline'}
                  disabled={isLoading}
                  className={`w-full ${plan.name === 'Professional' ? 
                    'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}`}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {plan.name === 'Professional' ? (
                    <div className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {plan.name} ${isAnnual ? plan.annual_price : plan.monthly_price}
                    </div>
                  ) : (
                    <div>
                      {plan.name} ${isAnnual ? plan.annual_price : plan.monthly_price}
                    </div>
                  )}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate('/subscription-success')}>
                Already subscribed? Check status <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
