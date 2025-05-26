
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";

interface SimplifiedSubscriptionDisplayProps {
  loading: boolean;
  planName: string | null;
  subscriptionEnd: string | null;
  onManageClick: () => void;
  isManageLoading: boolean;
}

const SimplifiedSubscriptionDisplay: React.FC<SimplifiedSubscriptionDisplayProps> = ({
  loading,
  planName,
  subscriptionEnd,
  onManageClick,
  isManageLoading
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading your subscription information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActiveSubscription = planName && subscriptionEnd;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          {hasActiveSubscription ? 'Manage your active subscription' : 'You are currently on the free plan'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActiveSubscription ? (
          <>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-indigo-900">{planName} Plan</h3>
                  <p className="text-sm text-indigo-700">
                    Your subscription will renew on{" "}
                    {new Date(subscriptionEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={onManageClick}
              disabled={isManageLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isManageLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <p className="text-orange-800">
                You're currently on the free plan with limited features. Upgrade to unlock more capabilities.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Upgrade Your Plan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifiedSubscriptionDisplay;
