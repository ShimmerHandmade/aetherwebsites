import { useState, useEffect, useCallback, useRef } from "react";
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

interface UseWebsiteOptions {
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export const useWebsite = (
  id: string | undefined, 
  navigate: NavigateFunction,
  options?: UseWebsiteOptions
) => {
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [pageSettings, setPageSettings] = useState<PageSettings | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled] = useState(options?.autoSave ?? false);
  const autoSaveIntervalRef = useRef<number | null>(null);
  const pendingSaveRef = useRef<boolean>(false);
  const forcedRefreshRef = useRef<boolean>(false);
  
  // Track whether we have content to save
  const contentToSaveRef = useRef<{
    elements?: BuilderElement[];
    pageSettings?: PageSettings;
    additionalSettings?: any;
  } | null>(null);

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

  const fetchWebsite = async (forceRefresh = false) => {
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
        toast.error("Error loading website");
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
      
      // Only update elements if this is an initial load or forced refresh
      if (forcedRefreshRef.current || forceRefresh || !elements.length) {
        // Load elements from content if available
        if (data.content && Array.isArray(data.content) && data.content.length > 0) {
          // Use a proper type assertion with unknown as intermediate step
          setElements(data.content as unknown as BuilderElement[]);
          console.log("Loaded elements from database", data.content);
        }
      }
      
      // Reset unsaved changes flag after fetching fresh data
      if (forceRefresh) {
        setUnsavedChanges(false);
      }
      
      setLastSaved(new Date());
      forcedRefreshRef.current = false;
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
      toast.error("Error loading website");
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebsite = useCallback(async (
    updatedElements?: BuilderElement[], 
    updatedPageSettings?: PageSettings,
    additionalSettings?: any
  ) => {
    try {
      if (!id || !website) {
        toast.error("No website to save");
        return false;
      }
      
      // If we're already saving, store this save for later
      if (isSaving) {
        console.log("Save already in progress, queuing this save");
        contentToSaveRef.current = {
          elements: updatedElements,
          pageSettings: updatedPageSettings,
          additionalSettings
        };
        pendingSaveRef.current = true;
        return false;
      }
      
      setIsSaving(true);
      
      const contentToSave = updatedElements || elements;
      const settingsToSave = updatedPageSettings || pageSettings;
      
      // Make a deep copy of the current website settings to avoid mutation issues
      const currentSettings = JSON.parse(JSON.stringify(website.settings || {}));
      
      // Store page settings and additional settings within the settings object
      const updatedSettings: WebsiteSettings = {
        ...currentSettings,
        pageSettings: settingsToSave,
        ...(additionalSettings || {})
      };
      
      console.log("Saving website with settings:", updatedSettings);
      console.log("Saving elements:", contentToSave);
      
      const { error } = await supabase
        .from("websites")
        .update({ 
          name: websiteName,
          content: contentToSave as unknown as Json,
          settings: updatedSettings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to save website");
        console.error("Error saving website:", error);
        return false;
      }
      
      // Update local state with the saved data to ensure consistency
      const updatedWebsite = {
        ...website,
        name: websiteName,
        content: contentToSave,
        pageSettings: settingsToSave,
        settings: updatedSettings
      };
      
      setWebsite(updatedWebsite);
      setElements(contentToSave);
      setPageSettings(settingsToSave);
      
      // Reset unsaved changes flag
      setUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Only show manual save toast (not for auto-saves)
      if (!options?.autoSave) {
        toast.success("Website saved successfully");
      }
      
      // Dispatch an event for any listeners
      document.dispatchEvent(new CustomEvent('save-complete'));
      
      return true;
    } catch (error) {
      console.error("Error in saveWebsite:", error);
      toast.error("An unexpected error occurred while saving");
      return false;
    } finally {
      setIsSaving(false);
      
      // Process any pending saves that came in while we were saving
      if (pendingSaveRef.current && contentToSaveRef.current) {
        pendingSaveRef.current = false;
        const { elements, pageSettings, additionalSettings } = contentToSaveRef.current;
        contentToSaveRef.current = null;
        
        // Small delay before attempting the next save
        setTimeout(() => {
          saveWebsite(elements, pageSettings, additionalSettings);
        }, 500);
      }
    }
  }, [id, website, isSaving, elements, pageSettings, websiteName, options?.autoSave]);

  const publishWebsite = async () => {
    try {
      if (!id || !website) {
        toast.error("No website to publish");
        return;
      }
      
      setIsPublishing(true);
      
      // First save the latest state to ensure we're publishing the most recent version
      await saveWebsite();
      
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
    } finally {
      setIsPublishing(false);
    }
  };

  // Set up auto save
  useEffect(() => {
    if (!autoSaveEnabled || !options?.autoSaveInterval) return;
    
    // Function to check if we need to auto-save
    const checkAndAutoSave = () => {
      if (unsavedChanges && !isSaving && id && website) {
        console.log("Auto-saving website...");
        saveWebsite();
      }
    };

    // Clear any existing interval
    if (autoSaveIntervalRef.current) {
      window.clearInterval(autoSaveIntervalRef.current);
    }
    
    // Set up new interval
    autoSaveIntervalRef.current = window.setInterval(
      checkAndAutoSave, 
      options.autoSaveInterval
    );

    return () => {
      if (autoSaveIntervalRef.current) {
        window.clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [autoSaveEnabled, options?.autoSaveInterval, unsavedChanges, isSaving, id, website, saveWebsite]);

  const updateElements = (newElements: BuilderElement[]) => {
    console.log("Updating elements:", newElements);
    setElements(newElements);
    setUnsavedChanges(true);
  };
  
  const hasUnsavedChanges = () => {
    return unsavedChanges;
  };
  
  // Set unsaved changes when website name is updated
  const updateWebsiteName = (name: string) => {
    setWebsiteName(name);
    setUnsavedChanges(true);
  };

  // Force refresh the website from the database
  const refreshWebsite = useCallback(() => {
    forcedRefreshRef.current = true;
    return fetchWebsite(true);
  }, []);

  return {
    website,
    isLoading,
    isSaving,
    isPublishing,
    websiteName,
    elements,
    pageSettings,
    setWebsiteName: updateWebsiteName,
    saveWebsite,
    publishWebsite,
    updateElements,
    hasUnsavedChanges,
    refreshWebsite,
    lastSaved,
    unsavedChanges
  };
};
