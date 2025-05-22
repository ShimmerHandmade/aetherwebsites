
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { manageSubscription } from '@/api/websites';
import { Profile } from '@/types/general';

interface SubscriptionManagerProps {
  profile: Profile | null;
  onSuccess?: () => Promise<void> | void;
}

const SubscriptionManager = ({ profile, onSuccess }: SubscriptionManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleManageSubscription = async () => {
    if (!profile) {
      toast.error('You need to be logged in to manage your subscription');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await manageSubscription();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      if (result.url) {
        // Open the Stripe portal URL in a new tab
        window.open(result.url, '_blank');
        
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
  
  return (
    <Button 
      variant={profile?.is_subscribed ? "outline" : "default"}
      onClick={handleManageSubscription}
      disabled={isLoading}
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
  );
};

export default SubscriptionManager;
