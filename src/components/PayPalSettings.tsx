
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface PayPalSettingsProps {
  websiteId: string;
}

interface PayPalConfig {
  clientId?: string;
  enabled?: boolean;
  sandbox?: boolean;
}

interface WebsiteSettings {
  paypal?: PayPalConfig;
  [key: string]: any;
}

const PayPalSettings: React.FC<PayPalSettingsProps> = ({ websiteId }) => {
  const [paypalClientId, setPaypalClientId] = useState('');
  const [sandboxMode, setSandboxMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paypalConnected, setPaypalConnected] = useState(false);

  useEffect(() => {
    loadPayPalSettings();
  }, [websiteId]);

  const loadPayPalSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('websites')
        .select('settings')
        .eq('id', websiteId)
        .single();

      if (error) {
        console.error('Error loading PayPal settings:', error);
        return;
      }

      const settings = (data?.settings as WebsiteSettings) || {};
      if (settings.paypal) {
        setPaypalClientId(settings.paypal.clientId || '');
        setSandboxMode(settings.paypal.sandbox !== false); // Default to true
        setPaypalConnected(!!settings.paypal.clientId && !!settings.paypal.enabled);
      }
    } catch (error) {
      console.error('Error in loadPayPalSettings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePayPalSettings = async () => {
    if (!paypalClientId.trim()) {
      toast.error('PayPal Client ID is required');
      return;
    }

    try {
      setIsSaving(true);
      
      // Get current settings
      const { data: currentData, error: fetchError } = await supabase
        .from('websites')
        .select('settings')
        .eq('id', websiteId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentSettings = (currentData?.settings as WebsiteSettings) || {};
      const updatedSettings: WebsiteSettings = {
        ...currentSettings,
        paypal: {
          clientId: paypalClientId.trim(),
          enabled: true,
          sandbox: sandboxMode
        }
      };

      const { error } = await supabase
        .from('websites')
        .update({ settings: updatedSettings })
        .eq('id', websiteId);

      if (error) {
        throw error;
      }

      setPaypalConnected(true);
      toast.success('PayPal settings saved successfully');
    } catch (error) {
      console.error('Error saving PayPal settings:', error);
      toast.error('Failed to save PayPal settings');
    } finally {
      setIsSaving(false);
    }
  };

  const disconnectPayPal = async () => {
    try {
      setIsSaving(true);
      
      // Get current settings
      const { data: currentData, error: fetchError } = await supabase
        .from('websites')
        .select('settings')
        .eq('id', websiteId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentSettings = (currentData?.settings as WebsiteSettings) || {};
      const updatedSettings: WebsiteSettings = {
        ...currentSettings,
        paypal: {
          enabled: false
        }
      };

      const { error } = await supabase
        .from('websites')
        .update({ settings: updatedSettings })
        .eq('id', websiteId);

      if (error) {
        throw error;
      }

      setPaypalClientId('');
      setPaypalConnected(false);
      toast.success('PayPal disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting PayPal:', error);
      toast.error('Failed to disconnect PayPal');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PayPal Integration</CardTitle>
          <CardDescription>Connect PayPal for payment processing</CardDescription>
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
          PayPal Integration
          {paypalConnected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
        </CardTitle>
        <CardDescription>
          Connect PayPal for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paypalConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">PayPal Connected</p>
              <p className="text-green-600 text-sm">Your PayPal account is connected and ready to process payments.</p>
              <p className="text-green-600 text-sm mt-1">
                Mode: {sandboxMode ? 'Sandbox (Test)' : 'Live (Production)'}
              </p>
            </div>
            <Button 
              onClick={disconnectPayPal}
              disabled={isSaving}
              variant="outline"
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect PayPal'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
              <Input
                id="paypal-client-id"
                type="text"
                placeholder="Enter your PayPal Client ID"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Get your Client ID from the PayPal Developer Dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="sandbox-mode"
                checked={sandboxMode}
                onCheckedChange={setSandboxMode}
              />
              <Label htmlFor="sandbox-mode">Sandbox Mode (for testing)</Label>
            </div>
            
            <Button 
              onClick={savePayPalSettings}
              disabled={isSaving || !paypalClientId.trim()}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect PayPal'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayPalSettings;
