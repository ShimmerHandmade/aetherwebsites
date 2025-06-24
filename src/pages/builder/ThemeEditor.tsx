
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import ThemeEditor from "@/components/builder/ThemeEditor";
import { toast } from "sonner";

const BuilderThemeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { website, isLoading, websiteName, saveWebsite } = useWebsite(id, navigate);

  const handleSaveTheme = async (theme: any) => {
    if (!website) {
      toast.error("Website not found");
      return;
    }

    try {
      // Save theme to website settings
      const updatedSettings = {
        ...website.settings,
        theme: theme
      };

      const success = await saveWebsite(
        website.content || [],
        website.pageSettings || { title: websiteName },
        updatedSettings
      );

      if (success) {
        toast.success("Theme saved successfully!");
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading theme editor...</p>
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
          <ThemeEditor 
            onSave={handleSaveTheme}
            initialTheme={website.settings?.theme}
          />
        </div>
      </div>
    </div>
  );
};

export default BuilderThemeEditor;
