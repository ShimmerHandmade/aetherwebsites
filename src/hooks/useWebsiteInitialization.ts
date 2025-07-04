
import { useState, useEffect, useRef } from "react";
import { BuilderElement } from "@/contexts/builder/types";

interface UseWebsiteInitializationProps {
  website: any;
  isLoading: boolean;
  elements: BuilderElement[];
  isApplyingTemplate: boolean;
}

export const useWebsiteInitialization = ({
  website,
  isLoading,
  elements,
  isApplyingTemplate
}: UseWebsiteInitializationProps) => {
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasProcessedInitialContent = useRef(false);
  const templateAppliedRef = useRef(false);

  useEffect(() => {
    if (website && !isLoading && !hasProcessedInitialContent.current && !isApplyingTemplate) {
      const hasContent = elements && elements.length > 0;
      const hasVisitedBefore = localStorage.getItem(`visited-${website.id}`);
      
      console.log("🔍 Checking initialization:", { 
        hasContent, 
        elementsLength: elements?.length,
        websiteId: website.id,
        hasVisitedBefore: !!hasVisitedBefore,
        templateApplied: templateAppliedRef.current
      });
      
      if (!hasContent && !hasVisitedBefore && !templateAppliedRef.current) {
        console.log("🎯 First visit with no content, showing template selection");
        setShowTemplateSelection(true);
        setShowOnboarding(false);
        localStorage.setItem(`visited-${website.id}`, 'true');
      } else {
        console.log("✅ Content found or returning visit, proceeding to builder");
        setShowTemplateSelection(false);
        setShowOnboarding(false);
      }
      
      hasProcessedInitialContent.current = true;
    }
  }, [website, isLoading, elements, isApplyingTemplate]);

  const markTemplateAsApplied = () => {
    console.log("✅ Template marked as applied");
    templateAppliedRef.current = true;
    setShowTemplateSelection(false);
    setShowOnboarding(false);
    hasProcessedInitialContent.current = true;
  };

  return {
    showTemplateSelection,
    setShowTemplateSelection,
    showOnboarding,
    setShowOnboarding,
    templateAppliedRef,
    markTemplateAsApplied
  };
};
