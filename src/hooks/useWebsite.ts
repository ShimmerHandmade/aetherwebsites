
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import { Json } from "@/integrations/supabase/types";

export interface WebsiteData {
  id: string;
  name: string;
  content: BuilderElement[];
  settings: WebsiteSettings;
  pageSettings?: PageSettings;
  published: boolean;
}

interface WebsiteSettings {
  pageSettings?: PageSettings;
  pages?: Array<{
    id: string;
    title: string;
    slug: string;
    isHomePage?: boolean;
  }>;
  pagesContent?: {
    [pageId: string]: BuilderElement[];
  };
  pagesSettings?: {
    [pageId: string]: PageSettings;
  };
  [key: string]: any;
}

export const useWebsite = (id: string | undefined, navigate: NavigateFunction) => {
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      fetchWebsite();
    };

    checkAuth();
  }, [id, navigate]);

  const fetchWebsite = async () => {
    try {
      if (!id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching website:", error);
        navigate("/dashboard");
        return;
      }
      
      // Parse the settings field if it's a string, otherwise cast it
      const parsedSettings: WebsiteSettings = typeof data.settings === 'string' 
        ? JSON.parse(data.settings as string)
        : (data.settings as unknown as WebsiteSettings) || {};
      
      // Convert the database response to the correct type
      const websiteData: WebsiteData = {
        id: data.id,
        name: data.name,
        content: Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [],
        settings: parsedSettings,
        // Store page settings from the settings object if it exists
        pageSettings: parsedSettings?.pageSettings || null,
        published: !!data.published
      };

      setWebsite(websiteData);
      setWebsiteName(data.name);
      setPageSettings(parsedSettings?.pageSettings || { title: data.name });
      
      // Load elements from content if available
      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        // Use a proper type assertion with unknown as intermediate step
        setElements(data.content as unknown as BuilderElement[]);
      }
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebsite = async (
    updatedElements?: BuilderElement[], 
    updatedPageSettings?: PageSettings,
    additionalSettings?: any
  ) => {
    try {
      if (!id || !website) return;
      
      setIsSaving(true);
      
      const contentToSave = updatedElements || elements;
      const settingsToSave = updatedPageSettings || pageSettings;
      
      // Store page settings and additional settings within the settings object
      const updatedSettings: WebsiteSettings = {
        ...website.settings,
        pageSettings: settingsToSave,
        ...(additionalSettings || {})
      };
      
      const { error } = await supabase
        .from("websites")
        .update({ 
          name: websiteName,
          content: contentToSave as unknown as Json,
          settings: updatedSettings as unknown as Json
        })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to save website");
        console.error("Error saving website:", error);
        return;
      }
      
      setWebsite({
        ...website,
        name: websiteName,
        content: contentToSave,
        pageSettings: settingsToSave,
        settings: updatedSettings
      });
      setElements(contentToSave);
      setPageSettings(settingsToSave);
      toast.success("Website saved successfully");
    } catch (error) {
      console.error("Error in saveWebsite:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const publishWebsite = async () => {
    try {
      if (!id || !website) return;
      
      const { error } = await supabase
        .from("websites")
        .update({ published: true })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to publish website");
        console.error("Error publishing website:", error);
        return;
      }
      
      setWebsite({ ...website, published: true });
      toast.success("Website published successfully");
    } catch (error) {
      console.error("Error in publishWebsite:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const updateElements = (newElements: BuilderElement[]) => {
    setElements(newElements);
  };

  return {
    website,
    isLoading,
    isSaving,
    websiteName,
    elements,
    pageSettings,
    setWebsiteName,
    saveWebsite,
    publishWebsite,
    updateElements
  };
};
