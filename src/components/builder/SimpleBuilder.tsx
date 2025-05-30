
import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
    lastSaved,
    unsavedChanges
  } = useWebsite(id, navigate, { autoSave: false });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Initialize pages
  useEffect(() => {
    if (!website?.settings?.pages || website.settings.pages.length === 0) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('pageId');
    
    if (pageId && website.settings.pages.find(p => p.id === pageId)) {
      setCurrentPageId(pageId);
      return;
    }
    
    const homePage = website.settings.pages.find(page => page.isHomePage);
    const targetPageId = homePage?.id || website.settings.pages[0]?.id;
    
    if (targetPageId) {
      setCurrentPageId(targetPageId);
      if (!pageId) {
        navigate(`/builder/${id}?pageId=${targetPageId}`, { replace: true });
      }
    }
  }, [website, navigate, id]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId) return;
    
    console.log(`Loading content for page ID: ${currentPageId}`);
    console.log("Website content:", website.content);
    console.log("Website settings:", website.settings);
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    console.log("Page content from pagesContent:", pageContent);
    console.log("Page settings:", pageSettings);
    
    // Check if this is the home page and if we should use main content
    const homePage = website.settings.pages?.find(p => p.isHomePage);
    const isHomePage = homePage && homePage.id === currentPageId;
    
    let finalPageElements: BuilderElement[] = [];
    
    if (pageContent.length > 0) {
      // Use specific page content if it exists
      console.log("Using specific page content:", pageContent);
      finalPageElements = pageContent;
    } else if (isHomePage && Array.isArray(website.content) && website.content.length > 0) {
      // For home page, use main website content if no specific page content exists
      console.log("Using main website content for home page:", website.content);
      finalPageElements = website.content;
    } else if (Array.isArray(elements) && elements.length > 0) {
      // Fallback to elements from useWebsite hook
      console.log("Using fallback elements:", elements);
      finalPageElements = elements;
    } else {
      // No content available
      console.log("No content available, using empty array");
      finalPageElements = [];
    }
    
    console.log("Final page elements to set:", finalPageElements);
    setCurrentPageElements(finalPageElements);
    setCurrentPageSettings(pageSettings);
  }, [currentPageId, website, elements, websiteName]);

  const handleSave = useCallback(async () => {
    if (!currentPageId || !website) {
      toast.error("Cannot save: No page selected");
      return false;
    }
    
    try {
      // Request current data from BuilderProvider
      const saveEvent = new CustomEvent('request-save-data');
      document.dispatchEvent(saveEvent);
      
      // Small delay to allow the event to be processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.success("Changes saved successfully");
      return true;
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save website");
      return false;
    }
  }, [currentPageId, website]);

  const handleSaveComplete = useCallback(async (updatedElements: BuilderElement[], updatedPageSettings: PageSettings) => {
    if (!currentPageId || !website) return;

    try {
      const pagesContent = { ...(website.settings.pagesContent || {}) };
      const pagesSettings = { ...(website.settings.pagesSettings || {}) };
      
      pagesContent[currentPageId] = updatedElements;
      pagesSettings[currentPageId] = updatedPageSettings;
      
      const isHomePage = website.settings.pages?.find(p => p.isHomePage)?.id === currentPageId;
      
      const success = await saveWebsite(
        isHomePage ? updatedElements : website.content, 
        updatedPageSettings, 
        { ...website.settings, pagesContent, pagesSettings }
      );
      
      if (!success) {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Save completion error:", error);
      toast.error("Failed to save changes");
    }
  }, [currentPageId, website, saveWebsite]);
  
  const handleChangePage = useCallback((pageId: string) => {
    navigate(`/builder/${id}?pageId=${pageId}`);
  }, [id, navigate]);

  const handleShopLinkClick = useCallback(() => {
    navigate(`/builder/${id}/shop`);
  }, [id, navigate]);
  
  const handleReturnToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading builder..." />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist.</p>
          <button onClick={handleReturnToDashboard} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const pages = website?.settings?.pages || [];
  const currentPage = pages.find(page => page.id === currentPageId);

  console.log("Rendering SimpleBuilder with:", {
    currentPageElements: currentPageElements.length,
    currentPageSettings,
    currentPage
  });

  return (
    <ErrorBoundary>
      <CartProvider>
        <BuilderProvider 
          initialElements={currentPageElements} 
          initialPageSettings={currentPageSettings || { title: currentPage?.title || websiteName }}
          onSave={handleSaveComplete}
        >
          <BuilderLayout isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode}>
            <BuilderNavbar 
              websiteName={websiteName} 
              setWebsiteName={setWebsiteName} 
              onSave={handleSave} 
              onPublish={publishWebsite}
              isPublished={website?.published}
              isSaving={isSaving}
              isPublishing={isPublishing}
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              currentPage={currentPage}
              pages={pages}
              onChangePage={handleChangePage}
              onShopLinkClick={handleShopLinkClick}
              onReturnToDashboard={handleReturnToDashboard}
              viewSiteUrl={`/view/${id}`}
              saveStatus={isSaving ? "Saving..." : unsavedChanges ? "Unsaved changes" : ""}
            />
            <BuilderContent isPreviewMode={isPreviewMode} />
          </BuilderLayout>
        </BuilderProvider>
      </CartProvider>
    </ErrorBoundary>
  );
};

export default SimpleBuilder;
