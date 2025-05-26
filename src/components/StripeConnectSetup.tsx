
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

interface StripeAccount {
  id: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingComplete: boolean;
}

interface StripeConnectSetupProps {
  stripeAccount: StripeAccount | null;
  isLoading: boolean;
  isConnecting: boolean;
  isRefreshing: boolean;
  error: string | null;
  platformError: string | null;
  onConnect: () => void;
  onRefresh: () => void;
}

const StripeConnectSetup: React.FC<StripeConnectSetupProps> = ({
  stripeAccount,
  isLoading,
  isConnecting,
  isRefreshing,
  error,
  platformError,
  onConnect,
  onRefresh
}) => {
  const getAccountStatus = () => {
    if (!stripeAccount) return 'Not Connected';
    if (!stripeAccount.detailsSubmitted) return 'Setup Required';
    if (!stripeAccount.chargesEnabled || !stripeAccount.payoutsEnabled) return 'Under Review';
    return 'Active';
  };

  const getStatusColor = () => {
    const status = getAccountStatus();
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Under Review': return 'text-yellow-600';
      case 'Setup Required': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    const status = getAccountStatus();
    switch (status) {
      case 'Active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Under Review': return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'Setup Required': return <XCircle className="h-5 w-5 text-orange-500" />;
      default: return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect Setup</CardTitle>
          <CardDescription>Loading payment configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Stripe Connect Setup
          {getStatusIcon()}
        </CardTitle>
        <CardDescription>
          Connect your Stripe account to accept payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || platformError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {error || platformError}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Account Status:</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getAccountStatus()}
            </span>
          </div>
          
          {stripeAccount && (
            <div className="text-xs text-gray-500 space-y-1">
              <div>Account ID: {stripeAccount.id}</div>
              <div>Charges Enabled: {stripeAccount.chargesEnabled ? 'Yes' : 'No'}</div>
              <div>Payouts Enabled: {stripeAccount.payoutsEnabled ? 'Yes' : 'No'}</div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!stripeAccount ? (
            <Button 
              onClick={onConnect} 
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Stripe Account
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                onClick={onRefresh} 
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              {!stripeAccount.detailsSubmitted && (
                <Button 
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>

        {stripeAccount && getAccountStatus() === 'Active' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">Payment Processing Active</p>
            <p className="text-green-600 text-sm">Your Stripe account is fully configured and ready to accept payments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectSetup;
