
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
      
      // Enhanced page structure initialization
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
        
        // Initialize page content and settings structures
        if (!parsedSettings.pagesContent) {
          parsedSettings.pagesContent = {};
        }
        if (!parsedSettings.pagesSettings) {
          parsedSettings.pagesSettings = {};
        }
        
        // If there's existing content, put it in the home page
        const existingContent = Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [];
        parsedSettings.pagesContent[homePageId] = existingContent;
        parsedSettings.pagesSettings[homePageId] = {
          title: data.name || 'Home'
        };
        
        console.log("🏠 WebsiteService: Created default home page with", existingContent.length, "elements");
        
        // Save the updated structure
        await this.updateWebsiteSettings(id, parsedSettings);
      }
      
      // Ensure pagesContent and pagesSettings exist for all pages
      if (!parsedSettings.pagesContent) {
        parsedSettings.pagesContent = {};
      }
      if (!parsedSettings.pagesSettings) {
        parsedSettings.pagesSettings = {};
      }
      
      // Ensure all pages have content and settings entries
      parsedSettings.pages.forEach(page => {
        if (!parsedSettings.pagesContent![page.id]) {
          parsedSettings.pagesContent![page.id] = [];
        }
        if (!parsedSettings.pagesSettings![page.id]) {
          parsedSettings.pagesSettings![page.id] = {
            title: page.title
          };
        }
      });
      
      const websiteData: WebsiteData = {
        id: data.id,
        name: data.name,
        content: Array.isArray(data.content) ? data.content as unknown as BuilderElement[] : [],
        settings: parsedSettings,
        pageSettings: parsedSettings?.pageSettings || null,
        published: !!data.published
      };
      
      console.log("✅ WebsiteService: Processed multi-page website data:", {
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
      console.log("💾 WebsiteService: Called saveWebsite with enhanced multi-page support", {
        id,
        websiteName,
        elements,
        elementsType: Array.isArray(elements) ? "array" : typeof elements,
        elementsCount: elements?.length,
        pageSettings,
        additionalSettings,
        hasMultiPageData: !!(additionalSettings?.pages || additionalSettings?.pagesContent)
      });

      const updatedSettings: WebsiteSettings = {
        pageSettings,
        ...(additionalSettings || {})
      };

      // Ensure pages structure exists
      if (!updatedSettings.pages || !Array.isArray(updatedSettings.pages)) {
        updatedSettings.pages = [{
          id: 'home',
          title: 'Home',
          slug: '/',
          isHomePage: true
        }];
      }

      // Ensure pagesContent and pagesSettings exist
      if (!updatedSettings.pagesContent) {
        updatedSettings.pagesContent = {};
      }
      if (!updatedSettings.pagesSettings) {
        updatedSettings.pagesSettings = {};
      }

      console.log("💾 WebsiteService: Saving multi-page website to supabase", {
        id,
        name: websiteName,
        content: elements,
        settings: updatedSettings,
        pagesCount: updatedSettings.pages.length,
        contentPagesCount: Object.keys(updatedSettings.pagesContent).length
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
        console.error("❌ WebsiteService: Error saving multi-page website:", error);
        return false;
      }

      console.log("✅ WebsiteService: Multi-page website saved to supabase successfully");
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
