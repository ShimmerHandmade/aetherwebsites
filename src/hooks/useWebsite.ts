
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WebsiteData {
  id: string;
  name: string;
  content: any;
  settings: any;
  published: boolean;
}

export const useWebsite = (id: string | undefined, navigate: NavigateFunction) => {
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [websiteName, setWebsiteName] = useState("");

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
      
      setWebsite(data);
      setWebsiteName(data.name);
    } catch (error) {
      console.error("Error in fetchWebsite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebsite = async () => {
    try {
      if (!id || !website) return;
      
      setIsSaving(true);
      
      // In a real builder, you'd save the entire website structure
      const { error } = await supabase
        .from("websites")
        .update({ name: websiteName })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to save website");
        console.error("Error saving website:", error);
        return;
      }
      
      setWebsite({ ...website, name: websiteName });
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

  return {
    website,
    isLoading,
    isSaving,
    websiteName,
    setWebsiteName,
    saveWebsite,
    publishWebsite
  };
};
