import { useState, useEffect, useCallback, useRef } from "react";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { WebsiteService, WebsiteData } from "@/services/websiteService";

interface UseWebsiteOptions {
  autoSave?: boolean;
  autoSaveInterval?: number;
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
      const websiteData = await WebsiteService.fetchWebsite(id);
      
      if (!websiteData) {
        toast({
          title: "Error",
          description: "Error loading website",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }

      setWebsite(websiteData);
      setWebsiteName(websiteData.name);
      setPageSettings(websiteData.pageSettings || { title: websiteData.name });
      
      if (forcedRefreshRef.current || forceRefresh || !elements.length) {
        if (websiteData.content && Array.isArray(websiteData.content) && websiteData.content.length > 0) {
          setElements(websiteData.content);
          console.log("Loaded elements from database", websiteData.content);
        }
      }
      
      if (forceRefresh) {
        setUnsavedChanges(false);
      }
      
      setLastSaved(new Date());
      forcedRefreshRef.current = false;
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
      toast({
        title: "Error",
        description: "Error loading website",
        variant: "destructive"
      });
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
        console.error("❌ useWebsite: No website loaded for save", { id, website });
        toast.error("No website to save");
        return false;
      }
      
      if (isSaving) {
        console.log("⏳ useWebsite: Save already in progress, queuing this save");
        contentToSaveRef.current = {
          elements: updatedElements,
          pageSettings: updatedPageSettings,
          additionalSettings
        };
        pendingSaveRef.current = true;
        return false;
      }

      setIsSaving(true);
      console.log("💾 useWebsite: Starting website save...", {
        id,
        websiteName,
        updatedElements,
        updatedPageSettings,
        additionalSettings,
        elements, 
        pageSettings,
      });

      const contentToSave = updatedElements !== undefined ? updatedElements : elements;
      const settingsToSave = updatedPageSettings !== undefined ? updatedPageSettings : pageSettings;

      // Show what will actually be saved
      console.log("💾 useWebsite: Calling WebsiteService.saveWebsite with:", {
        id,
        websiteName,
        contentToSave,
        settingsToSave,
        additionalSettings
      });

      const success = await WebsiteService.saveWebsite(
        id,
        websiteName,
        contentToSave,
        settingsToSave,
        additionalSettings
      );

      if (!success) {
        console.error("❌ useWebsite: WebsiteService.saveWebsite returned false");
        toast.error("Failed to save website");
        return false;
      }

      const updatedWebsite = {
        ...website,
        name: websiteName,
        content: contentToSave,
        pageSettings: settingsToSave
      };

      setWebsite(updatedWebsite);
      setElements(contentToSave);
      if (settingsToSave) {
        setPageSettings(settingsToSave);
      }

      setUnsavedChanges(false);
      setLastSaved(new Date());

      if (!autoSaveEnabled) {
        toast.success("Website saved successfully");
      }

      document.dispatchEvent(new CustomEvent('save-complete'));

      return true;
    } catch (error) {
      console.error("❌ useWebsite: Error in saveWebsite:", error);
      toast.error("An unexpected error occurred while saving");
      return false;
    } finally {
      setIsSaving(false);

      if (pendingSaveRef.current && contentToSaveRef.current) {
        pendingSaveRef.current = false;
        const { elements, pageSettings, additionalSettings } = contentToSaveRef.current;
        contentToSaveRef.current = null;

        setTimeout(() => {
          saveWebsite(elements, pageSettings, additionalSettings);
        }, 500);
      }
    }
  }, [id, website, isSaving, elements, pageSettings, websiteName, autoSaveEnabled]);

  const publishWebsite = async () => {
    try {
      if (!id || !website) {
        toast.error("No website to publish");
        return;
      }
      
      setIsPublishing(true);
      
      await saveWebsite();
      
      const success = await WebsiteService.publishWebsite(id);
      
      if (!success) {
        toast.error("Failed to publish website");
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
    
    const checkAndAutoSave = () => {
      if (unsavedChanges && !isSaving && id && website) {
        console.log("Auto-saving website...");
        saveWebsite();
      }
    };

    if (autoSaveIntervalRef.current) {
      window.clearInterval(autoSaveIntervalRef.current);
    }
    
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
  
  const updateWebsiteName = (name: string) => {
    setWebsiteName(name);
    setUnsavedChanges(true);
  };

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
