
import React, { useState, useCallback, useEffect } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import MobileBuilderSidebar from "@/components/builder/MobileBuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import TemplateSelection from "@/components/TemplateSelection";
import { useWebsite } from "@/hooks/useWebsite";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useTemplateApplication } from "@/hooks/useTemplateApplication";
import { useBuilderSave } from "@/hooks/useBuilderSave";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import ErrorBoundary from "@/components/ErrorBoundary";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string>('home');

  console.log("🏗️ SimpleBuilder: Starting", { id, currentPageId });

  if (!id) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">Error: No website ID provided</p>
      </div>
    );
  }

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

  // Simplified pages
  const pages = website?.settings?.pages || [{ id: "home", title: "Home", slug: "/", isHomePage: true }];
  const currentPage = pages.find(page => page.id === currentPageId) || pages[0];

  // Simplified element retrieval
  const getCurrentPageElements = useCallback(() => {
    if (website?.settings?.pagesContent?.[currentPageId]) {
      return website.settings.pagesContent[currentPageId];
    }
    return elements || [];
  }, [website?.settings?.pagesContent, currentPageId, elements]);

  const getCurrentPageSettings = useCallback(() => {
    if (website?.settings?.pagesSettings?.[currentPageId]) {
      return website.settings.pagesSettings[currentPageId];
    }
    return pageSettings || { title: websiteName || "My Website" };
  }, [website?.settings?.pagesSettings, currentPageId, pageSettings, websiteName]);

  const currentElements = getCurrentPageElements();
  const currentPageSettings = getCurrentPageSettings();

  // Simplified publish
  const handlePublish = async () => {
    try {
      document.dispatchEvent(new CustomEvent('request-save-data'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deploymentContent = {
        websiteId: id,
        content: currentElements,
        settings: {
          title: websiteName || "My Website",
          pages: pages,
          pagesContent: { [currentPageId]: currentElements },
          pagesSettings: { [currentPageId]: currentPageSettings },
          ...website?.settings
        }
      };
      
      const { data, error } = await supabase.functions.invoke('deploy-to-netlify', {
        body: deploymentContent
      });

      if (error) throw error;

      await publishWebsite();
      toast.success("Website published successfully!");
      
    } catch (error) {
      console.error("❌ Publish error:", error);
      toast.error("Failed to publish website");
    }
  };

  // Simplified save
  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    if (!currentPage || !website) return false;

    try {
      const updatedSettings = {
        ...website.settings,
        pages: pages,
        pagesContent: {
          ...website.settings?.pagesContent,
          [currentPage.id]: elements,
        },
        pagesSettings: {
          ...website.settings?.pagesSettings,
          [currentPage.id]: pageSettings,
        }
      };

      const success = await saveWebsite(elements, pageSettings, updatedSettings);
      if (success) {
        toast.success("Page saved successfully");
      }
      return success;
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.error("Failed to save page");
      return false;
    }
  }, [saveWebsite, currentPage, website, pages]);

  const handlePageChange = useCallback(async (pageId: string) => {
    document.dispatchEvent(new CustomEvent('request-save-data'));
    await new Promise(resolve => setTimeout(resolve, 200));
    setCurrentPageId(pageId);
  }, []);

  const handleMainSave = useCallback(() => {
    document.dispatchEvent(new CustomEvent('request-save-data'));
  }, []);

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

  // Show template selection directly (no OnboardingFlow)
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

  console.log("🏗️ SimpleBuilder: Rendering builder interface");

  return (
    <ErrorBoundary>
      <BuilderProvider
        initialElements={currentElements}
        initialPageSettings={currentPageSettings}
        onSave={handleBuilderSaveWrapper}
      >
        {isMobile ? (
          <div className="h-screen flex flex-col bg-gray-50 w-full overflow-hidden">
            <BuilderNavbar
              websiteName={websiteName}
              setWebsiteName={setWebsiteName}
              onSave={handleMainSave}
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
            <MobileBuilderSidebar isPreviewMode={isPreviewMode} />
          </div>
        ) : (
          <SidebarProvider>
            <div className="h-screen flex bg-gray-50 w-full overflow-hidden">
              <BuilderSidebar isPreviewMode={isPreviewMode} />
              <div className="flex-1 flex flex-col min-w-0">
                <BuilderNavbar
                  websiteName={websiteName}
                  setWebsiteName={setWebsiteName}
                  onSave={handleMainSave}
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
        )}
      </BuilderProvider>
    </ErrorBoundary>
  );
};

export default SimpleBuilder;
