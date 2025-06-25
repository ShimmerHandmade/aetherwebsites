
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RefreshSubscriptionButtonProps {
  onRefresh?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const RefreshSubscriptionButton = ({ 
  onRefresh, 
  variant = "outline",
  size = "sm",
  className = ""
}: RefreshSubscriptionButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // First check if user has Free Enterprise plan
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to refresh subscription status");
        return;
      }

      // Get user profile to check for Free Enterprise plan
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_subscribed, plan_id, plans(name)")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.is_subscribed && profile.plans && 
          typeof profile.plans === 'object' && 
          'name' in profile.plans &&
          (profile.plans as { name: string }).name === "Free Enterprise") {
        toast.success("Subscription status refreshed - Free Enterprise plan is active");
        if (onRefresh) onRefresh();
        return;
      }

      // For other plans, use the edge function
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error refreshing subscription:", error);
        toast.error("Failed to refresh subscription status");
        return;
      }
      
      if (data.subscribed) {
        const planName = data.plan?.name || "your current plan";
        toast.success(`Subscription status refreshed - ${planName} is active`);
      } else {
        toast.info("Subscription status refreshed - No active subscription found");
      }
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error refreshing subscription:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={className}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : "mr-2"}`} />
      {!isRefreshing ? "Refresh" : ""}
    </Button>
  );
};

export default RefreshSubscriptionButton;
