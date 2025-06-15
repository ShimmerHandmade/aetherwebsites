import React, { useState, useCallback, useEffect } from "react";
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
import { useResponsiveControls } from "@/hooks/useResponsiveControls";
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

  useEffect(() => {
    console.log("🔄 SimpleBuilder: Website/pages load detection", {
      websiteId: website?.id,
      pagesCount: pages.length,
      currentPageId: currentPage?.id
    });

    // If no currentPage or currentPage is not found in pages, pick the home page (or first page)
    let chosenPage = currentPage && pages.some(p => p.id === currentPage.id)
      ? pages.find(p => p.id === currentPage.id)
      : pages.find(page => page.isHomePage) || pages[0];

    if (!chosenPage) {
      chosenPage = defaultHomePage;
    }

    // Fallback: ensure at least one root page content exists
    const pagesContent = website?.settings?.pagesContent || {};
    const effectiveElements = pagesContent[chosenPage.id] || [];

    // Fallback: page settings for this page
    const pagesSettings = website?.settings?.pagesSettings || {};
    const settingsForCurrent = pagesSettings[chosenPage.id] || { 
      title: websiteName || chosenPage.title || 'My Website'
    };

    // Set current page/elements/settings if not already set or if mismatched
    if (!currentPage || currentPage.id !== chosenPage.id) {
      setCurrentPage(chosenPage);
      setCurrentElements(effectiveElements);
      setCurrentPageSettings(settingsForCurrent);
      updateElements(effectiveElements); // propagate to useWebsite state
      console.log("📄 SimpleBuilder: Set initial page to", chosenPage.title);
    }
    // Also update elements and settings if they somehow became null/empty
    if (currentPage && currentPage.id === chosenPage.id && currentElements.length === 0 && effectiveElements.length > 0) {
      setCurrentElements(effectiveElements);
      updateElements(effectiveElements); // propagate
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

  const handlePageChange = useCallback((pageId: string) => {
    console.log("📄 SimpleBuilder: Page changed to:", pageId);
    
    const selectedPage = pages.find(page => page.id === pageId);
    if (!selectedPage) {
      console.error("❌ SimpleBuilder: Page not found:", pageId);
      return;
    }
    
    // Save current page before switching if there are unsaved changes
    if (unsavedChanges && currentPage) {
      console.log("💾 SimpleBuilder: Auto-saving current page before switch");
      const updatedSettings = {
        ...website?.settings,
        pagesContent: {
          ...website?.settings?.pagesContent,
          [currentPage.id]: currentElements
        },
        pagesSettings: {
          ...website?.settings?.pagesSettings,
          [currentPage.id]: currentPageSettings
        }
      };

      // Save asynchronously without waiting
      saveWebsite(currentElements, currentPageSettings, updatedSettings);
    }

    setCurrentPage(selectedPage);

    // Load the page content and settings with better error handling
    const pageContent = website?.settings?.pagesContent?.[pageId] || [];
    const pageSettingsData = website?.settings?.pagesSettings?.[pageId] || { 
      title: selectedPage.title 
    };

    console.log("📝 SimpleBuilder: Loading page content for", selectedPage.title, {
      elementsCount: pageContent.length,
      pageSettings: pageSettingsData
    });

    setCurrentElements(pageContent);
    setCurrentPageSettings(pageSettingsData);
    updateElements(pageContent);
  }, [pages, unsavedChanges, currentPage, currentElements, currentPageSettings, website?.settings, saveWebsite, updateElements]);

  const handleOnboardingComplete = useCallback(async () => {
    console.log("🎓 Onboarding complete, refreshing website data");

    setShowOnboarding(false);
    markTemplateAsApplied();

    await refreshWebsite();

    toast.success("Welcome to your website builder!");
  }, [refreshWebsite, markTemplateAsApplied, setShowOnboarding]);

  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    console.log("💾 SimpleBuilder: Handling save from builder", {
      elementsCount: elements?.length || 0,
      pageId: currentPage?.id,
      pageSettings,
      currentWebsite: website,
      websiteName: websiteName,
    });

    if (!currentPage) {
      console.error("❌ SimpleBuilder: No current page selected for saving");
      toast.error("No page selected for saving");
      return false;
    }

    try {
      // Update local state first
      setCurrentElements(elements);
      setCurrentPageSettings(pageSettings);
      updateElements(elements);

      // Prepare the website settings with updated page content
      const updatedSettings = {
        ...website?.settings,
        pagesContent: {
          ...website?.settings?.pagesContent,
          [currentPage.id]: elements
        },
        pagesSettings: {
          ...website?.settings?.pagesSettings,
          [currentPage.id]: pageSettings
        }
      };

      console.log("💾 SimpleBuilder: Saving with updated settings", {
        currentPageId: currentPage.id,
        websiteName,
        totalPages: Object.keys(updatedSettings.pagesContent || {}).length,
        updatedSettings
      });

      // Save to database with the updated settings
      const success = await saveWebsite(elements, pageSettings, updatedSettings);

      console.log("💾 SimpleBuilder: saveWebsite returned", success);

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

  function BuilderMain({
    isPreviewMode, setIsPreviewMode, currentPage, pages, websiteName,
    setWebsiteName, handleSave, handlePublish, website, isSaving,
    isPublishing, onChangePage, saveStatus
  }: any) {
    const { previewBreakpoint } = useResponsiveControls();

    return (
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
              onChangePage={onChangePage}
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
    );
  }

  return (
    <BuilderProvider 
      initialElements={currentElements}
      initialPageSettings={currentPageSettings || { title: websiteName || 'My Website' }}
      onSave={handleBuilderSaveWrapper}
    >
      <BuilderMain
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        currentPage={currentPage}
        pages={pages}
        websiteName={websiteName}
        setWebsiteName={setWebsiteName}
        handleSave={handleSave}
        handlePublish={handlePublish}
        website={website}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onChangePage={handlePageChange}
        saveStatus={saveStatus}
      />
    </BuilderProvider>
  );
};

export default SimpleBuilder;
