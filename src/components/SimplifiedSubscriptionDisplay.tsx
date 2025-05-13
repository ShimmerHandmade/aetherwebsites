
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";

interface SimplifiedSubscriptionDisplayProps {
  loading: boolean;
  planName: string | null;
  subscriptionEnd?: string | null;
  onManageClick: () => void;
  isManageLoading?: boolean;
}

const SimplifiedSubscriptionDisplay: React.FC<SimplifiedSubscriptionDisplayProps> = ({
  loading,
  planName,
  subscriptionEnd,
  onManageClick,
  isManageLoading = false
}) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>
            Manage your plan and subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p>Loading plan information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>
          Manage your plan and subscription details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-4">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{planName || 'Free'} Plan</h3>
              <p className="text-sm text-gray-600">
                {planName ? (
                  <>Your subscription will renew on {formatDate(subscriptionEnd)}</>
                ) : (
                  <>You're currently on the free plan with limited features</>
                )}
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onManageClick}
          disabled={isManageLoading}
          className="w-full"
        >
          {isManageLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimplifiedSubscriptionDisplay;
