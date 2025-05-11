
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Json } from "@/integrations/supabase/types";

export interface WebsiteData {
  id: string;
  name: string;
  content: BuilderElement[];
  settings: any;
  published: boolean;
}

export const useWebsite = (id: string | undefined, navigate: NavigateFunction) => {
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [elements, setElements] = useState<BuilderElement[]>([]);

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
      
      // Convert the database response to the correct type
      const websiteData: WebsiteData = {
        id: data.id,
        name: data.name,
        content: Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [],
        settings: data.settings,
        published: !!data.published
      };

      setWebsite(websiteData);
      setWebsiteName(data.name);
      
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

  const saveWebsite = async (updatedElements?: BuilderElement[]) => {
    try {
      if (!id || !website) return;
      
      setIsSaving(true);
      
      const contentToSave = updatedElements || elements;
      
      const { error } = await supabase
        .from("websites")
        .update({ 
          name: websiteName,
          content: contentToSave as unknown as Json
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
        content: contentToSave
      });
      setElements(contentToSave);
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
    setWebsiteName,
    saveWebsite,
    publishWebsite,
    updateElements
  };
};
