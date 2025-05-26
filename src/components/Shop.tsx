
import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManager from "@/components/ProductManager";
import { useStripeConnect } from "@/hooks/useStripeConnect";
import StripeConnectSetup from "@/components/StripeConnectSetup";
import ShippingSettingsManager from "@/components/ShippingSettingsManager";
import { usePlan } from "@/contexts/PlanContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown } from "lucide-react";
import PayPalSettings from "@/components/PayPalSettings";
import LoadingSpinner from "@/components/LoadingSpinner";

const Shop = () => {
  const { id } = useParams<{ id: string }>();
  const { isEnterprise, isPremium, checkUpgrade } = usePlan();
  const [activeTab, setActiveTab] = useState("products");
  
  const {
    stripeAccount,
    isLoading: stripeLoading,
    isConnecting,
    isRefreshing,
    error: stripeError,
    platformError,
    connectStripeAccount,
    refreshStripeAccount
  } = useStripeConnect(id);

  // Check if user has access to shop features
  const hasShopAccess = isPremium || isEnterprise;

  useEffect(() => {
    if (!hasShopAccess && !checkUpgrade("E-commerce features", true)) {
      // User doesn't have access and the upgrade check will show toast
    }
  }, [hasShopAccess, checkUpgrade]);

  if (!hasShopAccess) {
    return (
      <div className="p-6">
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            E-commerce features require a Professional or Enterprise plan. Please upgrade your plan to access the shop functionality.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shop Management</h1>
        {isEnterprise && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            <Crown className="h-4 w-4" />
            Enterprise Features Available
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payments">Payment Setup</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          {isEnterprise && <TabsTrigger value="paypal">PayPal</TabsTrigger>}
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading products..." />}>
            <ProductManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading payment settings..." />}>
            <StripeConnectSetup
              stripeAccount={stripeAccount}
              isLoading={stripeLoading}
              isConnecting={isConnecting}
              isRefreshing={isRefreshing}
              error={stripeError}
              platformError={platformError}
              onConnect={connectStripeAccount}
              onRefresh={refreshStripeAccount}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading shipping settings..." />}>
            <ShippingSettingsManager websiteId={id || ''} />
          </Suspense>
        </TabsContent>

        {isEnterprise && (
          <TabsContent value="paypal" className="space-y-6">
            <Suspense fallback={<LoadingSpinner size="lg" text="Loading PayPal settings..." />}>
              <PayPalSettings websiteId={id || ''} />
            </Suspense>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Shop;
