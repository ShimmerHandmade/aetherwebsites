
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, X, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { WeightBasedRate } from "@/types/general";

// Define proper types
interface ShippingSettings {
  id?: string;
  website_id: string;
  flat_rate_enabled: boolean;
  flat_rate_amount: number;
  weight_based_enabled: boolean;
  weight_based_rates: WeightBasedRate[];
  free_shipping_enabled: boolean;
  free_shipping_minimum: number;
  created_at?: string;
  updated_at: string;
}

// Fix the loadSettings function
const loadSettings = async (websiteId: string) => {
  try {
    const { data, error } = await supabase
      .from('shipping_settings')
      .select('*')
      .eq('website_id', websiteId)
      .single();
      
    if (error) {
      console.error('Error fetching shipping settings:', error);
      return null;
    }
    
    // Parse weight_based_rates if it's a JSON string
    if (data) {
      let parsedRates: WeightBasedRate[] = [];
      
      if (typeof data.weight_based_rates === 'string') {
        try {
          parsedRates = JSON.parse(data.weight_based_rates);
        } catch (e) {
          console.warn('Failed to parse weight_based_rates JSON', e);
        }
      } else if (Array.isArray(data.weight_based_rates)) {
        // Convert Json[] to WeightBasedRate[] with appropriate type casting
        parsedRates = (data.weight_based_rates as Json[] || []).map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              min: typeof (item as any).min === 'number' ? (item as any).min : 
                   typeof (item as any).min_weight === 'number' ? (item as any).min_weight : 0,
              max: typeof (item as any).max === 'number' ? (item as any).max : 
                   typeof (item as any).max_weight === 'number' ? (item as any).max_weight : 0,
              rate: typeof (item as any).rate === 'number' ? (item as any).rate : 0,
              min_weight: typeof (item as any).min_weight === 'number' ? (item as any).min_weight : 
                          typeof (item as any).min === 'number' ? (item as any).min : 0,
              max_weight: typeof (item as any).max_weight === 'number' ? (item as any).max_weight : 
                          typeof (item as any).max === 'number' ? (item as any).max : 0,
            };
          }
          return { min: 0, max: 0, rate: 0, min_weight: 0, max_weight: 0 };
        });
      }
      
      return {
        ...data,
        weight_based_rates: parsedRates
      } as ShippingSettings;
    }
    
    return null;
  } catch (error) {
    console.error('Error in loadSettings:', error);
    return null;
  }
};

const ShippingSettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [existingSettings, setExistingSettings] = useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for settings form
  const [settings, setSettings] = useState({
    flat_rate_enabled: false,
    flat_rate_amount: 5,
    weight_based_enabled: false,
    free_shipping_enabled: false,
    free_shipping_minimum: 50
  });
  
  // State for weight-based rates
  const [weightRates, setWeightRates] = useState<WeightBasedRate[]>([]);
  
  // Initialize form with existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await loadSettings(id);
        
        if (data) {
          setExistingSettings(data);
          setSettings({
            flat_rate_enabled: data.flat_rate_enabled,
            flat_rate_amount: data.flat_rate_amount || 5,
            weight_based_enabled: data.weight_based_enabled,
            free_shipping_enabled: data.free_shipping_enabled,
            free_shipping_minimum: data.free_shipping_minimum || 50
          });
          
          // Ensure weight_based_rates is an array
          const rates = Array.isArray(data.weight_based_rates) 
            ? data.weight_based_rates 
            : [];
            
          setWeightRates(rates);
        } else {
          // Set default values if no settings found
          setWeightRates([{ min_weight: 0, max_weight: 1, rate: 5 }]);
        }
      } catch (error) {
        console.error("Error fetching shipping settings:", error);
        toast.error("Failed to load shipping settings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [id]);
  
  const handleAddWeightRate = () => {
    const lastRate = weightRates[weightRates.length - 1];
    const newRate = {
      min_weight: lastRate ? lastRate.max_weight : 0,
      max_weight: lastRate ? lastRate.max_weight + 1 : 1,
      rate: 5
    };
    setWeightRates([...weightRates, newRate]);
  };
  
  const handleRemoveWeightRate = (index: number) => {
    const newRates = [...weightRates];
    newRates.splice(index, 1);
    setWeightRates(newRates);
  };
  
  const handleWeightRateChange = (index: number, field: keyof WeightBasedRate, value: number) => {
    const newRates = [...weightRates];
    newRates[index] = { ...newRates[index], [field]: value };
    setWeightRates(newRates);
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Convert rates to a format suitable for storage
      const dataToSave = {
        website_id: id,
        flat_rate_enabled: settings.flat_rate_enabled,
        flat_rate_amount: settings.flat_rate_amount,
        weight_based_enabled: settings.weight_based_enabled,
        weight_based_rates: JSON.stringify(weightRates),
        free_shipping_enabled: settings.free_shipping_enabled,
        free_shipping_minimum: settings.free_shipping_minimum,
        updated_at: new Date().toISOString()
      };
      
      if (existingSettings?.id) {
        const { error } = await supabase
          .from('shipping_settings')
          .update(dataToSave)
          .eq('id', existingSettings.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipping_settings')
          .insert([dataToSave]);
          
        if (error) throw error;
      }
      
      toast.success('Shipping settings saved successfully');
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      toast.error('Failed to save shipping settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleBackClick = () => {
    navigate(`/builder/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p>Loading shipping settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="outline" size="sm" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Builder
          </Button>
          <h1 className="text-3xl font-bold">Shipping Settings</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-8">
            {/* Flat Rate Shipping */}
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Flat Rate Shipping</h2>
              <div className="flex items-center mb-4">
                <Switch 
                  id="flat-rate-enabled" 
                  checked={settings.flat_rate_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, flat_rate_enabled: checked})}
                />
                <Label htmlFor="flat-rate-enabled" className="ml-2">
                  Enable Flat Rate Shipping
                </Label>
              </div>
              
              {settings.flat_rate_enabled && (
                <div className="mt-4">
                  <Label htmlFor="flat-rate-amount">Flat Rate Amount ($)</Label>
                  <Input 
                    id="flat-rate-amount"
                    type="number"
                    className="w-full md:w-1/3 mt-1"
                    value={settings.flat_rate_amount}
                    onChange={(e) => setSettings({...settings, flat_rate_amount: parseFloat(e.target.value) || 0})}
                    min={0}
                    step={0.01}
                  />
                </div>
              )}
            </Card>
            
            {/* Weight-based Shipping */}
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Weight-Based Shipping</h2>
              <div className="flex items-center mb-4">
                <Switch 
                  id="weight-based-enabled" 
                  checked={settings.weight_based_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, weight_based_enabled: checked})}
                />
                <Label htmlFor="weight-based-enabled" className="ml-2">
                  Enable Weight-Based Shipping
                </Label>
              </div>
              
              {settings.weight_based_enabled && (
                <div className="mt-4">
                  <div className="grid grid-cols-12 gap-4 font-medium mb-2 text-sm">
                    <div className="col-span-5 md:col-span-4">Minimum Weight (lbs)</div>
                    <div className="col-span-5 md:col-span-4">Maximum Weight (lbs)</div>
                    <div className="col-span-2 md:col-span-3">Rate ($)</div>
                    <div className="col-span-0 md:col-span-1"></div>
                  </div>
                  
                  {weightRates.map((rate, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                      <div className="col-span-5 md:col-span-4">
                        <Input 
                          type="number" 
                          value={rate.min_weight}
                          onChange={(e) => handleWeightRateChange(index, 'min_weight', parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.1}
                        />
                      </div>
                      <div className="col-span-5 md:col-span-4">
                        <Input 
                          type="number" 
                          value={rate.max_weight}
                          onChange={(e) => handleWeightRateChange(index, 'max_weight', parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.1}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <Input 
                          type="number" 
                          value={rate.rate}
                          onChange={(e) => handleWeightRateChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <div className="hidden md:block md:col-span-1">
                        {weightRates.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveWeightRate(index)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddWeightRate}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Weight Range
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Configure shipping rates based on the weight of the order. Each range should be continuous (the max of one range should equal the min of the next).
                  </p>
                </div>
              )}
            </Card>
            
            {/* Free Shipping */}
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Free Shipping</h2>
              <div className="flex items-center mb-4">
                <Switch 
                  id="free-shipping-enabled" 
                  checked={settings.free_shipping_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, free_shipping_enabled: checked})}
                />
                <Label htmlFor="free-shipping-enabled" className="ml-2">
                  Enable Free Shipping
                </Label>
              </div>
              
              {settings.free_shipping_enabled && (
                <div className="mt-4">
                  <Label htmlFor="free-shipping-minimum">Minimum Order Amount for Free Shipping ($)</Label>
                  <Input 
                    id="free-shipping-minimum"
                    type="number"
                    className="w-full md:w-1/3 mt-1"
                    value={settings.free_shipping_minimum}
                    onChange={(e) => setSettings({...settings, free_shipping_minimum: parseFloat(e.target.value) || 0})}
                    min={0}
                    step={0.01}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Orders with a subtotal equal to or greater than this amount will qualify for free shipping.
                  </p>
                </div>
              )}
            </Card>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleBackClick} 
                className="mr-2"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettingsPage;
