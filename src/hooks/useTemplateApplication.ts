
import { useCallback } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement } from "@/contexts/builder/types";

interface UseTemplateApplicationProps {
  updateElements: (elements: BuilderElement[]) => void;
  saveWebsite: (elements?: BuilderElement[], pageSettings?: any, additionalSettings?: any) => Promise<boolean>;
  setIsApplyingTemplate: (applying: boolean) => void;
  setShowTemplateSelection: (show: boolean) => void;
  markTemplateAsApplied: () => void;
}

export const useTemplateApplication = ({
  updateElements,
  saveWebsite,
  setIsApplyingTemplate,
  setShowTemplateSelection,
  markTemplateAsApplied
}: UseTemplateApplicationProps) => {
  
  const applyTemplateElements = useCallback(async (templateData: any) => {
    try {
      console.log("🔧 Processing enhanced template data:", templateData);
      
      // Handle different template structures
      let templateElements = [];
      let templatePages = [];
      let templateSettings = {};
      
      if (Array.isArray(templateData)) {
        // Simple array of elements
        templateElements = templateData;
      } else if (templateData.elements && Array.isArray(templateData.elements)) {
        // Template with elements property
        templateElements = templateData.elements;
      } else if (templateData.template_data) {
        // Full template data structure
        const data = templateData.template_data;
        templateElements = data.content || [];
        templatePages = data.pages || [];
        templateSettings = data.settings || {};
      } else if (templateData.content && Array.isArray(templateData.content)) {
        // Template with content property
        templateElements = templateData.content;
      }
      
      // Ensure all elements have IDs
      const processElements = (elements: any[]): BuilderElement[] => {
        return elements.map((element: any) => ({
          ...element,
          id: element.id || uuidv4(),
          children: element.children ? processElements(element.children) : []
        }));
      };
      
      // Check if this is a multi-page template
      if (templatePages && templatePages.length > 0) {
        console.log("📄 Processing multi-page template with", templatePages.length, "pages");
        
        // Process each page's content
        const processedPages = templatePages.map(page => ({
          ...page,
          id: page.id || uuidv4(),
          content: page.content ? processElements(page.content) : []
        }));
        
        // Create enhanced settings for multi-page template
        const enhancedSettings = {
          ...templateSettings,
          pages: processedPages.map(page => ({
            id: page.id,
            title: page.title || 'Untitled Page',
            slug: page.slug || `/${page.id}`,
            isHomePage: page.isHomePage || false
          })),
          pagesContent: processedPages.reduce((acc, page) => {
            acc[page.id] = page.content || [];
            return acc;
          }, {} as Record<string, BuilderElement[]>),
          pagesSettings: processedPages.reduce((acc, page) => {
            acc[page.id] = page.settings || { title: page.title || 'Untitled Page' };
            return acc;
          }, {} as Record<string, any>)
        };
        
        console.log("🚀 Applying multi-page template:", {
          pagesCount: processedPages.length,
          settingsKeys: Object.keys(enhancedSettings)
        });
        
        // Save the multi-page template
        const success = await saveWebsite([], {}, enhancedSettings);
        
        if (success) {
          markTemplateAsApplied();
          console.log("✅ Multi-page template applied and saved successfully");
          toast.success(`Multi-page template applied successfully! (${processedPages.length} pages)`);
        } else {
          throw new Error("Failed to save multi-page template");
        }
      } else {
        // Single page template
        console.log("📄 Processing single-page template with", templateElements.length, "elements");
        
        const elementsWithIds = processElements(templateElements);
        
        console.log("🚀 Applying single-page template elements:", elementsWithIds.length);
        
        updateElements(elementsWithIds);
        
        const success = await saveWebsite(elementsWithIds);
        
        if (success) {
          markTemplateAsApplied();
          console.log("✅ Single-page template applied and saved successfully");
          toast.success("Template applied successfully!");
        } else {
          throw new Error("Failed to save single-page template");
        }
      }
      
      setTimeout(() => {
        setShowTemplateSelection(false);
        setIsApplyingTemplate(false);
      }, 100);
      
    } catch (error) {
      console.error("❌ Error applying enhanced template:", error);
      toast.error("Failed to apply template. Please try again.");
      setIsApplyingTemplate(false);
    }
  }, [updateElements, saveWebsite, markTemplateAsApplied, setShowTemplateSelection, setIsApplyingTemplate]);

  const handleTemplateSelect = useCallback(async (templateData: any) => {
    console.log("🎨 Enhanced template selected:", templateData);
    
    setIsApplyingTemplate(true);
    await applyTemplateElements(templateData);
  }, [applyTemplateElements, setIsApplyingTemplate]);

  const handleSkipTemplate = useCallback(async () => {
    console.log("📝 Starting with blank canvas");
    setIsApplyingTemplate(true);
    setShowTemplateSelection(false);
    
    console.log("🧹 Updating elements to empty array (skip)");
    updateElements([]);
    
    const success = await saveWebsite([]);
    if (success) {
      markTemplateAsApplied();
    }
    
    toast.success("Starting with blank canvas");
    setTimeout(() => {
      setIsApplyingTemplate(false);
    }, 100);
  }, [updateElements, saveWebsite, markTemplateAsApplied, setIsApplyingTemplate, setShowTemplateSelection]);

  return {
    handleTemplateSelect,
    handleSkipTemplate,
    applyTemplateElements
  };
};
