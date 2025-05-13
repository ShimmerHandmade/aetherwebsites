
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useWebsite } from "@/hooks/useWebsite";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function to ensure URLs are properly formatted
const formatUrl = (url: string) => {
  if (!url) return url;
  
  // If it's an absolute URL already (starts with http:// or https://), return as is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  
  // If it starts with a slash, prepend the current website domain
  if (url.startsWith('/')) {
    const origin = window.location.origin;
    return `${origin}${url}`;
  }
  
  // Otherwise, add https:// prefix
  return `https://${url}`;
};

const BuilderPageSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading,
    websiteName,
    pageSettings,
    saveWebsite
  } = useWebsite(id, navigate);

  const [title, setTitle] = useState<string>(pageSettings?.title || websiteName || '');
  const [description, setDescription] = useState<string>(pageSettings?.description || '');
  const [keywords, setKeywords] = useState<string>(pageSettings?.keywords || '');
  const [indexable, setIndexable] = useState<boolean>(pageSettings?.indexable !== false);
  const [ogTitle, setOgTitle] = useState<string>(pageSettings?.ogTitle || '');
  const [ogDescription, setOgDescription] = useState<string>(pageSettings?.ogDescription || '');
  const [ogImage, setOgImage] = useState<string>(pageSettings?.ogImage || '');
  const [canonical, setCanonical] = useState<string>(pageSettings?.canonical || '');
  const [isSaving, setIsSaving] = useState(false);

  // Update state when pageSettings changes
  useEffect(() => {
    if (pageSettings) {
      setTitle(pageSettings.title || websiteName || '');
      setDescription(pageSettings.description || '');
      setKeywords(pageSettings.keywords || '');
      setIndexable(pageSettings.indexable !== false);
      setOgTitle(pageSettings.ogTitle || '');
      setOgDescription(pageSettings.ogDescription || '');
      setOgImage(pageSettings.ogImage || '');
      setCanonical(pageSettings.canonical || '');
    }
  }, [pageSettings, websiteName]);

  // URL formatting handlers
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const formattedUrl = formatUrl(e.target.value);
    if (formattedUrl !== e.target.value) {
      setter(formattedUrl);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedPageSettings = {
        ...pageSettings,
        title,
        description,
        keywords,
        indexable,
        ogTitle,
        ogDescription,
        ogImage,
        canonical: formatUrl(canonical)
      };
      
      await saveWebsite(website?.content || [], updatedPageSettings);
      toast.success("Page settings saved successfully");
    } catch (error) {
      console.error("Error saving page settings:", error);
      toast.error("Failed to save page settings");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Page Settings - {websiteName}</h1>
          
          <Tabs defaultValue="general" className="w-full max-w-3xl">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="page-title" className="text-sm font-medium">Page Title</Label>
                    <Input 
                      id="page-title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The title that appears in the browser tab
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-description" className="text-sm font-medium">Meta Description</Label>
                    <TextArea 
                      id="page-description" 
                      placeholder="A brief description of this page for search engines"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Important for SEO, appears in search engine results
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-keywords" className="text-sm font-medium">Meta Keywords</Label>
                    <Input 
                      id="page-keywords" 
                      placeholder="keyword1, keyword2, keyword3"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Comma-separated list of keywords relevant to the page
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center space-x-2 pt-2 mb-4">
                    <Switch 
                      id="indexing" 
                      checked={indexable} 
                      onCheckedChange={setIndexable}
                    />
                    <Label htmlFor="indexing" className="text-sm font-medium">
                      Allow search engines to index this page
                    </Label>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="canonical-url" className="text-sm font-medium">Canonical URL</Label>
                    <div className="relative">
                      <Input 
                        id="canonical-url" 
                        placeholder="https://example.com/page"
                        value={canonical}
                        onChange={(e) => setCanonical(e.target.value)}
                        onBlur={(e) => handleUrlBlur(e, setCanonical)}
                        className="border border-gray-300 pr-10"
                      />
                      <ExternalLink className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Specify the preferred URL for this page to avoid duplicate content issues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="og-title" className="text-sm font-medium">Social Title</Label>
                    <Input 
                      id="og-title" 
                      placeholder="Title for social media sharing"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Title that appears when shared on social media
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-description" className="text-sm font-medium">Social Description</Label>
                    <TextArea 
                      id="og-description" 
                      placeholder="Description for social media sharing"
                      rows={3}
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      className="border border-gray-300"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Description that appears when shared on social media
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-image" className="text-sm font-medium">Social Image URL</Label>
                    <div className="relative">
                      <Input 
                        id="og-image" 
                        placeholder="https://example.com/image.jpg"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        onBlur={(e) => handleUrlBlur(e, setOgImage)}
                        className="border border-gray-300 pr-10"
                      />
                      <ExternalLink className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 1200 x 630 pixels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="pt-6">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Page Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPageSettings;
