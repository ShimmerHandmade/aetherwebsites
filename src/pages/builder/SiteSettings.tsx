
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Home, Globe, Check, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWebsite } from "@/hooks/useWebsite";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePlan } from "@/contexts/PlanContext";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const SiteSettings = () => {
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
  const [siteDescription, setSiteDescription] = useState(website?.settings?.description || '');
  const [socialImage, setSocialImage] = useState(website?.settings?.socialImage || '');
  
  const { planName, isPremium, isEnterprise } = usePlan();
  const canUseCustomDomain = isPremium || isEnterprise;
  
  React.useEffect(() => {
    setLocalWebsiteName(websiteName);
    setLogoUrl(website?.settings?.logoUrl || '');
    setCustomDomain(website?.settings?.customDomain || '');
    setEnableCustomDomain(Boolean(website?.settings?.customDomainEnabled));
    setSiteDescription(website?.settings?.description || '');
    setSocialImage(website?.settings?.socialImage || '');
  }, [websiteName, website?.settings]);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (enableCustomDomain && customDomain && !validateDomain(customDomain)) {
        toast.error("Please enter a valid domain name");
        setIsSaving(false);
        return;
      }
      
      setWebsiteName(localWebsiteName);
      
      await saveWebsite(
        website?.content || [], 
        website?.pageSettings || {}, 
        { 
          logoUrl: logoUrl,
          customDomain: customDomain,
          customDomainEnabled: enableCustomDomain,
          description: siteDescription,
          socialImage: socialImage
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

  const netlifyDeployUrl = `https://site-${id}.netlify.app`;
  const lovableViewUrl = `/view/${id}`;

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
            onClick={() => navigate('/dashboard')}
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
            <TabsTrigger value="domain">Domain & Hosting</TabsTrigger>
            <TabsTrigger value="seo">SEO & Social</TabsTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea 
                    id="site-description" 
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="A brief description of your website"
                    className="max-w-md"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    This description may be used by search engines and social media platforms.
                  </p>
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
                      Enter the URL of your logo image. This will be displayed in your site's header.
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
                <CardTitle>Domain & Hosting</CardTitle>
                <CardDescription>Configure your website's domain and hosting settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">Current Website URL</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-mono text-blue-700">{lovableViewUrl}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(lovableViewUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enable-custom-domain" 
                        checked={enableCustomDomain} 
                        onCheckedChange={setEnableCustomDomain} 
                        disabled={!canUseCustomDomain}
                      />
                      <Label htmlFor="enable-custom-domain">Enable custom domain with Netlify</Label>
                    </div>

                    {!canUseCustomDomain && (
                      <Alert variant="default" className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-700">Premium Feature</AlertTitle>
                        <AlertDescription className="text-amber-600">
                          Custom domains are only available with Professional or Enterprise plans.
                        </AlertDescription>
                      </Alert>
                    )}

                    {enableCustomDomain && canUseCustomDomain && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="custom-domain">Custom Domain</Label>
                          <div className="flex items-center space-x-2 max-w-md">
                            <span className="text-gray-500">https://</span>
                            <Input 
                              id="custom-domain" 
                              value={customDomain}
                              onChange={(e) => setCustomDomain(e.target.value)}
                              placeholder="yourdomain.com" 
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md border space-y-4">
                          <h4 className="text-sm font-medium">Netlify Deployment Setup</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">1. Your website will be deployed to Netlify at:</p>
                              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                <code className="text-sm text-blue-600">{netlifyDeployUrl}</code>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(netlifyDeployUrl)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-2">2. Configure your custom domain in Netlify:</p>
                              <div className="space-y-2 text-sm">
                                <p>• Go to your Netlify site settings</p>
                                <p>• Add your custom domain: <code className="bg-white px-1 rounded">{customDomain || 'yourdomain.com'}</code></p>
                                <p>• Netlify will provide DNS records to configure</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-2">3. Update your DNS settings:</p>
                              <div className="bg-white p-3 rounded border space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-mono">CNAME</span>
                                  <span className="font-mono">@</span>
                                  <span className="font-mono text-blue-600">{netlifyDeployUrl.replace('https://', '')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-mono">CNAME</span>
                                  <span className="font-mono">www</span>
                                  <span className="font-mono text-blue-600">{netlifyDeployUrl.replace('https://', '')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Alert variant="default" className="bg-blue-50 border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <AlertTitle className="text-blue-700">Netlify Integration</AlertTitle>
                            <AlertDescription className="text-blue-600">
                              Your site will be automatically deployed to Netlify with each update. 
                              DNS changes can take up to 24-48 hours to propagate.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Social Media</CardTitle>
                <CardDescription>Optimize your website for search engines and social sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social-image">Social Media Image URL</Label>
                  <Input 
                    id="social-image" 
                    value={socialImage}
                    onChange={(e) => setSocialImage(e.target.value)}
                    placeholder="https://example.com/social-image.jpg"
                    className="max-w-md"
                  />
                  <p className="text-sm text-gray-500">
                    Image that appears when your site is shared on social media. Recommended size: 1200x630px.
                  </p>
                </div>
                
                {socialImage && (
                  <div className="rounded-md border border-gray-200 p-4 max-w-md">
                    <p className="text-sm font-medium mb-2">Social Image Preview:</p>
                    <img 
                      src={socialImage} 
                      alt="Social Media Preview" 
                      className="max-h-32 max-w-full rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        toast.error("Failed to load social image");
                      }}
                    />
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

export default SiteSettings;
