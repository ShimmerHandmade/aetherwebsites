import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle, CheckCircle2, DollarSign, CreditCard } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading } = useWebsite(id, navigate);
  
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchStripeAccount = async () => {
      setIsAccountLoading(true);
      try {
        // Use explicit typing with 'any' to avoid type checking for tables not in the schema
        const { data, error } = await supabase
          .from('stripe_connect_accounts' as any)
          .select('*')
          .eq('website_id', id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching Stripe account:", error);
          toast.error("Failed to load payment settings");
        } else {
          setStripeAccount(data);
        }
      } catch (error) {
        console.error("Error in fetchStripeAccount:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsAccountLoading(false);
      }
    };
    
    fetchStripeAccount();
  }, [id]);
  
  const handleConnectStripe = async () => {
    if (!id) return;
    
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { websiteId: id }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to create Stripe Connect account");
      }
      
      if (data?.url) {
        // Open Stripe Connect onboarding in a new tab
        window.open(data.url, '_blank');
        toast.success("Stripe Connect onboarding started");
        
        // Refresh Stripe account data after a delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      toast.error(error.message || "Failed to connect with Stripe");
    } finally {
      setIsConnecting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4 mr-1" />
            Return to Dashboard
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <DollarSign className="mr-2 h-6 w-6" />
          Payment Settings
        </h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Connect</CardTitle>
              <CardDescription>
                Connect your website to Stripe to accept online payments from customers
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isAccountLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="h-8 w-8 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
                </div>
              ) : stripeAccount ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      <div>
                        <p className="font-medium">Stripe account connected</p>
                        <p className="text-sm text-gray-500">ID: {stripeAccount.stripe_account_id}</p>
                      </div>
                    </div>
                    <Badge variant={stripeAccount.onboarding_complete ? "secondary" : "outline"} 
                      className={stripeAccount.onboarding_complete ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                      {stripeAccount.onboarding_complete ? "Active" : "Setup Incomplete"}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium mb-1">Details Submitted</p>
                      <div className="flex items-center">
                        {stripeAccount.details_submitted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        )}
                        <span className="text-sm">{stripeAccount.details_submitted ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium mb-1">Charges Enabled</p>
                      <div className="flex items-center">
                        {stripeAccount.charges_enabled ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        )}
                        <span className="text-sm">{stripeAccount.charges_enabled ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium mb-1">Payouts Enabled</p>
                      <div className="flex items-center">
                        {stripeAccount.payouts_enabled ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        )}
                        <span className="text-sm">{stripeAccount.payouts_enabled ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!stripeAccount.onboarding_complete && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle>Stripe setup incomplete</AlertTitle>
                      <AlertDescription>
                        Your Stripe Connect account setup is not yet complete. Please complete the onboarding process to start accepting payments.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Stripe account connected</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Connect with Stripe to accept payments on your website. This will allow customers to pay online using credit cards.
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className={stripeAccount ? "border-t pt-6" : ""}>
              <Button 
                onClick={handleConnectStripe} 
                className="w-full md:w-auto"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </>
                ) : stripeAccount ? (
                  stripeAccount.onboarding_complete ? "Update Stripe Settings" : "Complete Stripe Setup"
                ) : (
                  "Connect with Stripe"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure which payment methods your customers can use
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Cash on Delivery</p>
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Let customers pay when they receive their order
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Credit Card Payments</p>
                      <Badge 
                        variant="outline" 
                        className={stripeAccount?.onboarding_complete ? 
                          "text-green-600 bg-green-50 border-green-200" : 
                          "text-amber-600 bg-amber-50 border-amber-200"
                        }
                      >
                        {stripeAccount?.onboarding_complete ? "Active" : "Setup Required"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Accept credit card payments through Stripe
                    </p>
                    {!stripeAccount?.onboarding_complete && (
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleConnectStripe}
                          disabled={isConnecting}
                        >
                          {isConnecting ? "Connecting..." : "Set Up Stripe"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
