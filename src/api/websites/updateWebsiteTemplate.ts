
import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { fashionTemplate } from "@/templates/fashion";
import { electronicsTemplate } from "@/templates/electronics";
import { beautyTemplate } from "@/templates/beauty";
import { furnitureTemplate } from "@/templates/furniture";
import { foodTemplate } from "@/templates/food";
import { jewelryTemplate } from "@/templates/jewelry";
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
    console.log(`Starting template update for website ${websiteId} with template ${template}`);
    
    // Get template content based on template ID
    const templateContent = getTemplateContent(template);
    const templateSettings = getTemplateSettings(template);
    
    console.log("Template content:", templateContent);
    console.log("Template settings:", templateSettings);
    
    // Validate template content
    if (!templateContent || !templateContent.pages) {
      console.error("Invalid template content structure");
      return {
        success: false,
        error: "Invalid template structure"
      };
    }
    
    // Get current website data
    const { data: website, error: fetchError } = await supabase
      .from("websites")
      .select("*")
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
    const existingSettings = website?.settings ? 
      (typeof website.settings === 'string' ? JSON.parse(website.settings) : website.settings) : 
      {};
    
    console.log("Current website settings:", existingSettings);
    
    // Create new pages array with uuids
    const pages = templateSettings.pages.map(page => ({
      ...page,
      id: uuidv4() // Generate new unique IDs for each page
    }));
    
    console.log("Generated pages with new IDs:", pages);
    
    // Find the home page
    const homePage = pages.find(p => p.isHomePage);
    
    if (!homePage) {
      console.error("No home page found in template");
      return {
        success: false,
        error: "Template has no home page defined"
      };
    }
    
    console.log("Home page found:", homePage);
    
    // Get the home page content from the template
    const homePageContent = templateContent.pages?.homepage || [];
    
    console.log("Home page content from template:", homePageContent);
    
    if (!Array.isArray(homePageContent) || homePageContent.length === 0) {
      console.warn("Home page content is empty or invalid");
      return {
        success: false,
        error: "Template has no content defined"
      };
    }
    
    // Ensure all elements have proper IDs
    const processElements = (elements: any[]): BuilderElement[] => {
      return elements.map(element => ({
        ...element,
        id: element.id || uuidv4(),
        children: element.children ? processElements(element.children) : undefined
      }));
    };
    
    const processedHomePageContent = processElements(homePageContent);
    
    // Initialize pagesContent with the new home page content
    const pagesContent = {
      [homePage.id]: processedHomePageContent
    };
    
    // Initialize pagesSettings
    const pagesSettings = {
      [homePage.id]: {
        title: homePage.title || "Home",
        meta: {
          description: `${homePage.title} page`
        }
      }
    };
    
    // Update settings with template data, preserving existing settings where appropriate
    const updatedSettings = {
      ...existingSettings,
      ...templateSettings,
      pages, // Use the newly generated page IDs
      pagesContent,
      pagesSettings,
      pageSettings: templateSettings.pageSettings || existingSettings.pageSettings || { title: website.name || "My Website" },
    };
    
    console.log("Final updated settings:", updatedSettings);
    console.log("Processed home page content:", processedHomePageContent);
    
    // Update website with template name, content and settings
    const { error } = await supabase
      .from("websites")
      .update({ 
        template,
        content: processedHomePageContent, // Set main content to home page content
        settings: updatedSettings
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
    console.log("Main content set to:", processedHomePageContent);
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
  console.log(`Getting template content for: ${templateId}`);
  
  switch(templateId) {
    case 'fashion':
      return fashionTemplate;
    case 'electronics':
      return electronicsTemplate;
    case 'beauty':
      return beautyTemplate;
    case 'furniture':
      return furnitureTemplate;
    case 'food':
      return foodTemplate;
    case 'jewelry':
      console.log("Loading jewelry template:", jewelryTemplate);
      return jewelryTemplate;
    case 'ecommerce':
      return ecommerceTemplate;
    case 'portfolio':
      return portfolioTemplate;
    case 'blog':
      return blogTemplate;
    case 'business':
      return businessTemplate;
    default:
      console.warn(`Unknown template ID: ${templateId}, returning empty template`);
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
  
  // Template-specific settings
  switch(templateId) {
    case 'fashion':
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
            id: "collections",
            title: "Collections",
            slug: "/collections",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "CHIC BOUTIQUE - Fashion Store"
        }
      };
    case 'electronics':
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
            id: "support",
            title: "Support",
            slug: "/support",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "TECH HUB - Electronics Store"
        }
      };
    case 'beauty':
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
            id: "skincare",
            title: "Skincare Guide",
            slug: "/skincare",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "GLOW ESSENTIALS - Beauty & Cosmetics"
        }
      };
    case 'furniture':
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
            id: "collections",
            title: "Collections",
            slug: "/collections",
            isHomePage: false
          },
          {
            id: "design",
            title: "Design Ideas",
            slug: "/design",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "MODERN LIVING - Home & Furniture"
        }
      };
    case 'food':
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
            id: "recipes",
            title: "Recipes",
            slug: "/recipes",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "GOURMET MARKET - Specialty Foods"
        }
      };
    case 'jewelry':
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
            id: "collections",
            title: "Collections",
            slug: "/collections",
            isHomePage: false
          },
          {
            id: "bespoke",
            title: "Bespoke",
            slug: "/bespoke",
            isHomePage: false
          }
        ],
        pageSettings: {
          ...baseSettings.pageSettings,
          title: "LUXE GEMS - Luxury Jewelry"
        }
      };
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
