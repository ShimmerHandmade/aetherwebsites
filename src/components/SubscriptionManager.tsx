
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { manageSubscription } from '@/api/websites';
import { Profile } from '@/types/general';
import { openCustomerPortal } from '@/api/websites/manageSubscription';

interface SubscriptionManagerProps {
  profile: Profile | null;
  onSuccess?: () => Promise<void> | void;
}

const SubscriptionManager = ({ profile, onSuccess }: SubscriptionManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleManageSubscription = async () => {
    if (!profile) {
      toast.error('You need to be logged in to manage your subscription');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await openCustomerPortal();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      if (result.url) {
        // Open the Stripe portal URL in a new tab
        window.open(result.url, '_blank');
        
        toast.success("Subscription portal opened", {
          description: "After making changes, return here and refresh your status",
          duration: 5000
        });
        
        // If onSuccess callback is provided, call it after a delay
        // to allow time for subscription changes to be processed
        if (onSuccess) {
          setTimeout(async () => {
            await onSuccess();
          }, 5000);
        }
      } else {
        toast.error('Failed to generate subscription portal link');
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      toast.error('An error occurred while trying to manage your subscription');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshStatus = async () => {
    if (!onSuccess) return;
    
    try {
      setIsRefreshing(true);
      await onSuccess();
      toast.success("Subscription status refreshed");
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      toast.error('Failed to refresh subscription status');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant={profile?.is_subscribed ? "outline" : "default"}
        onClick={handleManageSubscription}
        disabled={isLoading || isRefreshing}
        className={profile?.is_subscribed ? "border-blue-200" : ""}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {profile?.is_subscribed ? 'Manage Subscription' : 'Subscribe Now'}
          </>
        )}
      </Button>
      
      {profile?.is_subscribed && onSuccess && (
        <Button
          size="icon"
          variant="outline"
          onClick={handleRefreshStatus}
          disabled={isRefreshing || isLoading}
          title="Refresh subscription status"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
};

export default SubscriptionManager;
