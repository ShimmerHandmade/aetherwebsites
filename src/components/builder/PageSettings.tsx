
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilder } from "@/contexts/BuilderContext";
import { toast } from "sonner";

const PageSettings: React.FC = () => {
  const { pageSettings, updatePageSettings } = useBuilder();
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePageSettings({ title: e.target.value });
    toast.success("Page title updated");
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    toast.success(`SEO ${key} updated`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Page Settings</CardTitle>
          <CardDescription>Configure your page settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-title">Page Title</Label>
            <Input 
              id="page-title" 
              placeholder="Enter page title" 
              value={pageSettings?.title || ''}
              onChange={handleTitleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-description">Description</Label>
            <Input 
              id="page-description" 
              placeholder="Enter page description" 
              value={pageSettings?.description || ''}
              onChange={handleDescriptionChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">SEO Settings</CardTitle>
          <CardDescription>Optimize for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  placeholder="Enter meta title" 
                  value={pageSettings?.meta?.title || pageSettings?.title || ''}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Input 
                  id="meta-description" 
                  placeholder="Enter meta description" 
                  value={pageSettings?.meta?.description || pageSettings?.description || ''}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
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
            </TabsContent>
            
            <TabsContent value="advanced" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canonical-url">Canonical URL</Label>
                <Input 
                  id="canonical-url" 
                  placeholder="https://example.com/page" 
                  value={pageSettings?.meta?.canonical || ''}
                  onChange={(e) => handleMetadataChange('canonical', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-image">Social Image URL</Label>
                <Input 
                  id="og-image" 
                  placeholder="https://example.com/image.jpg" 
                  value={pageSettings?.meta?.ogImage || ''}
                  onChange={(e) => handleMetadataChange('ogImage', e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageSettings;
