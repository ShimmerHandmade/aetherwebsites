
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(false);
  const navigate = useNavigate();

  const verifySubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        setError("Failed to verify subscription. Please try refreshing or contact support.");
        return false;
      }
      
      if (data.subscribed && data.plan) {
        setPlanName(data.plan.name);
        toast.success(`Successfully subscribed to ${data.plan.name} plan!`);
        return true;
      } else {
        // If not yet subscribed, return false to trigger a retry
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

  useEffect(() => {
    // Initial verification
    const checkSubscription = async () => {
      const success = await verifySubscription();
      
      // If not successful and we have retries left, try again after a delay
      if (!success && retryCount < 5) {
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 3000); // Retry every 3 seconds
        
        return () => clearTimeout(timer);
      } else if (!success && retryCount >= 5) {
        // After 5 retries, show error if still not verified
        setError("Your subscription could not be verified after multiple attempts. Please try refreshing or contact support.");
      }
    };
    
    checkSubscription();
  }, [retryCount, manualRefresh]);

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
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={handleManualRefresh}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")}
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
              onClick={() => navigate("/dashboard")}
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
