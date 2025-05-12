
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextArea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useWebsite } from "@/hooks/useWebsite";
import { toast } from "sonner";

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
  const [isSaving, setIsSaving] = useState(false);

  // Update state when pageSettings changes
  React.useEffect(() => {
    if (pageSettings) {
      setTitle(pageSettings.title || websiteName || '');
      setDescription(pageSettings.description || '');
      setKeywords(pageSettings.keywords || '');
      setIndexable(pageSettings.indexable !== false);
    }
  }, [pageSettings, websiteName]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedPageSettings = {
        ...pageSettings,
        title,
        description,
        keywords,
        indexable
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
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Page Settings - {websiteName}</h1>
          
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input 
                id="page-title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-sm text-gray-500">The title that appears in the browser tab</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-description">Meta Description</Label>
              <TextArea 
                id="page-description" 
                placeholder="A brief description of this page for search engines"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm text-gray-500">Important for SEO, appears in search engine results</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-keywords">Meta Keywords</Label>
              <Input 
                id="page-keywords" 
                placeholder="keyword1, keyword2, keyword3"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="indexing" 
                checked={indexable} 
                onCheckedChange={setIndexable}
              />
              <Label htmlFor="indexing">Allow search engines to index this page</Label>
            </div>
            
            <div className="pt-4">
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
    </div>
  );
};

export default BuilderPageSettings;
