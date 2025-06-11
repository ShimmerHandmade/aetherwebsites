import React, { useState, useCallback } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import TemplateSelection from "@/components/TemplateSelection";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useWebsite } from "@/hooks/useWebsite";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useTemplateApplication } from "@/hooks/useTemplateApplication";
import { useBuilderSave } from "@/hooks/useBuilderSave";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  
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

  const {
    showTemplateSelection,
    setShowTemplateSelection,
    showOnboarding,
    setShowOnboarding,
    markTemplateAsApplied
  } = useWebsiteInitialization({
    website,
    isLoading,
    elements,
    isApplyingTemplate
  });

  const {
    handleTemplateSelect,
    handleSkipTemplate
  } = useTemplateApplication({
    updateElements,
    saveWebsite,
    setIsApplyingTemplate,
    setShowTemplateSelection,
    markTemplateAsApplied
  });

  const {
    saveStatus,
    handleSave,
    handleBuilderSave
  } = useBuilderSave({
    saveWebsite,
    lastSaved,
    unsavedChanges
  });

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

  const handlePublish = async () => {
    await publishWebsite();
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
    console.log("🎓 Onboarding complete, refreshing website data");
    
    setShowOnboarding(false);
    markTemplateAsApplied();
    
    await refreshWebsite();
    
    toast.success("Welcome to your website builder!");
  }, [refreshWebsite, markTemplateAsApplied, setShowOnboarding]);

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

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        websiteId={id!}
        onComplete={handleOnboardingComplete}
      />
    );
  }

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
