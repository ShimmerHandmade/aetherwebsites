
import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { ecommerceTemplate } from "@/templates/ecommerce";
import { portfolioTemplate } from "@/templates/portfolio";
import { blogTemplate } from "@/templates/blog";
import { businessTemplate } from "@/templates/business";

/**
 * Updates a website with the selected template
 */
export const updateWebsiteTemplate = async (
  websiteId: string, 
  template: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Get template content based on template ID
    const templateContent = getTemplateContent(template);
    const templateSettings = getTemplateSettings(template);
    
    // Get current website data
    const { data: website, error: fetchError } = await supabase
      .from("websites")
      .select("settings")
      .eq("id", websiteId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching website:", fetchError);
      return {
        success: false,
        error: "Failed to fetch website data"
      };
    }
    
    // Parse existing settings or initialize new settings object
    const settings = website?.settings ? 
      (typeof website.settings === 'string' ? JSON.parse(website.settings) : website.settings) : 
      {};
    
    // Update settings with template data
    const updatedSettings = {
      ...settings,
      ...templateSettings,
      pageSettings: templateSettings.pageSettings || settings.pageSettings || { title: "My Website" },
      pages: templateSettings.pages || settings.pages || []
    };
    
    // For each page in the template, add its content to pagesContent
    const pagesContent = { ...(settings.pagesContent || {}) };
    if (templateSettings.pages && templateSettings.pages.length > 0) {
      templateSettings.pages.forEach((page) => {
        // Find corresponding page content in template
        const pageTemplateContent = templateContent.pages?.[page.id] || [];
        pagesContent[page.id] = pageTemplateContent;
      });
    }
    
    // Make sure home page content is set as main content as well
    const homePage = templateSettings.pages?.find(p => p.isHomePage);
    const homePageContent = homePage ? pagesContent[homePage.id] || [] : [];
    
    // Update website with template name, content and settings
    const { error } = await supabase
      .from("websites")
      .update({ 
        template,
        content: homePageContent,
        settings: {
          ...updatedSettings,
          pagesContent
        }
      })
      .eq("id", websiteId);
    
    if (error) {
      console.error("Error updating website template:", error);
      return {
        success: false,
        error: "Failed to update website template"
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateWebsiteTemplate:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};

// Helper function to get template content
const getTemplateContent = (templateId: string) => {
  switch(templateId) {
    case 'ecommerce':
      return ecommerceTemplate;
    case 'portfolio':
      return portfolioTemplate;
    case 'blog':
      return blogTemplate;
    case 'business':
      return businessTemplate;
    default:
      return { pages: {} };
  }
};

// Helper function to get template settings
const getTemplateSettings = (templateId: string) => {
  // Base settings with default pages structure
  const baseSettings = {
    pages: [
      {
        id: uuidv4(),
        title: "Home",
        slug: "/",
        isHomePage: true
      },
      {
        id: uuidv4(),
        title: "About",
        slug: "/about",
        isHomePage: false
      },
      {
        id: uuidv4(),
        title: "Shop",
        slug: "/shop",
        isHomePage: false
      },
      {
        id: uuidv4(),
        title: "Contact",
        slug: "/contact",
        isHomePage: false
      }
    ],
    pageSettings: {
      title: "My Website",
      description: "Welcome to my website"
    }
  };
  
  switch(templateId) {
    case 'ecommerce':
      return {
        ...baseSettings,
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My E-Commerce Store"
        }
      };
    case 'portfolio':
      return {
        ...baseSettings,
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Portfolio"
        }
      };
    case 'blog':
      return {
        ...baseSettings,
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Blog"
        }
      };
    case 'business':
      return {
        ...baseSettings,
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Business"
        }
      };
    default:
      return baseSettings;
  }
};
