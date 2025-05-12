
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
import { Loader2, CreditCard, CheckCircle2, ShoppingCart } from "lucide-react";

interface SubscriptionManagerProps {
  profile: Profile | null;
  productCount?: number;
  pageCount?: number;
  onSubscriptionUpdated?: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
  profile,
  productCount = 0,
  pageCount = 0,
  onSubscriptionUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    subscribed: boolean;
    plan: any;
    subscription_end: string | null;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      checkSubscription();
    }
  }, [profile]);

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
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) {
        toast.error("Failed to access customer portal");
        console.error("Error accessing customer portal:", error);
        return;
      }
      
      // Open customer portal in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
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
          billing_type: 'monthly' // Default to monthly for simplicity
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
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
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
      <CardFooter>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Button 
              onClick={() => handleUpgrade("1")} // Replace with actual Basic plan ID
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Basic Plan
            </Button>
            <Button 
              onClick={() => handleUpgrade("2")} // Replace with actual Pro plan ID
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              Pro Plan
            </Button>
            <Button 
              onClick={() => handleUpgrade("3")} // Replace with actual Enterprise plan ID
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enterprise
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
