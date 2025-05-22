
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WeightBasedRate, ShippingSettings as ShippingSettingsType } from '@/types/general';

const ShippingSettings = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Define proper initial state with correct types
  const initialSettings: ShippingSettingsType = {
    flat_rate_enabled: false,
    flat_rate_amount: 0,
    weight_based_enabled: false,
    weight_based_rates: [],
    free_shipping_enabled: false,
    free_shipping_minimum: 0,
  };
  
  const [settings, setSettings] = useState<ShippingSettingsType>(initialSettings);
  const [weightRates, setWeightRates] = useState<WeightBasedRate[]>([]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Check if settings exist
        const { data, error } = await supabase
          .from('shipping_settings')
          .select('*')
          .eq('website_id', id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          // Parse weight_based_rates from JSON if needed
          let parsedWeightRates: WeightBasedRate[] = [];
          
          if (data.weight_based_rates) {
            try {
              if (typeof data.weight_based_rates === 'string') {
                parsedWeightRates = JSON.parse(data.weight_based_rates);
              } else if (Array.isArray(data.weight_based_rates)) {
                parsedWeightRates = data.weight_based_rates;
              }
            } catch (e) {
              console.error("Error parsing weight_based_rates:", e);
              parsedWeightRates = [];
            }
          }
          
          setSettings({
            flat_rate_enabled: data.flat_rate_enabled,
            flat_rate_amount: data.flat_rate_amount,
            weight_based_enabled: data.weight_based_enabled,
            weight_based_rates: [],
            free_shipping_enabled: data.free_shipping_enabled,
            free_shipping_minimum: data.free_shipping_minimum,
          });
          
          setWeightRates(parsedWeightRates);
        }
      } catch (error) {
        console.error("Error fetching shipping settings:", error);
        toast.error("Failed to load shipping settings");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [id]);
  
  const addWeightRate = () => {
    setWeightRates([...weightRates, { min: 0, max: 5, rate: 5 }]);
  };
  
  const removeWeightRate = (index: number) => {
    const newRates = [...weightRates];
    newRates.splice(index, 1);
    setWeightRates(newRates);
  };
  
  const updateWeightRate = (index: number, field: keyof WeightBasedRate, value: number) => {
    const newRates = [...weightRates];
    newRates[index] = { ...newRates[index], [field]: value };
    setWeightRates(newRates);
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Convert weightRates to a format that can be stored in Supabase
      const weightRatesJson = weightRates;
      
      // Prepare the data to save
      const dataToSave = {
        website_id: id,
        flat_rate_enabled: settings.flat_rate_enabled,
        flat_rate_amount: settings.flat_rate_amount,
        weight_based_enabled: settings.weight_based_enabled,
        weight_based_rates: weightRatesJson,
        free_shipping_enabled: settings.free_shipping_enabled,
        free_shipping_minimum: settings.free_shipping_minimum,
        updated_at: new Date().toISOString()
      };
      
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('shipping_settings')
        .select('id')
        .eq('website_id', id)
        .single();
      
      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('shipping_settings')
          .update(dataToSave)
          .eq('id', existingSettings.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('shipping_settings')
          .insert([dataToSave]);
      }
      
      if (result.error) throw result.error;
      
      toast.success('Shipping settings saved');
    } catch (error) {
      console.error("Error saving shipping settings:", error);
      toast.error("Failed to save shipping settings");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading shipping settings...</span>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Shipping Settings</h1>
      
      <div className="grid gap-8">
        {/* Flat Rate Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Flat Rate Shipping</CardTitle>
                <CardDescription>Charge a fixed amount for shipping regardless of order size or weight</CardDescription>
              </div>
              <Switch 
                checked={settings.flat_rate_enabled}
                onCheckedChange={(checked) => setSettings({...settings, flat_rate_enabled: checked})}
              />
            </div>
          </CardHeader>
          {settings.flat_rate_enabled && (
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="flat-rate-amount" className="col-span-2">Flat Rate Amount ($)</Label>
                  <div className="col-span-2">
                    <Input 
                      id="flat-rate-amount"
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={settings.flat_rate_amount}
                      onChange={(e) => setSettings({...settings, flat_rate_amount: Number(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Weight-Based Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weight-Based Shipping</CardTitle>
                <CardDescription>Set shipping rates based on the total weight of products in an order</CardDescription>
              </div>
              <Switch 
                checked={settings.weight_based_enabled}
                onCheckedChange={(checked) => setSettings({...settings, weight_based_enabled: checked})}
              />
            </div>
          </CardHeader>
          {settings.weight_based_enabled && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                  <div className="col-span-4">Min Weight (lbs)</div>
                  <div className="col-span-4">Max Weight (lbs)</div>
                  <div className="col-span-3">Rate ($)</div>
                  <div className="col-span-1"></div>
                </div>
                
                {weightRates.map((rate, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <Input 
                        type="number"
                        min="0"
                        step="0.1"
                        value={rate.min}
                        onChange={(e) => updateWeightRate(index, 'min', Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input 
                        type="number"
                        min="0"
                        step="0.1"
                        value={rate.max}
                        onChange={(e) => updateWeightRate(index, 'max', Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate.rate}
                        onChange={(e) => updateWeightRate(index, 'rate', Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWeightRate(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addWeightRate}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Weight Range
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Free Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Free Shipping</CardTitle>
                <CardDescription>Offer free shipping over a certain order amount</CardDescription>
              </div>
              <Switch 
                checked={settings.free_shipping_enabled}
                onCheckedChange={(checked) => setSettings({...settings, free_shipping_enabled: checked})}
              />
            </div>
          </CardHeader>
          {settings.free_shipping_enabled && (
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="free-shipping-minimum" className="col-span-2">Minimum Order Amount ($)</Label>
                  <div className="col-span-2">
                    <Input 
                      id="free-shipping-minimum"
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={settings.free_shipping_minimum}
                      onChange={(e) => setSettings({...settings, free_shipping_minimum: Number(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving} className="min-w-[120px]">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettings;
