
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSaveManager } from '@/hooks/useSaveManager';

interface WeightBasedRate {
  id: string;
  minWeight: number;
  maxWeight: number;
  rate: number;
}

interface ShippingSettings {
  flatRateEnabled: boolean;
  flatRateAmount: number;
  weightBasedEnabled: boolean;
  weightBasedRates: WeightBasedRate[];
  freeShippingEnabled: boolean;
  freeShippingMinimum: number;
}

interface ShippingSettingsManagerProps {
  onBackToBuilder?: () => void;
}

const ShippingSettingsManager: React.FC<ShippingSettingsManagerProps> = ({ onBackToBuilder }) => {
  const { id: websiteId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ShippingSettings>({
    flatRateEnabled: false,
    flatRateAmount: 0,
    weightBasedEnabled: false,
    weightBasedRates: [],
    freeShippingEnabled: false,
    freeShippingMinimum: 0,
  });

  const saveManager = useSaveManager({
    onSave: async () => {
      if (!websiteId) return false;

      try {
        const settingsData = {
          website_id: websiteId,
          flat_rate_enabled: settings.flatRateEnabled,
          flat_rate_amount: settings.flatRateAmount,
          weight_based_enabled: settings.weightBasedEnabled,
          weight_based_rates: settings.weightBasedRates as any,
          free_shipping_enabled: settings.freeShippingEnabled,
          free_shipping_minimum: settings.freeShippingMinimum,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('shipping_settings')
          .upsert(settingsData, {
            onConflict: 'website_id'
          });

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error saving shipping settings:', error);
        return false;
      }
    }
  });

  useEffect(() => {
    if (websiteId) {
      fetchShippingSettings();
    }
  }, [websiteId]);

  const fetchShippingSettings = async () => {
    try {
      setLoading(true);
      console.log("Fetching shipping settings for website:", websiteId);
      
      const { data, error } = await supabase
        .from('shipping_settings')
        .select('*')
        .eq('website_id', websiteId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        console.log("Shipping settings data:", data);
        setSettings({
          flatRateEnabled: data.flat_rate_enabled,
          flatRateAmount: data.flat_rate_amount || 0,
          weightBasedEnabled: data.weight_based_enabled,
          weightBasedRates: Array.isArray(data.weight_based_rates) ? data.weight_based_rates as unknown as WeightBasedRate[] : [],
          freeShippingEnabled: data.free_shipping_enabled,
          freeShippingMinimum: data.free_shipping_minimum || 0,
        });
      } else {
        console.log("No shipping settings found, using defaults");
      }
    } catch (error: any) {
      console.error('Error fetching shipping settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<ShippingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    saveManager.markAsUnsaved();
  };

  const addWeightBasedRate = () => {
    const newRate: WeightBasedRate = {
      id: Math.random().toString(36).substr(2, 9),
      minWeight: 0,
      maxWeight: 1,
      rate: 0,
    };
    updateSettings({
      weightBasedRates: [...settings.weightBasedRates, newRate],
    });
  };

  const removeWeightBasedRate = (id: string) => {
    updateSettings({
      weightBasedRates: settings.weightBasedRates.filter(rate => rate.id !== id),
    });
  };

  const updateWeightBasedRate = (id: string, field: keyof Omit<WeightBasedRate, 'id'>, value: number) => {
    updateSettings({
      weightBasedRates: settings.weightBasedRates.map(rate =>
        rate.id === id ? { ...rate, [field]: value } : rate
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToBuilder && (
              <Button variant="outline" size="sm" onClick={onBackToBuilder}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold">Shipping Settings</h2>
            </div>
            
            {saveManager.getSaveStatus() && (
              <span className={`text-sm ${
                saveManager.hasUnsavedChanges ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {saveManager.getSaveStatus()}
              </span>
            )}
          </div>
          
          <Button onClick={saveManager.save} disabled={saveManager.isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {saveManager.isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
        {/* Flat Rate Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Flat Rate Shipping</CardTitle>
                <CardDescription>
                  Charge a fixed shipping rate for all orders
                </CardDescription>
              </div>
              <Switch
                checked={settings.flatRateEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ flatRateEnabled: checked })
                }
              />
            </div>
          </CardHeader>
          {settings.flatRateEnabled && (
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="flatRate">Shipping Rate ($)</Label>
                <Input
                  id="flatRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.flatRateAmount}
                  onChange={(e) =>
                    updateSettings({ flatRateAmount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
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
                <CardDescription>
                  Set different shipping rates based on product weight
                </CardDescription>
              </div>
              <Switch
                checked={settings.weightBasedEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ weightBasedEnabled: checked })
                }
              />
            </div>
          </CardHeader>
          {settings.weightBasedEnabled && (
            <CardContent className="space-y-4">
              {settings.weightBasedRates.map((rate, index) => (
                <div key={rate.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Rate #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWeightBasedRate(rate.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Min Weight (lbs)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={rate.minWeight}
                        onChange={(e) =>
                          updateWeightBasedRate(rate.id, 'minWeight', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label>Max Weight (lbs)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={rate.maxWeight}
                        onChange={(e) =>
                          updateWeightBasedRate(rate.id, 'maxWeight', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label>Shipping Rate ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate.rate}
                        onChange={(e) =>
                          updateWeightBasedRate(rate.id, 'rate', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addWeightBasedRate}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Weight Range
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Free Shipping */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Free Shipping</CardTitle>
                <CardDescription>
                  Offer free shipping for orders above a minimum amount
                </CardDescription>
              </div>
              <Switch
                checked={settings.freeShippingEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ freeShippingEnabled: checked })
                }
              />
            </div>
          </CardHeader>
          {settings.freeShippingEnabled && (
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="freeShippingMin">Minimum Order Amount ($)</Label>
                <Input
                  id="freeShippingMin"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.freeShippingMinimum}
                  onChange={(e) =>
                    updateSettings({ freeShippingMinimum: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Shipping Method Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method Priority</CardTitle>
            <CardDescription>
              When multiple shipping methods are enabled, they are applied in this order:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Free shipping (if order meets minimum requirement)</li>
              <li>Weight-based shipping (if product weight matches a range)</li>
              <li>Flat rate shipping (as fallback)</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingSettingsManager;
