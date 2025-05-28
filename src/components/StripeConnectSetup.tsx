
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, ExternalLink, RefreshCw, AlertTriangle } from "lucide-react";

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
      case 'Setup Required': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
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
          Connect your Stripe account to accept payments on your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || platformError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || platformError}
              {platformError && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://dashboard.stripe.com/connect/accounts/overview", "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Stripe Dashboard
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Account Status:</span>
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {getAccountStatus()}
            </span>
          </div>
          
          {stripeAccount && (
            <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
              <div><strong>Account ID:</strong> {stripeAccount.id}</div>
              <div><strong>Charges Enabled:</strong> {stripeAccount.chargesEnabled ? 'Yes' : 'No'}</div>
              <div><strong>Payouts Enabled:</strong> {stripeAccount.payoutsEnabled ? 'Yes' : 'No'}</div>
              <div><strong>Details Submitted:</strong> {stripeAccount.detailsSubmitted ? 'Yes' : 'No'}</div>
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
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800 font-medium">Payment Processing Active</p>
            </div>
            <p className="text-green-600 text-sm mt-1">Your Stripe account is fully configured and ready to accept payments.</p>
          </div>
        )}
        
        {!stripeAccount && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Connect Stripe Account" to start the setup process</li>
              <li>You'll be redirected to Stripe to create or connect your account</li>
              <li>Complete the required information and verification steps</li>
              <li>Return here to confirm your setup is complete</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectSetup;
