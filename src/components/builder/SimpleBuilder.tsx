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
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { useResponsiveControls } from "@/hooks/useResponsiveControls";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  const [currentElements, setCurrentElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);
  
  const {
    previewBreakpoint,
    // ... keep existing code ...
  } = useResponsiveControls();

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

  // Initialize current page and load its content
  useEffect(() => {
    console.log("🔄 SimpleBuilder: Website data changed", {
      websiteId: website?.id,
      pagesCount: pages.length,
      currentPageId: currentPage?.id
    });

    if (website && pages.length > 0) {
      const homePage = pages.find(page => page.isHomePage) || pages[0];
      
      if (!currentPage || currentPage.id !== homePage.id) {
        console.log("📄 SimpleBuilder: Setting current page to", homePage.title);
        setCurrentPage(homePage);
        
        // Load the page content with better fallback handling
        const pageContent = website.settings?.pagesContent?.[homePage.id] || [];
        const pageSettingsData = website.settings?.pagesSettings?.[homePage.id] || { 
          title: websiteName || homePage.title || 'My Website' 
        };
        
        console.log("📝 SimpleBuilder: Loading page content", {
          pageId: homePage.id,
          elementsCount: pageContent.length,
          pageSettings: pageSettingsData
        });
        
        setCurrentElements(pageContent);
        setCurrentPageSettings(pageSettingsData);
        updateElements(pageContent);
      }
    }
  }, [website, pages, currentPage, websiteName, updateElements]);

  // Initialize elements from the useWebsite hook when it loads
  useEffect(() => {
    if (elements && elements.length > 0 && currentElements.length === 0) {
      console.log("🔄 SimpleBuilder: Initializing elements from useWebsite hook", elements.length);
      setCurrentElements(elements);
    }
  }, [elements, currentElements.length]);

  // Initialize page settings
  useEffect(() => {
    if (pageSettings && !currentPageSettings) {
      console.log("🔄 SimpleBuilder: Initializing page settings from useWebsite hook");
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

  // Enhanced save handler that properly saves page content
  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    console.log("💾 SimpleBuilder: Handling save from builder", {
      elementsCount: elements?.length || 0,
      pageId: currentPage?.id,
      pageSettings
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
        totalPages: Object.keys(updatedSettings.pagesContent || {}).length
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
  }, [saveWebsite, updateElements, currentPage, website?.settings]);

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

  console.log("🏗️ SimpleBuilder: Rendering builder", {
    currentElementsCount: currentElements.length,
    currentPageId: currentPage?.id,
    currentPageTitle: currentPage?.title,
    currentPageSettings
  });

  return (
    <BuilderProvider 
      initialElements={currentElements}
      initialPageSettings={currentPageSettings || { title: websiteName || 'My Website' }}
      onSave={handleBuilderSaveWrapper}
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
