
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
  
  const processElements = useCallback((elements: any[]): BuilderElement[] => {
    if (!Array.isArray(elements)) {
      console.warn("⚠️ processElements: Input is not an array:", elements);
      return [];
    }
    
    return elements.map((element: any) => ({
      ...element,
      id: element.id || uuidv4(),
      children: element.children ? processElements(element.children) : []
    }));
  }, []);

  const applyTemplateElements = useCallback(async (templateData: any) => {
    try {
      console.log("🔧 Processing template data:", templateData);
      
      let templateElements = [];
      
      // Handle different template data structures
      if (templateData && typeof templateData === 'object') {
        // Check if it's a Supabase Template object
        if (templateData.template_data) {
          console.log("📄 Processing Supabase template data");
          const data = templateData.template_data;
          
          // Handle different content structures within template_data
          if (data.content && Array.isArray(data.content)) {
            templateElements = data.content;
          } else if (Array.isArray(data)) {
            templateElements = data;
          } else {
            console.warn("⚠️ Unexpected template_data structure:", data);
          }
        } 
        // Handle direct array of elements
        else if (Array.isArray(templateData)) {
          templateElements = templateData;
        } 
        // Handle object with elements property
        else if (templateData.elements && Array.isArray(templateData.elements)) {
          templateElements = templateData.elements;
        } 
        // Handle object with content property
        else if (templateData.content && Array.isArray(templateData.content)) {
          templateElements = templateData.content;
        }
        else {
          console.warn("⚠️ Unrecognized template data structure:", templateData);
        }
      }
      
      console.log("🎯 Extracted template elements:", templateElements.length);
      
      if (!Array.isArray(templateElements) || templateElements.length === 0) {
        console.warn("⚠️ No valid elements found in template");
        toast.error("Template contains no valid elements");
        return;
      }
      
      // Process elements to ensure they have proper IDs
      const elementsWithIds = processElements(templateElements);
      
      console.log("🚀 Applying template elements:", elementsWithIds.length);
      
      // Update the builder with new elements
      updateElements(elementsWithIds);
      
      // Save the website with new elements
      const success = await saveWebsite(elementsWithIds);
      
      if (success) {
        console.log("✅ Template applied and saved successfully");
        markTemplateAsApplied();
        toast.success("Template applied successfully!");
        
        // Close template selection
        setShowTemplateSelection(false);
      } else {
        throw new Error("Failed to save template");
      }
      
    } catch (error) {
      console.error("❌ Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [updateElements, saveWebsite, markTemplateAsApplied, setShowTemplateSelection, processElements]);

  const handleTemplateSelect = useCallback(async (templateData: any) => {
    console.log("🎨 Template selected:", templateData);
    
    setIsApplyingTemplate(true);
    
    // Add a small delay to ensure UI updates
    setTimeout(() => {
      applyTemplateElements(templateData);
    }, 100);
  }, [applyTemplateElements, setIsApplyingTemplate]);

  const handleSkipTemplate = useCallback(async () => {
    console.log("📝 Starting with blank canvas");
    setIsApplyingTemplate(true);
    
    try {
      updateElements([]);
      const success = await saveWebsite([]);
      
      if (success) {
        markTemplateAsApplied();
        toast.success("Starting with blank canvas");
        setShowTemplateSelection(false);
      }
    } catch (error) {
      console.error("❌ Error starting with blank canvas:", error);
      toast.error("Failed to initialize. Please try again.");
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [updateElements, saveWebsite, markTemplateAsApplied, setIsApplyingTemplate, setShowTemplateSelection]);

  return {
    handleTemplateSelect,
    handleSkipTemplate,
    applyTemplateElements
  };
};
