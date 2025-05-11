
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilder } from "@/contexts/BuilderContext";
import { toast } from "sonner";
import { TextArea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Globe, Settings2, Search, LayoutGrid, PenLine, Share } from "lucide-react";

const PageSettings: React.FC = () => {
  const { pageSettings, updatePageSettings } = useBuilder();
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePageSettings({ title: e.target.value });
    toast.success("Page title updated");
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePageSettings({ description: e.target.value });
    toast.success("Page description updated");
  };
  
  const handleMetadataChange = (key: string, value: string | boolean) => {
    updatePageSettings({ 
      meta: {
        ...pageSettings?.meta,
        [key]: value
      }
    });
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Page Settings</h2>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          Published
        </Badge>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-5">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input 
                  id="page-title" 
                  placeholder="Enter page title" 
                  value={pageSettings?.title || ''}
                  onChange={handleTitleChange}
                  className="border border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page-description">Description</Label>
                <TextArea 
                  id="page-description" 
                  placeholder="Enter page description" 
                  value={pageSettings?.description || ''}
                  onChange={handleDescriptionChange}
                  className="min-h-[100px] border border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="page-visibility">Page Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Control whether this page is visible on your site
                  </p>
                </div>
                <Switch 
                  id="page-visibility" 
                  checked={pageSettings?.visible !== false}
                  onCheckedChange={(checked) => updatePageSettings({ visible: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo" className="space-y-5">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  placeholder="Enter meta title" 
                  value={pageSettings?.meta?.title || pageSettings?.title || ''}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="border border-gray-300"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 50-60 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <TextArea 
                  id="meta-description" 
                  placeholder="Enter meta description" 
                  value={pageSettings?.meta?.description || pageSettings?.description || ''}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  className="min-h-[100px] border border-gray-300"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 150-160 characters
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="indexable">Allow search indexing</Label>
                  <p className="text-xs text-muted-foreground">
                    Let search engines discover this page
                  </p>
                </div>
                <Switch 
                  id="indexable" 
                  checked={pageSettings?.meta?.indexable !== false}
                  onCheckedChange={(checked) => handleMetadataChange('indexable', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-5">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og-title">Social Title</Label>
                <Input 
                  id="og-title" 
                  placeholder="Enter social title" 
                  value={pageSettings?.meta?.ogTitle || pageSettings?.title || ''}
                  onChange={(e) => handleMetadataChange('ogTitle', e.target.value)}
                  className="border border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-description">Social Description</Label>
                <TextArea 
                  id="og-description" 
                  placeholder="Enter social description" 
                  value={pageSettings?.meta?.ogDescription || pageSettings?.description || ''}
                  onChange={(e) => handleMetadataChange('ogDescription', e.target.value)}
                  className="min-h-[100px] border border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-image">Social Image URL</Label>
                <Input 
                  id="og-image" 
                  placeholder="https://example.com/image.jpg" 
                  value={pageSettings?.meta?.ogImage || ''}
                  onChange={(e) => handleMetadataChange('ogImage', e.target.value)}
                  className="border border-gray-300"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200 x 630 pixels
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Additional page configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="canonical-url">Canonical URL</Label>
            <Input 
              id="canonical-url" 
              placeholder="https://example.com/page" 
              value={pageSettings?.meta?.canonical || ''}
              onChange={(e) => handleMetadataChange('canonical', e.target.value)}
              className="border border-gray-300"
            />
            <p className="text-xs text-muted-foreground">
              Use this to specify the preferred URL for this page
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="password-protection">Password Protection</Label>
              <p className="text-xs text-muted-foreground">
                Require a password to view this page
              </p>
            </div>
            <Switch 
              id="password-protection" 
              checked={pageSettings?.passwordProtected === true}
              onCheckedChange={(checked) => updatePageSettings({ passwordProtected: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageSettings;
