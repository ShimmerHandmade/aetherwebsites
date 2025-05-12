
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle, CheckCircle2, ArrowRight } from "lucide-react";

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.functions.invoke("check-subscription");
        
        if (error) {
          console.error("Error checking subscription:", error);
          setError("Failed to verify subscription. Please contact support.");
          return;
        }
        
        if (data.subscribed && data.plan) {
          setPlanName(data.plan.name);
          toast.success(`Successfully subscribed to ${data.plan.name} plan!`);
        } else {
          setError("Your subscription could not be verified. Please contact support.");
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <LoaderCircle className="h-16 w-16 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying subscription...</h2>
            <p className="text-gray-500">Just a moment while we confirm your subscription status.</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center"
            >
              Return to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
