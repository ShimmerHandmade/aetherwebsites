
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebsite } from "@/hooks/useWebsite";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Truck, Package, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

interface WeightBasedRate {
  id: string;
  min_weight: number;
  max_weight: number;
  rate: number;
}

interface ShippingSettings {
  id: string;
  website_id: string;
  flat_rate_enabled: boolean;
  flat_rate_amount: number;
  weight_based_enabled: boolean;
  weight_based_rates: WeightBasedRate[];
  free_shipping_enabled: boolean;
  free_shipping_minimum: number;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  flat_rate_enabled: z.boolean(),
  flat_rate_amount: z.number().min(0),
  weight_based_enabled: z.boolean(),
  free_shipping_enabled: z.boolean(),
  free_shipping_minimum: z.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

const ShippingSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading } = useWebsite(id, navigate);
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [weightRates, setWeightRates] = useState<WeightBasedRate[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flat_rate_enabled: false,
      flat_rate_amount: 0,
      weight_based_enabled: false,
      free_shipping_enabled: false,
      free_shipping_minimum: 0,
    }
  });

  useEffect(() => {
    if (website) {
      fetchShippingSettings();
    }
  }, [website]);

  const fetchShippingSettings = async () => {
    setLoadingSettings(true);
    try {
      const { data, error } = await supabase
        .from("shipping_settings")
        .select("*")
        .eq("website_id", id)
        .single();
      
      if (error) {
        console.error("Error fetching shipping settings:", error);
        toast.error("Failed to load shipping settings");
      } else if (data) {
        setSettings(data);
        setWeightRates(data.weight_based_rates || []);
        form.reset({
          flat_rate_enabled: data.flat_rate_enabled,
          flat_rate_amount: data.flat_rate_amount || 0,
          weight_based_enabled: data.weight_based_enabled,
          free_shipping_enabled: data.free_shipping_enabled,
          free_shipping_minimum: data.free_shipping_minimum || 0,
        });
      }
    } catch (err) {
      console.error("Exception fetching shipping settings:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleAddWeightRate = () => {
    const newRate = {
      id: Date.now().toString(),
      min_weight: 0,
      max_weight: 10,
      rate: 5,
    };
    setWeightRates([...weightRates, newRate]);
  };

  const handleUpdateWeightRate = (id: string, field: string, value: number) => {
    setWeightRates(
      weightRates.map(rate => 
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    );
  };

  const handleRemoveWeightRate = (id: string) => {
    setWeightRates(weightRates.filter(rate => rate.id !== id));
  };

  const onSubmit = async (values: FormValues) => {
    if (!settings?.id) return;
    
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...values,
        weight_based_rates: weightRates,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from("shipping_settings")
        .update(updatedSettings)
        .eq("id", settings.id);
      
      if (error) {
        console.error("Error updating shipping settings:", error);
        toast.error("Failed to save shipping settings");
      } else {
        toast.success("Shipping settings saved successfully");
      }
    } catch (err) {
      console.error("Exception saving shipping settings:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToBuilder = () => {
    navigate(`/builder/${id}`);
  };

  if (isLoading || loadingSettings) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipping settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToBuilder}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shipping Settings</h1>
              <p className="text-gray-500">Configure how shipping is calculated for your store</p>
            </div>
            <TruckIcon className="w-8 h-8 text-gray-400" />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="flat-rate" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="flat-rate">Flat Rate</TabsTrigger>
                  <TabsTrigger value="weight-based">Weight Based</TabsTrigger>
                  <TabsTrigger value="free-shipping">Free Shipping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="flat-rate" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flat Rate Shipping</CardTitle>
                      <CardDescription>
                        Charge a fixed rate for all orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="flat_rate_enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable Flat Rate Shipping
                                </FormLabel>
                                <FormDescription>
                                  Charge the same shipping fee for all orders
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("flat_rate_enabled") && (
                          <FormField
                            control={form.control}
                            name="flat_rate_amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Flat Rate Amount</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      className="pl-7"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  The fixed amount to charge for shipping
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="weight-based" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weight Based Shipping</CardTitle>
                      <CardDescription>
                        Calculate shipping based on the total weight of the order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="weight_based_enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable Weight Based Shipping
                                </FormLabel>
                                <FormDescription>
                                  Charge shipping based on the total weight of the items
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("weight_based_enabled") && (
                          <div className="space-y-4">
                            <div className="rounded-lg border">
                              <div className="bg-gray-50 p-4 rounded-t-lg border-b">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-4 font-medium">Weight Range (lb)</div>
                                  <div className="col-span-4 font-medium">Rate ($)</div>
                                  <div className="col-span-4 font-medium text-right">Actions</div>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                {weightRates.length === 0 ? (
                                  <p className="text-gray-500 text-center py-4">
                                    No weight rates defined. Add one below.
                                  </p>
                                ) : (
                                  weightRates.map((rate) => (
                                    <div key={rate.id} className="grid grid-cols-12 gap-2 items-center">
                                      <div className="col-span-4 flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.1"
                                          value={rate.min_weight}
                                          onChange={(e) => handleUpdateWeightRate(
                                            rate.id, 
                                            'min_weight',
                                            parseFloat(e.target.value) || 0
                                          )}
                                          className="w-20"
                                        />
                                        <span>to</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.1"
                                          value={rate.max_weight}
                                          onChange={(e) => handleUpdateWeightRate(
                                            rate.id, 
                                            'max_weight',
                                            parseFloat(e.target.value) || 0
                                          )}
                                          className="w-20"
                                        />
                                      </div>
                                      <div className="col-span-4">
                                        <div className="relative">
                                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                          <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-7"
                                            value={rate.rate}
                                            onChange={(e) => handleUpdateWeightRate(
                                              rate.id, 
                                              'rate',
                                              parseFloat(e.target.value) || 0
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-span-4 flex justify-end">
                                        <Button 
                                          type="button" 
                                          variant="destructive" 
                                          size="sm"
                                          onClick={() => handleRemoveWeightRate(rate.id)}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                )}
                                
                                <div className="pt-4">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleAddWeightRate}
                                    className="w-full"
                                  >
                                    Add Weight Range
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="free-shipping" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Free Shipping</CardTitle>
                      <CardDescription>
                        Set up free shipping for all orders or above a minimum amount
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="free_shipping_enabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable Free Shipping
                                </FormLabel>
                                <FormDescription>
                                  Offer free shipping for qualifying orders
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("free_shipping_enabled") && (
                          <FormField
                            control={form.control}
                            name="free_shipping_minimum"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Order Amount</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      className="pl-7"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Orders above this amount will qualify for free shipping. Set to 0 for free shipping on all orders.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>Save Shipping Settings</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettings;
