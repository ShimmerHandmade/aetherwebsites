
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const verifySubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a session ID from the URL
      let endpoint = "check-subscription";
      if (sessionId) {
        endpoint = `check-subscription?session_id=${sessionId}`;
      }
      
      console.log("Checking subscription with endpoint:", endpoint);
      
      // Call check-subscription with session ID if available
      const { data, error } = await supabase.functions.invoke(endpoint);
      
      console.log("Subscription check response:", data, error);
      
      if (error) {
        console.error("Error checking subscription:", error);
        setError("Failed to verify subscription. Please try refreshing or contact support.");
        return false;
      }
      
      if (data.subscribed && data.plan) {
        setPlanName(data.plan.name);
        toast.success(`Successfully subscribed to ${data.plan.name} plan!`);
        return true;
      } else if (data.error) {
        setError(data.error);
        return false;
      } else {
        // Handle case where we have a successful API response but subscription isn't active yet
        setError("Your subscription is still processing. Please wait a moment and try refreshing.");
        return false;
      }
    } catch (err) {
      console.error("Error verifying subscription:", err);
      setError("An unexpected error occurred. Please contact support.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setManualRefresh(true);
    setRetryCount(0);
    verifySubscription();
  };
  
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    // If there's no session ID in the URL, check auth status
    if (!sessionId) {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("You must be logged in to view your subscription status.");
          setLoading(false);
          return;
        }
        
        // If authenticated but no session ID, proceed with verification
        verifySubscription();
      };
      checkAuth();
    } else {
      // Initial verification with session ID
      verifySubscription();
    }
  }, [sessionId]); // Only run on first mount or if sessionId changes
  
  // Setup retry mechanism
  useEffect(() => {
    // Only trigger retries if we've manually refreshed or have session ID
    if ((manualRefresh || sessionId) && retryCount > 0 && retryCount < 6 && !planName && loading) {
      const timer = setTimeout(() => {
        console.log(`Retry attempt ${retryCount}/5...`);
        verifySubscription();
      }, 3000); // Retry every 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [retryCount, manualRefresh, sessionId, planName, loading]);
  
  // Increment retry counter if verification fails
  useEffect(() => {
    if (!loading && !planName && error && retryCount < 5) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, planName, error, retryCount]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <LoaderCircle className="h-16 w-16 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying subscription...</h2>
            <p className="text-gray-500 mb-4">
              {retryCount > 0 ? `Attempt ${retryCount + 1}/6...` : "Just a moment while we confirm your subscription status."}
            </p>
            {retryCount >= 3 && (
              <p className="text-amber-600 text-sm">
                This is taking longer than expected. Please wait while we verify with our payment provider.
              </p>
            )}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-10 w-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Issue</h2>
            <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <p className="text-gray-600 mb-6">
              If you've been charged but don't see your subscription active yet, don't worry! Stripe's payment processing can sometimes take a few minutes to finalize. Please check back shortly.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={handleManualRefresh}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
              </Button>
              <Button 
                onClick={goToDashboard}
                className="flex items-center"
              >
                Return to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Subscription Confirmed!</h2>
            <p className="text-gray-700 mb-6">
              Your {planName} plan is now active. You can now enjoy all the features of your new subscription.
            </p>
            <Button 
              onClick={goToDashboard}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center"
            >
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
