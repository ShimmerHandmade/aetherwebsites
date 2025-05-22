import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Home, Globe, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWebsite } from "@/hooks/useWebsite";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePlan } from "@/contexts/PlanContext";
import { Switch } from "@/components/ui/switch";

const BuilderSiteSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName, 
    setWebsiteName, 
    saveWebsite 
  } = useWebsite(id, navigate);
  
  const [localWebsiteName, setLocalWebsiteName] = useState(websiteName);
  const [logoUrl, setLogoUrl] = useState(website?.settings?.logoUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState(website?.settings?.customDomain || '');
  const [enableCustomDomain, setEnableCustomDomain] = useState(Boolean(website?.settings?.customDomainEnabled));
  
  const { planName, isPremium, isEnterprise } = usePlan();
  const canUseCustomDomain = isPremium || isEnterprise;
  
  // Update local state when website data from hook changes
  React.useEffect(() => {
    setLocalWebsiteName(websiteName);
    setLogoUrl(website?.settings?.logoUrl || '');
    setCustomDomain(website?.settings?.customDomain || '');
    setEnableCustomDomain(Boolean(website?.settings?.customDomainEnabled));
  }, [websiteName, website?.settings]);

  const validateDomain = (domain: string): boolean => {
    // Simple domain validation regex
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate the domain if custom domain is enabled
      if (enableCustomDomain && customDomain && !validateDomain(customDomain)) {
        toast.error("Please enter a valid domain name");
        setIsSaving(false);
        return;
      }
      
      // Update the website name in the parent hook
      setWebsiteName(localWebsiteName);
      
      // This will save the current state with updated settings
      await saveWebsite(
        website?.content || [], 
        website?.pageSettings || {}, 
        { 
          logoUrl: logoUrl,
          customDomain: customDomain,
          customDomainEnabled: enableCustomDomain
        }
      );
      
      toast.success("Site settings saved successfully");
    } catch (error) {
      console.error("Error saving site settings:", error);
      toast.error("Failed to save site settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReturnToDashboard}
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4 mr-1" />
            Return to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white border rounded-md p-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Website Name</Label>
                  <Input 
                    id="site-name" 
                    value={localWebsiteName} 
                    onChange={(e) => setLocalWebsiteName(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize your website's visual identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <div className="flex gap-2 items-center mt-1.5">
                      <Input 
                        id="logo-url" 
                        value={logoUrl} 
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="max-w-md"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the URL of your logo image. This will be displayed in your site's header and footer.
                    </p>
                  </div>
                  
                  {logoUrl && (
                    <div className="rounded-md border border-gray-200 p-4 max-w-xs">
                      <p className="text-sm font-medium mb-2">Logo Preview:</p>
                      <img 
                        src={logoUrl} 
                        alt="Website Logo" 
                        className="max-h-20 max-w-full"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          toast.error("Failed to load logo image");
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="domain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain Settings</CardTitle>
                <CardDescription>Configure your website's custom domain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canUseCustomDomain && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Premium Feature</AlertTitle>
                    <AlertDescription>
                      Custom domains are only available with Professional or Enterprise plans. 
                      Please upgrade your plan to use this feature.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    id="enable-custom-domain" 
                    checked={enableCustomDomain} 
                    onCheckedChange={setEnableCustomDomain} 
                    disabled={!canUseCustomDomain}
                  />
                  <Label htmlFor="enable-custom-domain">Enable custom domain</Label>
                </div>

                {enableCustomDomain && (
                  <div className="space-y-2">
                    <Label htmlFor="site-domain">Custom Domain</Label>
                    <div className="max-w-md flex items-center space-x-2">
                      <span className="text-gray-500">https://</span>
                      <Input 
                        id="site-domain" 
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="yourdomain.com" 
                        disabled={!canUseCustomDomain}
                        className="flex-1"
                      />
                    </div>
                    
                    {canUseCustomDomain && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">DNS Configuration</p>
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <p className="text-sm mb-2">To connect your custom domain, add these DNS records:</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm p-2 bg-white rounded">
                              <span className="font-mono">CNAME</span>
                              <span className="font-mono">@</span>
                              <span className="font-mono text-blue-600">custom.lovable.app</span>
                            </div>
                            <div className="flex justify-between text-sm p-2 bg-white rounded">
                              <span className="font-mono">CNAME</span>
                              <span className="font-mono">www</span>
                              <span className="font-mono text-blue-600">custom.lovable.app</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            DNS changes can take up to 24-48 hours to propagate across the internet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!enableCustomDomain && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Default Domain</p>
                        <p className="text-sm text-gray-500">
                          Your website is currently available at:
                        </p>
                        <p className="text-sm font-mono mt-1">
                          https://site-{id}.lovable.app
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderSiteSettings;
