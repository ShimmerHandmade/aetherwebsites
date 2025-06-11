
import React, { useState, useCallback, useEffect, useRef } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import TemplateSelection from "@/components/TemplateSelection";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useWebsite } from "@/hooks/useWebsite";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const hasProcessedInitialContent = useRef(false);
  const templateAppliedRef = useRef(false);
  
  const { 
    website,
    isLoading,
    isSaving,
    isPublishing,
    websiteName,
    elements,
    pageSettings,
    setWebsiteName,
    saveWebsite,
    publishWebsite,
    updateElements,
    refreshWebsite,
    lastSaved,
    unsavedChanges
  } = useWebsite(id, navigate, { autoSave: false });
  
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  const pages = website?.settings?.pages || [];

  // Debug logging for elements state
  useEffect(() => {
    console.log("🔍 SimpleBuilder: Elements state changed:", {
      elementsLength: elements?.length || 0,
      elements: elements,
      isLoading,
      websiteId: id,
      isApplyingTemplate,
      templateApplied: templateAppliedRef.current,
      hasProcessedInitialContent: hasProcessedInitialContent.current
    });
  }, [elements, isLoading, id, isApplyingTemplate]);

  // Check if this is first visit and website has no content
  useEffect(() => {
    if (website && !isLoading && !hasProcessedInitialContent.current && !isApplyingTemplate) {
      const hasContent = elements && elements.length > 0;
      const hasVisitedBefore = localStorage.getItem(`visited-${website.id}`);
      
      console.log("🔍 SimpleBuilder: Checking first visit:", { 
        hasContent, 
        elementsLength: elements?.length,
        websiteId: website.id,
        hasVisitedBefore: !!hasVisitedBefore,
        isApplyingTemplate,
        templateApplied: templateAppliedRef.current
      });
      
      // Only show onboarding if no content AND no template has been applied AND hasn't visited before
      if (!hasContent && !hasVisitedBefore && !templateAppliedRef.current) {
        console.log("🎯 SimpleBuilder: First visit with no content, showing onboarding");
        setIsFirstVisit(true);
        setShowOnboarding(true);
        // Mark as visited to prevent re-showing onboarding
        localStorage.setItem(`visited-${website.id}`, 'true');
      } else {
        console.log("✅ SimpleBuilder: Content found or returning visit, proceeding to builder");
        setShowTemplateSelection(false);
        setShowOnboarding(false);
      }
      
      hasProcessedInitialContent.current = true;
    }
  }, [website, isLoading, elements, isApplyingTemplate]);

  useEffect(() => {
    if (website && website.settings?.pages && website.settings.pages.length > 0) {
      const homePage = website.settings.pages.find(page => page.isHomePage) || website.settings.pages[0];
      if (!currentPage || currentPage.id !== homePage.id) {
        setCurrentPage(homePage);
      }
    }
  }, [website, currentPage]);

  useEffect(() => {
    if (lastSaved) {
      setSaveStatus(`Last saved ${lastSaved.toLocaleTimeString()}`);
    } else {
      setSaveStatus('');
    }
  }, [lastSaved]);

  useEffect(() => {
    if (unsavedChanges) {
      setSaveStatus("Unsaved changes");
    }
  }, [unsavedChanges]);

  const handleSave = async () => {
    const success = await saveWebsite();
    if (success) {
      setSaveStatus(`Last saved ${new Date().toLocaleTimeString()}`);
    }
  };

  const handlePublish = async () => {
    await publishWebsite();
  };

  const handleBuilderSave = async (elements: BuilderElement[], pageSettings: PageSettings) => {
    console.log("💾 SimpleBuilder: Saving from builder with elements:", elements?.length || 0);
    const success = await saveWebsite(elements, pageSettings);
    if (success) {
      // Mark that content has been successfully saved
      templateAppliedRef.current = true;
    }
    return success;
  };

  const handlePageChange = (pageId: string) => {
    console.log("Page changed to:", pageId);
    
    const selectedPage = pages.find(page => page.id === pageId);
    if (!selectedPage) {
      console.error("Page not found:", pageId);
      return;
    }
    
    setCurrentPage(selectedPage);
    
    const pageContent = website?.settings?.pagesContent?.[pageId] || [];
    updateElements(pageContent);
  };

  const handleOnboardingComplete = useCallback(async () => {
    console.log("🎓 SimpleBuilder: Onboarding complete, refreshing website data");
    
    setShowOnboarding(false);
    templateAppliedRef.current = true;
    
    // Refresh website data to get the saved template
    await refreshWebsite();
    
    toast.success("Welcome to your website builder!");
  }, [refreshWebsite]);

  const applyTemplateElements = useCallback(async (templateElements: any[]) => {
    try {
      console.log("🔧 SimpleBuilder: Processing template elements:", templateElements.length, "elements");
      
      // Ensure all elements have unique IDs
      const elementsWithIds = templateElements.map((element: any) => ({
        ...element,
        id: element.id || uuidv4(),
        children: element.children?.map((child: any) => ({
          ...child,
          id: child.id || uuidv4()
        })) || []
      }));
      
      console.log("🚀 SimpleBuilder: Applying elements to canvas:", elementsWithIds.length);
      
      // Apply elements to canvas
      updateElements(elementsWithIds);
      
      // Save immediately to ensure template persists
      const success = await saveWebsite(elementsWithIds);
      
      if (success) {
        templateAppliedRef.current = true;
        console.log("✅ SimpleBuilder: Template applied and saved successfully");
        toast.success(`Template applied successfully!`);
      } else {
        throw new Error("Failed to save template");
      }
      
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        setShowTemplateSelection(false);
        setIsApplyingTemplate(false);
      }, 100);
      
    } catch (error) {
      console.error("❌ SimpleBuilder: Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
      setIsApplyingTemplate(false);
    }
  }, [updateElements, saveWebsite]);

  const handleTemplateSelect = useCallback(async (templateData: any) => {
    console.log("🎨 SimpleBuilder: Template selected:", templateData);
    
    setIsApplyingTemplate(true);
    
    // Simplified template processing - just get the elements array
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
  }, [applyTemplateElements]);

  const handleSkipTemplate = async () => {
    console.log("📝 SimpleBuilder: Starting with blank canvas");
    setIsApplyingTemplate(true);
    setShowTemplateSelection(false);
    console.log("🧹 SimpleBuilder: Updating elements to empty array (skip)");
    updateElements([]);
    
    // Save the empty state immediately
    const success = await saveWebsite([]);
    if (success) {
      templateAppliedRef.current = true;
    }
    
    toast.success("Starting with blank canvas");
    setTimeout(() => {
      setIsApplyingTemplate(false);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  // Show onboarding flow for first-time visitors
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        websiteId={id!}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Show template selection screen for returning users with no content (should rarely happen now)
  if (showTemplateSelection && !isApplyingTemplate) {
    return (
      <div className="h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <TemplateSelection 
            onSelectTemplate={handleTemplateSelect}
            websiteId={id} 
            onComplete={() => setShowTemplateSelection(false)}
            onClose={handleSkipTemplate}
          />
        </div>
      </div>
    );
  }

  console.log("🏗️ SimpleBuilder: Rendering builder with", elements?.length || 0, "elements");

  return (
    <BuilderProvider 
      initialElements={elements || []}
      initialPageSettings={pageSettings || { title: websiteName || 'My Website' }}
      onSave={handleBuilderSave}
    >
      <SidebarProvider>
        <div className="h-screen flex bg-gray-50 w-full overflow-hidden">
          <BuilderSidebar isPreviewMode={isPreviewMode} />
          <div className="flex-1 flex flex-col min-w-0">
            <BuilderNavbar
              websiteName={websiteName}
              setWebsiteName={setWebsiteName}
              onSave={handleSave}
              onPublish={handlePublish}
              isPublished={website?.published}
              isSaving={isSaving}
              isPublishing={isPublishing}
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              currentPage={currentPage}
              pages={pages}
              onChangePage={handlePageChange}
              viewSiteUrl={`/site/${id}`}
              saveStatus={saveStatus}
            />
            <div className="flex-1 overflow-hidden">
              <BuilderContent 
                isPreviewMode={isPreviewMode}
                isLiveSite={false}
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </BuilderProvider>
  );
};

export default SimpleBuilder;
