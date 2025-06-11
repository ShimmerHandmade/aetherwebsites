
import { useCallback } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement } from "@/contexts/builder/types";

interface UseTemplateApplicationProps {
  updateElements: (elements: BuilderElement[]) => void;
  saveWebsite: (elements?: BuilderElement[]) => Promise<boolean>;
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
  
  const applyTemplateElements = useCallback(async (templateElements: any[]) => {
    try {
      console.log("🔧 Processing template elements:", templateElements.length, "elements");
      
      const elementsWithIds = templateElements.map((element: any) => ({
        ...element,
        id: element.id || uuidv4(),
        children: element.children?.map((child: any) => ({
          ...child,
          id: child.id || uuidv4()
        })) || []
      }));
      
      console.log("🚀 Applying elements to canvas:", elementsWithIds.length);
      
      updateElements(elementsWithIds);
      
      const success = await saveWebsite(elementsWithIds);
      
      if (success) {
        markTemplateAsApplied();
        console.log("✅ Template applied and saved successfully");
        toast.success(`Template applied successfully!`);
      } else {
        throw new Error("Failed to save template");
      }
      
      setTimeout(() => {
        setShowTemplateSelection(false);
        setIsApplyingTemplate(false);
      }, 100);
      
    } catch (error) {
      console.error("❌ Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
      setIsApplyingTemplate(false);
    }
  }, [updateElements, saveWebsite, markTemplateAsApplied, setShowTemplateSelection, setIsApplyingTemplate]);

  const handleTemplateSelect = useCallback(async (templateData: any) => {
    console.log("🎨 Template selected:", templateData);
    
    setIsApplyingTemplate(true);
    
    let templateElements = [];
    
    if (Array.isArray(templateData)) {
      templateElements = templateData;
    } else if (templateData.elements && Array.isArray(templateData.elements)) {
      templateElements = templateData.elements;
    } else if (templateData.templateData?.content && Array.isArray(templateData.templateData.content)) {
      templateElements = templateData.templateData.content;
    } else if (templateData.content && Array.isArray(templateData.content)) {
      templateElements = templateData.content;
    } else {
      console.warn("Invalid template structure, using empty array");
      templateElements = [];
    }

    await applyTemplateElements(templateElements);
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
