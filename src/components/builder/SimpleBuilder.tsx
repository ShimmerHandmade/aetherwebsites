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
import { supabase } from "@/integrations/supabase/client";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import ErrorBoundary from "@/components/ErrorBoundary";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string>('home');

  console.log("🏗️ SimpleBuilder: Rendering", {
    id,
    isInitialized,
    currentPageId,
    isPreviewMode,
    isApplyingTemplate
  });

  // Early return if no ID
  if (!id) {
    console.error("❌ SimpleBuilder: No website ID provided");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: No website ID provided</p>
        </div>
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

  console.log("🏗️ SimpleBuilder: Website data", {
    website: !!website,
    isLoading,
    websiteName,
    elementsCount: elements?.length || 0,
    elementsType: Array.isArray(elements) ? "array" : typeof elements,
    pageSettings
  });

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

  // Simplified initialization
  useEffect(() => {
    console.log("🏗️ SimpleBuilder: Initialization useEffect", {
      website: !!website,
      isLoading,
      isInitialized,
      websiteId: website?.id
    });
    
    if (website && !isLoading && !isInitialized) {
      console.log("✅ SimpleBuilder: Initializing builder with website:", website.id);
      setIsInitialized(true);
      
      // Simple page setup
      const websitePages = website?.settings?.pages;
      if (websitePages && Array.isArray(websitePages) && websitePages.length > 0) {
        const homePage = websitePages.find(page => page.isHomePage) || websitePages[0];
        console.log("🏠 SimpleBuilder: Setting current page to:", homePage.id);
        setCurrentPageId(homePage.id);
      }
    }
  }, [website, isLoading, isInitialized]);

  // Simplified pages setup
  const pages = website?.settings?.pages && Array.isArray(website.settings.pages) && website.settings.pages.length > 0
    ? website.settings.pages
    : [{ id: "home", title: "Home", slug: "/", isHomePage: true }];

  const currentPage = pages.find(page => page.id === currentPageId) || pages[0];

  console.log("🏗️ SimpleBuilder: Pages data", {
    pagesCount: pages.length,
    currentPageId,
    currentPageTitle: currentPage?.title
  });

  // Simplified page content retrieval
  const getCurrentPageElements = useCallback(() => {
    try {
      console.log("📄 SimpleBuilder: Getting current page elements", {
        currentPageId: currentPage?.id,
        hasPagesContent: !!website?.settings?.pagesContent,
        hasElements: !!elements
      });
      
      if (!website?.settings?.pagesContent) {
        console.log("📄 SimpleBuilder: No pages content, returning elements:", elements?.length || 0);
        return elements || [];
      }
      
      const pageContent = website.settings.pagesContent[currentPage?.id];
      if (pageContent && Array.isArray(pageContent)) {
        console.log("📄 SimpleBuilder: Found page content:", pageContent.length);
        return pageContent;
      }
      
      console.log("📄 SimpleBuilder: No page content found, returning elements:", elements?.length || 0);
      return elements || [];
    } catch (error) {
      console.error("❌ SimpleBuilder: Error getting page elements:", error);
      return [];
    }
  }, [website?.settings?.pagesContent, currentPage?.id, elements]);

  const getCurrentPageSettings = useCallback(() => {
    try {
      if (!website?.settings?.pagesSettings) {
        return pageSettings || { title: websiteName || "My Website" };
      }
      
      const pageSettingsData = website.settings.pagesSettings[currentPage?.id];
      if (pageSettingsData) {
        return pageSettingsData;
      }
      
      return pageSettings || { title: websiteName || "My Website" };
    } catch (error) {
      console.error("❌ SimpleBuilder: Error getting page settings:", error);
      return { title: websiteName || "My Website" };
    }
  }, [website?.settings?.pagesSettings, currentPage?.id, pageSettings, websiteName]);

  const currentElements = getCurrentPageElements();
  const currentPageSettings = getCurrentPageSettings();

  console.log("🏗️ SimpleBuilder: Current page data", {
    currentElementsCount: currentElements?.length || 0,
    currentElementsType: Array.isArray(currentElements) ? "array" : typeof currentElements,
    currentPageSettings
  });

  // Enhanced template application
  const handleTemplateSelectEnhanced = useCallback(async (templateData: any) => {
    console.log("🎨 SimpleBuilder: Template selected:", templateData);
    
    setIsApplyingTemplate(true);
    
    try {
      let templateElements = [];
      let templatePages = [];
      let templateSettings = {};
      
      if (Array.isArray(templateData)) {
        templateElements = templateData;
      } else if (templateData.elements && Array.isArray(templateData.elements)) {
        templateElements = templateData.elements;
      } else if (templateData.template_data) {
        const data = templateData.template_data;
        templateElements = data.content || [];
        templatePages = data.pages || [];
        templateSettings = data.settings || {};
      } else if (templateData.content && Array.isArray(templateData.content)) {
        templateElements = templateData.content;
      }

      if (templatePages && templatePages.length > 0) {
        console.log("📄 SimpleBuilder: Multi-page template");
        
        const enhancedSettings = {
          ...templateSettings,
          pages: templatePages,
          pagesContent: templatePages.reduce((acc, page) => {
            acc[page.id] = page.content || [];
            return acc;
          }, {}),
          pagesSettings: templatePages.reduce((acc, page) => {
            acc[page.id] = page.settings || { title: page.title };
            return acc;
          }, {})
        };
        
        const defaultPageSettings: PageSettings = { title: websiteName || "My Website" };
        const success = await saveWebsite([], defaultPageSettings, enhancedSettings);
        if (success) {
          await refreshWebsite();
          const homePage = templatePages.find(p => p.isHomePage) || templatePages[0];
          if (homePage) {
            setCurrentPageId(homePage.id);
          }
        }
      } else {
        console.log("📄 SimpleBuilder: Single-page template");
        updateElements(templateElements);
        await saveWebsite(templateElements);
      }
      
      markTemplateAsApplied();
      toast.success("Template applied successfully!");
      
    } catch (error) {
      console.error("❌ SimpleBuilder: Error applying template:", error);
      toast.error("Failed to apply template. Please try again.");
    } finally {
      setTimeout(() => {
        setShowTemplateSelection(false);
        setIsApplyingTemplate(false);
      }, 100);
    }
  }, [updateElements, saveWebsite, markTemplateAsApplied, setShowTemplateSelection, refreshWebsite, websiteName]);

  // Simplified publish function
  const handlePublish = async () => {
    console.log("📤 Publishing website...");
    
    try {
      document.dispatchEvent(new CustomEvent('request-save-data'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const deploymentContent = {
        websiteId: id,
        content: currentElements,
        settings: {
          title: websiteName || "My Website",
          description: currentPageSettings?.meta?.description || `${websiteName} - Built with Aether Websites`,
          socialImage: currentPageSettings?.meta?.ogImage || "",
          pages: pages,
          pagesContent: website?.settings?.pagesContent || { [currentPage?.id]: currentElements },
          pagesSettings: website?.settings?.pagesSettings || { [currentPage?.id]: currentPageSettings },
          ...website?.settings
        }
      };
      
      const { data, error } = await supabase.functions.invoke('deploy-to-netlify', {
        body: deploymentContent
      });

      if (error) {
        console.error("❌ Deployment error:", error);
        toast.error("Failed to publish website");
        return;
      }

      await publishWebsite();
      toast.success("Website published successfully!", {
        description: `Your site is now live at ${data.url}`
      });
      
    } catch (error) {
      console.error("❌ Publish error:", error);
      toast.error("An error occurred while publishing");
    }
  };

  // Simplified save function
  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    if (!currentPage || !website) {
      console.error("❌ No current page or website for saving");
      return false;
    }

    try {
      const currentPagesContent = website.settings?.pagesContent || {};
      const currentPagesSettings = website.settings?.pagesSettings || {};
      
      const updatedSettings = {
        ...website.settings,
        pages: pages,
        pagesContent: {
          ...currentPagesContent,
          [currentPage.id]: elements,
        },
        pagesSettings: {
          ...currentPagesSettings,
          [currentPage.id]: pageSettings,
        }
      };

      const success = await saveWebsite(elements, pageSettings, updatedSettings);

      if (success) {
        toast.success(`${currentPage.title} page saved successfully`);
      } else {
        toast.error(`Failed to save ${currentPage.title} page`);
      }

      return success;
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.error("An error occurred while saving the page");
      return false;
    }
  }, [saveWebsite, currentPage, website, pages]);

  // Simplified page change handler
  const handlePageChange = useCallback(async (pageId: string) => {
    console.log("📄 Changing to page:", pageId);
    
    document.dispatchEvent(new CustomEvent('request-save-data'));
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setCurrentPageId(pageId);
    
    const newPage = pages.find(p => p.id === pageId);
    toast.success(`Switched to ${newPage?.title || 'page'}`);
  }, [pages]);

  // Loading state
  if (isLoading || !isInitialized) {
    console.log("🏗️ SimpleBuilder: Showing loading state", { isLoading, isInitialized });
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  // Onboarding flow
  if (showOnboarding) {
    console.log("🏗️ SimpleBuilder: Showing onboarding");
    return (
      <OnboardingFlow 
        websiteId={id!}
        onComplete={() => {
          setShowOnboarding(false);
          markTemplateAsApplied();
          refreshWebsite();
          toast.success("Welcome to your website builder!");
        }}
      />
    );
  }

  // Template selection
  if (showTemplateSelection && !isApplyingTemplate) {
    console.log("🏗️ SimpleBuilder: Showing template selection");
    return (
      <div className="h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <TemplateSelection 
            onSelectTemplate={handleTemplateSelectEnhanced}
            websiteId={id} 
            onComplete={() => setShowTemplateSelection(false)}
            onClose={handleSkipTemplate}
          />
        </div>
      </div>
    );
  }

  const handleMainSave = useCallback(async () => {
    console.log("💾 Save button clicked");
    document.dispatchEvent(new CustomEvent('request-save-data'));
  }, []);

  console.log("🏗️ SimpleBuilder: About to render builder interface", {
    currentElementsCount: currentElements?.length || 0,
    currentPageSettings
  });

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
