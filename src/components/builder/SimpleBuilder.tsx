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

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string>('home');

  console.log("🏗️ SimpleBuilder: Rendering with ID:", id);

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

  // Enhanced initialization with better page management
  useEffect(() => {
    if (website && !isLoading && !isInitialized) {
      console.log("✅ SimpleBuilder: Website loaded, initializing builder");
      setIsInitialized(true);
      
      // Ensure we have proper page structure
      const websitePages = website?.settings?.pages;
      if (!websitePages || !Array.isArray(websitePages) || websitePages.length === 0) {
        console.log("🏠 SimpleBuilder: No pages found, will use default home page");
        setCurrentPageId('home');
      } else {
        const homePage = websitePages.find(page => page.isHomePage);
        if (homePage) {
          setCurrentPageId(homePage.id);
        } else if (websitePages.length > 0) {
          setCurrentPageId(websitePages[0].id);
        }
      }
    }
  }, [website, isLoading, isInitialized]);

  // Enhanced pages setup with proper defaults
  const pages = website?.settings?.pages && Array.isArray(website.settings.pages) && website.settings.pages.length > 0
    ? website.settings.pages
    : [{ id: "home", title: "Home", slug: "/", isHomePage: true }];

  const currentPage = pages.find(page => page.id === currentPageId) || pages[0];

  // Enhanced page content retrieval
  const getCurrentPageElements = useCallback(() => {
    if (!website?.settings?.pagesContent) {
      return elements || [];
    }
    
    const pageContent = website.settings.pagesContent[currentPage?.id];
    if (pageContent && Array.isArray(pageContent)) {
      return pageContent;
    }
    
    // Fallback to main elements for backward compatibility
    return elements || [];
  }, [website?.settings?.pagesContent, currentPage?.id, elements]);

  const getCurrentPageSettings = useCallback(() => {
    if (!website?.settings?.pagesSettings) {
      return pageSettings || { title: websiteName || "My Website" };
    }
    
    const pageSettingsData = website.settings.pagesSettings[currentPage?.id];
    if (pageSettingsData) {
      return pageSettingsData;
    }
    
    // Fallback to main page settings for backward compatibility
    return pageSettings || { title: websiteName || "My Website" };
  }, [website?.settings?.pagesSettings, currentPage?.id, pageSettings, websiteName]);

  const currentElements = getCurrentPageElements();
  const currentPageSettings = getCurrentPageSettings();

  // Enhanced template application to support multi-page templates
  const handleTemplateSelectEnhanced = useCallback(async (templateData: any) => {
    console.log("🎨 SimpleBuilder: Enhanced template selected:", templateData);
    
    setIsApplyingTemplate(true);
    
    try {
      let templateElements = [];
      let templatePages = [];
      let templateSettings = {};
      
      // Handle different template structures
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

      // If template has multiple pages, set them up properly
      if (templatePages && templatePages.length > 0) {
        console.log("📄 SimpleBuilder: Template has multiple pages:", templatePages);
        
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
        
        // Save the enhanced multi-page template with proper PageSettings
        const defaultPageSettings: PageSettings = { title: websiteName || "My Website" };
        const success = await saveWebsite([], defaultPageSettings, enhancedSettings);
        if (success) {
          await refreshWebsite();
          // Set current page to the first page or home page
          const homePage = templatePages.find(p => p.isHomePage) || templatePages[0];
          if (homePage) {
            setCurrentPageId(homePage.id);
          }
        }
      } else {
        // Single page template - apply to current page
        updateElements(templateElements);
        const success = await saveWebsite(templateElements);
        if (success) {
          console.log("✅ SimpleBuilder: Single page template applied successfully");
        }
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

  // Enhanced publish function for multi-page websites
  const handlePublish = async () => {
    console.log("📤 Publishing multi-page website to aetherwebsites.com subdomain...");
    
    try {
      // First save the current page state
      document.dispatchEvent(new CustomEvent('request-save-data'));
      
      // Wait a moment for save to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prepare complete multi-page website data for deployment
      const deploymentContent = {
        websiteId: id,
        content: currentElements, // Main page content for backward compatibility
        settings: {
          title: websiteName || "My Website",
          description: currentPageSettings?.meta?.description || `${websiteName} - Built with Aether Websites`,
          socialImage: currentPageSettings?.meta?.ogImage || "",
          pages: pages,
          pagesContent: website?.settings?.pagesContent || { [currentPage?.id]: currentElements },
          pagesSettings: website?.settings?.pagesSettings || { [currentPage?.id]: currentPageSettings },
          // Include all current website settings
          ...website?.settings
        }
      };
      
      console.log("🚀 SimpleBuilder: Sending multi-page deployment data:", {
        websiteId: deploymentContent.websiteId,
        pagesCount: deploymentContent.settings.pages?.length || 0,
        contentPagesCount: Object.keys(deploymentContent.settings.pagesContent || {}).length
      });
      
      // Deploy to aetherwebsites.com subdomain
      const { data, error } = await supabase.functions.invoke('deploy-to-netlify', {
        body: deploymentContent
      });

      if (error) {
        console.error("❌ SimpleBuilder: Deployment error:", error);
        toast.error("Failed to publish website");
        return;
      }

      console.log("✅ SimpleBuilder: Multi-page website deployed:", data);
      
      // Update the website as published
      await publishWebsite();
      
      toast.success("Website published successfully!", {
        description: `Your multi-page site is now live at ${data.url}`
      });
      
    } catch (error) {
      console.error("❌ SimpleBuilder: Publish error:", error);
      toast.error("An error occurred while publishing");
    }
  };

  // Enhanced save function for individual pages
  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    if (!currentPage || !website) {
      console.error("❌ SimpleBuilder: No current page or website for saving");
      return false;
    }

    console.log("💾 SimpleBuilder: Saving individual page content", {
      pageId: currentPage.id,
      pageTitle: currentPage.title,
      elementsCount: elements?.length || 0
    });

    try {
      // Ensure we have proper page structure in settings
      const currentPagesContent = website.settings?.pagesContent || {};
      const currentPagesSettings = website.settings?.pagesSettings || {};
      
      const updatedSettings = {
        ...website.settings,
        pages: pages, // Ensure pages array is always present
        pagesContent: {
          ...currentPagesContent,
          [currentPage.id]: elements,
        },
        pagesSettings: {
          ...currentPagesSettings,
          [currentPage.id]: pageSettings,
        }
      };

      console.log("💾 SimpleBuilder: Saving with updated settings:", {
        pageId: currentPage.id,
        totalPages: pages.length,
        contentPages: Object.keys(updatedSettings.pagesContent).length,
        settingsPages: Object.keys(updatedSettings.pagesSettings).length
      });

      const success = await saveWebsite(elements, pageSettings, updatedSettings);

      if (success) {
        toast.success(`${currentPage.title} page saved successfully`);
      } else {
        toast.error(`Failed to save ${currentPage.title} page`);
      }

      return success;
    } catch (error) {
      console.error("❌ SimpleBuilder: Save error:", error);
      toast.error("An error occurred while saving the page");
      return false;
    }
  }, [saveWebsite, currentPage, website, pages]);

  // Enhanced page change handler with proper saving
  const handlePageChange = useCallback(async (pageId: string) => {
    console.log("📄 SimpleBuilder: Enhanced page change to:", pageId);
    
    // Save current page before switching
    document.dispatchEvent(new CustomEvent('request-save-data'));
    
    // Wait for save to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Switch to new page
    setCurrentPageId(pageId);
    
    const newPage = pages.find(p => p.id === pageId);
    toast.success(`Switched to ${newPage?.title || 'page'}`);
  }, [pages]);

  // Loading state
  if (isLoading || !isInitialized) {
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

  console.log("🏗️ SimpleBuilder: Rendering builder with enhanced page support:", {
    currentPageId,
    currentPageTitle: currentPage?.title,
    elementsCount: currentElements?.length || 0,
    totalPages: pages.length
  });

  const handleMainSave = useCallback(async () => {
    console.log("💾 SimpleBuilder: Save button clicked");
    document.dispatchEvent(new CustomEvent('request-save-data'));
  }, []);

  return (
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
  );
};

export default SimpleBuilder;
