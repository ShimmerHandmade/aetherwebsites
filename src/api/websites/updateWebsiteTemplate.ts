
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
    
    // Create new pages array with uuids
    const pages = templateSettings.pages.map(page => ({
      ...page,
      id: uuidv4() // Generate new unique IDs for each page
    }));
    
    // Find the home page
    const homePage = pages.find(p => p.isHomePage);
    
    if (!homePage) {
      return {
        success: false,
        error: "Template has no home page defined"
      };
    }
    
    // Update settings with template data
    const updatedSettings = {
      ...settings,
      ...templateSettings,
      pages, // Use the newly generated page IDs
      pageSettings: templateSettings.pageSettings || settings.pageSettings || { title: "My Website" },
    };
    
    // For each page in the template, add its content to pagesContent using the NEW page IDs
    const pagesContent = { ...(settings.pagesContent || {}) };
    
    // Get the home page content from the template
    // The template structure stores pages as an object with keys
    // Check if templateContent.pages exists and if it has a homepage property
    const homePageContent = templateContent.pages && 'homepage' in templateContent.pages 
      ? templateContent.pages.homepage 
      : [];
    
    // Store this content under the new home page ID
    pagesContent[homePage.id] = homePageContent;
    
    // Make sure to also set the main content for the website to be the home page content
    
    // Update website with template name, content and settings
    const { error } = await supabase
      .from("websites")
      .update({ 
        template,
        content: homePageContent, // Set main content to home page content
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
    
    console.log("Template applied successfully with home page:", homePage);
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
        id: "homepage", // This ID will be replaced with a UUID in the function above
        title: "Home",
        slug: "/",
        isHomePage: true
      },
      {
        id: "about",
        title: "About",
        slug: "/about",
        isHomePage: false
      },
      {
        id: "contact",
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
        pages: [
          ...baseSettings.pages,
          {
            id: "shop",
            title: "Shop",
            slug: "/shop",
            isHomePage: false
          },
          {
            id: "cart",
            title: "Cart",
            slug: "/cart",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My E-Commerce Store"
        }
      };
    case 'portfolio':
      return {
        ...baseSettings,
        pages: [
          ...baseSettings.pages,
          {
            id: "projects",
            title: "Projects",
            slug: "/projects",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Portfolio"
        }
      };
    case 'blog':
      return {
        ...baseSettings,
        pages: [
          ...baseSettings.pages,
          {
            id: "articles",
            title: "Articles",
            slug: "/articles",
            isHomePage: false
          },
          {
            id: "categories",
            title: "Categories",
            slug: "/categories",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Blog"
        }
      };
    case 'business':
      return {
        ...baseSettings,
        pages: [
          ...baseSettings.pages,
          {
            id: "services",
            title: "Services",
            slug: "/services",
            isHomePage: false
          },
          {
            id: "testimonials",
            title: "Testimonials",
            slug: "/testimonials",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "My Business"
        }
      };
    default:
      return baseSettings;
  }
};
