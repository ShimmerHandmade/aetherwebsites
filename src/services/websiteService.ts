import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { Json } from "@/integrations/supabase/types";
import { v4 as uuidv4 } from "@/lib/uuid";

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

export class WebsiteService {
  static async fetchWebsite(id: string): Promise<WebsiteData | null> {
    try {
      console.log("🔍 WebsiteService: Fetching website", id);
      
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("❌ WebsiteService: Error fetching website:", error);
        throw error;
      }
      
      console.log("📊 WebsiteService: Raw website data:", {
        id: data.id,
        name: data.name,
        contentType: typeof data.content,
        settingsType: typeof data.settings,
        contentLength: Array.isArray(data.content) ? data.content.length : 'not array'
      });
      
      const parsedSettings: WebsiteSettings = typeof data.settings === 'string' 
        ? JSON.parse(data.settings as string)
        : (data.settings as unknown as WebsiteSettings) || {};
      
      if (!parsedSettings.pages || !Array.isArray(parsedSettings.pages)) {
        parsedSettings.pages = [];
      }
      
      if (parsedSettings.pages.length === 0) {
        const homePageId = uuidv4();
        parsedSettings.pages = [{
          id: homePageId,
          title: 'Home',
          slug: '/',
          isHomePage: true
        }];
        
        if (!parsedSettings.pagesContent) {
          parsedSettings.pagesContent = {};
        }
        
        // If there's existing content, put it in the home page
        const existingContent = Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [];
        parsedSettings.pagesContent[homePageId] = existingContent;
        
        console.log("🏠 WebsiteService: Created default home page with", existingContent.length, "elements");
        
        await this.updateWebsiteSettings(id, parsedSettings);
      }
      
      // Ensure pagesContent and pagesSettings exist
      if (!parsedSettings.pagesContent) {
        parsedSettings.pagesContent = {};
      }
      if (!parsedSettings.pagesSettings) {
        parsedSettings.pagesSettings = {};
      }
      
      const websiteData: WebsiteData = {
        id: data.id,
        name: data.name,
        content: Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [],
        settings: parsedSettings,
        pageSettings: parsedSettings?.pageSettings || null,
        published: !!data.published
      };
      
      console.log("✅ WebsiteService: Processed website data:", {
        id: websiteData.id,
        name: websiteData.name,
        contentLength: websiteData.content.length,
        pagesCount: parsedSettings.pages.length,
        pagesContentKeys: Object.keys(parsedSettings.pagesContent || {}),
        pagesSettingsKeys: Object.keys(parsedSettings.pagesSettings || {})
      });
      
      return websiteData;
    } catch (error) {
      console.error("❌ WebsiteService: Error in fetchWebsite:", error);
      return null;
    }
  }

  static async saveWebsite(
    id: string,
    websiteName: string,
    elements: BuilderElement[],
    pageSettings: PageSettings | null,
    additionalSettings?: any
  ): Promise<boolean> {
    try {
      console.log("💾 WebsiteService: Called saveWebsite", {
        id,
        websiteName,
        elements,
        elementsType: Array.isArray(elements) ? "array" : typeof elements,
        elementsCount: elements?.length,
        pageSettings,
        additionalSettings
      });

      const updatedSettings: WebsiteSettings = {
        pageSettings,
        ...(additionalSettings || {})
      };

      console.log("💾 WebsiteService: Saving to supabase", {
        id,
        name: websiteName,
        content: elements,
        settings: updatedSettings,
      });

      const { error } = await supabase
        .from("websites")
        .update({ 
          name: websiteName,
          content: elements as unknown as Json,
          settings: updatedSettings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("❌ WebsiteService: Error saving website:", error);
        return false;
      }

      console.log("✅ WebsiteService: Website saved to supabase");
      return true;
    } catch (error) {
      console.error("❌ WebsiteService: Exception in saveWebsite:", error);
      return false;
    }
  }

  static async publishWebsite(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ published: true })
        .eq("id", id);
      
      if (error) {
        console.error("Error publishing website:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in publishWebsite:", error);
      return false;
    }
  }

  private static async updateWebsiteSettings(id: string, settings: WebsiteSettings): Promise<void> {
    const { error } = await supabase
      .from("websites")
      .update({ settings: settings as unknown as Json })
      .eq("id", id);
      
    if (error) {
      console.error("Error updating website settings:", error);
      throw error;
    }
  }
}
