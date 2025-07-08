
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
      
      console.log("🔍 Website initialization check:", { 
        websiteId: website.id,
        hasContent, 
        elementsLength: elements?.length || 0,
        hasVisitedBefore: !!hasVisitedBefore,
        templateApplied: templateAppliedRef.current,
        isApplyingTemplate
      });
      
      // Show template selection if:
      // 1. No content exists
      // 2. User hasn't visited before
      // 3. Template hasn't been applied yet
      if (!hasContent && !hasVisitedBefore && !templateAppliedRef.current) {
        console.log("🎯 Showing template selection - first visit with no content");
        setShowTemplateSelection(true);
        setShowOnboarding(false);
        localStorage.setItem(`visited-${website.id}`, 'true');
      } else {
        console.log("✅ Proceeding to builder - content exists or returning visit");
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
