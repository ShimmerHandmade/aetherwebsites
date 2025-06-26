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

  // Simplified initialization - wait for website to load
  useEffect(() => {
    if (website && !isLoading && !isInitialized) {
      console.log("✅ SimpleBuilder: Website loaded, initializing builder");
      setIsInitialized(true);
      
      // Set the initial current page
      const homePage = pages.find(page => page.isHomePage);
      if (homePage) {
        setCurrentPageId(homePage.id);
      } else if (pages.length > 0) {
        setCurrentPageId(pages[0].id);
      }
    }
  }, [website, isLoading, isInitialized]);

  // Default pages setup
  const pages = website?.settings?.pages && Array.isArray(website.settings.pages) && website.settings.pages.length > 0
    ? website.settings.pages
    : [{ id: "home", title: "Home", slug: "/", isHomePage: true }];

  const currentPage = pages.find(page => page.id === currentPageId) || pages[0];

  // Get elements for current page
  const currentElements = website?.settings?.pagesContent?.[currentPage?.id] || elements || [];
  const currentPageSettings = website?.settings?.pagesSettings?.[currentPage?.id] || pageSettings || { title: websiteName || "My Website" };

  const handlePublish = async () => {
    console.log("📤 Publishing website to aetherwebsites.com subdomain...");
    
    try {
      // First save the current state
      await saveWebsite();
      
      // Prepare complete website data for deployment
      const deploymentContent = {
        websiteId: id,
        content: currentElements,
        settings: {
          title: websiteName || "My Website",
          description: currentPageSettings?.meta?.description || `${websiteName} - Built with Aether Websites`,
          socialImage: currentPageSettings?.meta?.ogImage || "",
          ...currentPageSettings,
          pages: pages,
          pagesContent: website?.settings?.pagesContent || { [currentPage?.id]: currentElements },
          pagesSettings: website?.settings?.pagesSettings || { [currentPage?.id]: currentPageSettings }
        }
      };
      
      console.log("🚀 Sending deployment data:", deploymentContent);
      
      // Deploy to aetherwebsites.com subdomain
      const { data, error } = await supabase.functions.invoke('deploy-to-netlify', {
        body: deploymentContent
      });

      if (error) {
        console.error("❌ Deployment error:", error);
        toast.error("Failed to publish website");
        return;
      }

      console.log("✅ Website deployed:", data);
      
      // Update the website as published
      await publishWebsite();
      
      toast.success("Website published successfully!", {
        description: `Your site is now live at ${data.url}`
      });
      
    } catch (error) {
      console.error("❌ Publish error:", error);
      toast.error("An error occurred while publishing");
    }
  };

  const handleMainSave = useCallback(async () => {
    console.log("💾 SimpleBuilder: Save button clicked");
    document.dispatchEvent(new CustomEvent('request-save-data'));
  }, []);

  const handleBuilderSaveWrapper = useCallback(async (elements: BuilderElement[], pageSettings: PageSettings) => {
    if (!currentPage || !website) {
      console.error("❌ SimpleBuilder: No current page or website for saving");
      return false;
    }

    console.log("💾 SimpleBuilder: Saving page content", {
      pageId: currentPage.id,
      elementsCount: elements?.length || 0
    });

    try {
      const updatedSettings = {
        ...website.settings,
        pagesContent: {
          ...(website.settings?.pagesContent || {}),
          [currentPage.id]: elements,
        },
        pagesSettings: {
          ...(website.settings?.pagesSettings || {}),
          [currentPage.id]: pageSettings,
        },
        pages: website.settings?.pages || pages,
      };

      const success = await saveWebsite(elements, pageSettings, updatedSettings);

      if (success) {
        toast.success("Page saved successfully");
      } else {
        toast.error("Failed to save page");
      }

      return success;
    } catch (error) {
      console.error("❌ SimpleBuilder: Save error:", error);
      toast.error("An error occurred while saving");
      return false;
    }
  }, [saveWebsite, currentPage, website, pages]);

  const handlePageChange = useCallback(async (pageId: string) => {
    console.log("📄 SimpleBuilder: Page change to:", pageId);
    
    // Save current page before switching
    document.dispatchEvent(new CustomEvent('request-save-data'));
    
    // Wait a moment for save to complete
    setTimeout(() => {
      setCurrentPageId(pageId);
      toast.success(`Switched to ${pages.find(p => p.id === pageId)?.title || 'page'}`);
    }, 100);
  }, [pages]);

  const handleOnboardingComplete = useCallback(async () => {
    console.log("🎓 Onboarding complete");
    setShowOnboarding(false);
    markTemplateAsApplied();
    await refreshWebsite();
    toast.success("Welcome to your website builder!");
  }, [refreshWebsite, markTemplateAsApplied, setShowOnboarding]);

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
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Template selection
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

  console.log("🏗️ SimpleBuilder: Rendering builder with elements:", currentElements?.length || 0);

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
