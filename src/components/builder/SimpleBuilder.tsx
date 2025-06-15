import React, { useState, useCallback, useEffect } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import MobileBuilderSidebar from "@/components/builder/MobileBuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import TemplateSelection from "@/components/TemplateSelection";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useWebsite } from "@/hooks/useWebsite";
import { useWebsiteInitialization } from "@/hooks/useWebsiteInitialization";
import { useTemplateApplication } from "@/hooks/useTemplateApplication";
import { useBuilderSave } from "@/hooks/useBuilderSave";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

const defaultHomePage = {
  id: "home",
  title: "Home",
  slug: "/",
  isHomePage: true,
};

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  const [currentElements, setCurrentElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

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

  const pages =
    website?.settings?.pages && Array.isArray(website.settings.pages) && website.settings.pages.length > 0
      ? website.settings.pages
      : [defaultHomePage];

  // Initialize current page and elements
  useEffect(() => {
    console.log("🔄 SimpleBuilder: Website/pages load detection", {
      websiteId: website?.id,
      pagesCount: pages.length,
      currentPageId: currentPage?.id
    });

    let chosenPage = currentPage && pages.some(p => p.id === currentPage.id)
      ? pages.find(p => p.id === currentPage.id)
      : pages.find(page => page.isHomePage) || pages[0];

    if (!chosenPage) {
      chosenPage = defaultHomePage;
    }

    const pagesContent = website?.settings?.pagesContent || {};
    const effectiveElements = pagesContent[chosenPage.id] || [];

    const pagesSettings = website?.settings?.pagesSettings || {};
    const settingsForCurrent = pagesSettings[chosenPage.id] || { 
      title: websiteName || chosenPage.title || 'My Website'
    };

    if (!currentPage || currentPage.id !== chosenPage.id) {
      setCurrentPage(chosenPage);
      setCurrentElements(effectiveElements);
      setCurrentPageSettings(settingsForCurrent);
      updateElements(effectiveElements);
      console.log("📄 SimpleBuilder: Set initial page to", chosenPage.title);
    }

    if (currentPage && currentPage.id === chosenPage.id && currentElements.length === 0 && effectiveElements.length > 0) {
      setCurrentElements(effectiveElements);
      updateElements(effectiveElements);
    }
    if (currentPage && currentPage.id === chosenPage.id && !currentPageSettings && settingsForCurrent) {
      setCurrentPageSettings(settingsForCurrent);
    }
  }, [
    website,
    pages,
    currentPage,
    websiteName,
    updateElements,
    currentElements.length,
    currentPageSettings
  ]);

  // Sync with useWebsite elements
  useEffect(() => {
    if (elements && elements.length > 0 && currentElements.length === 0) {
      setCurrentElements(elements);
    }
  }, [elements, currentElements.length]);

  useEffect(() => {
    if (pageSettings && !currentPageSettings) {
      setCurrentPageSettings(pageSettings);
    }
  }, [pageSettings, currentPageSettings]);

  const handlePublish = async () => {
    await publishWebsite();
  };

  // Main save handler that gets current data from BuilderProvider
  const handleMainSave = useCallback(async () => {
    console.log("💾 SimpleBuilder: Save button clicked, requesting current data from builder");
    
    // Dispatch event to request current data from BuilderProvider
    document.dispatchEvent(new CustomEvent('request-save-data'));
    
    // The actual save will be handled by the onSave callback from BuilderProvider
  }, []);

  // This gets called by BuilderProvider with the current state
  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    if (!currentPage) {
      console.error("❌ SimpleBuilder: No current page selected for saving");
      toast.error("No page selected for saving");
      return false;
    }

    console.log("💾 SimpleBuilder: Handling save from BuilderProvider", {
      elementsCount: elements?.length || 0,
      pageId: currentPage?.id,
      pageSettings,
      websiteName,
    });

    try {
      // Update local state first
      setCurrentElements(elements);
      setCurrentPageSettings(pageSettings);
      updateElements(elements);

      // Prepare the website settings with updated page content
      const previousSettings = website?.settings || {};
      const updatedSettings = {
        ...previousSettings,
        pagesContent: {
          ...(previousSettings.pagesContent || {}),
          [currentPage.id]: elements,
        },
        pagesSettings: {
          ...(previousSettings.pagesSettings || {}),
          [currentPage.id]: pageSettings,
        },
        pages: previousSettings.pages,
      };

      console.log("💾 SimpleBuilder: Saving with updated settings", {
        currentPageId: currentPage.id,
        websiteName,
        totalPages: Object.keys(updatedSettings.pagesContent || {}).length,
        updatedSettings
      });

      // Save to database with the updated settings
      const success = await saveWebsite(elements, pageSettings, updatedSettings);

      if (success) {
        console.log("✅ SimpleBuilder: Save successful");
        toast.success("Page saved successfully");
      } else {
        console.error("❌ SimpleBuilder: Save failed");
        toast.error("Failed to save page");
      }

      return success;
    } catch (error) {
      console.error("❌ SimpleBuilder: Save error:", error);
      toast.error("An error occurred while saving");
      return false;
    }
  }, [saveWebsite, updateElements, currentPage, website?.settings, websiteName]);

  const handlePageChange = useCallback((pageId: string) => {
    const selectedPage = pages.find((pg) => pg.id === pageId);
    if (!selectedPage) {
      console.error("❌ SimpleBuilder: Page not found:", pageId);
      return;
    }

    // Save before navigating if there are unsaved changes
    if (unsavedChanges && currentPage) {
      const previousSettings = website?.settings || {};
      const stagedSettings = {
        ...previousSettings,
        pagesContent: {
          ...(previousSettings.pagesContent || {}),
          [currentPage.id]: currentElements,
        },
        pagesSettings: {
          ...(previousSettings.pagesSettings || {}),
          [currentPage.id]: currentPageSettings,
        },
        pages: previousSettings.pages,
      };
      console.log("💾 [PAGE SWAP] Auto-save before page switch", {
        id: website?.id, pageId: currentPage.id,
        stagedSettings: JSON.parse(JSON.stringify(stagedSettings)),
      });
      saveWebsite(currentElements, currentPageSettings, stagedSettings);
    }

    setCurrentPage(selectedPage);

    // Load the right content for the new page
    const pageContent = website?.settings?.pagesContent?.[pageId] || [];
    const pageSettingsData = website?.settings?.pagesSettings?.[pageId] || { title: selectedPage.title };
    setCurrentElements(pageContent);
    setCurrentPageSettings(pageSettingsData);
    updateElements(pageContent);
  }, [
    pages, unsavedChanges, currentPage, currentElements, currentPageSettings, website?.settings, saveWebsite, updateElements,
  ]);

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

  return (
    <BuilderProvider
      initialElements={currentElements}
      initialPageSettings={currentPageSettings || { title: websiteName || "My Website" }}
      onSave={handleBuilderSaveWrapper}
    >
      {/* Conditionally render mobile or desktop layout */}
      {isMobile ? (
        // Mobile layout - no sidebar provider needed
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
        // Desktop layout - keep existing sidebar structure
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
  );
};

export default SimpleBuilder;
