
import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";
import { useState, useEffect, useCallback, Suspense } from "react";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

const Builder = () => {
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
    refreshWebsite,
    lastSaved,
    unsavedChanges
  } = useWebsite(id, navigate, {
    autoSave: false, // Disable auto-save to prevent conflicts
    autoSaveInterval: 60000,
  });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isSavingManually, setIsSavingManually] = useState(false);

  // Update save status based on saving state
  useEffect(() => {
    if (isSaving || isSavingManually) {
      setSaveStatus('Saving...');
    } else if (unsavedChanges) {
      setSaveStatus('Unsaved changes');
    } else if (lastSaved) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setSaveStatus(`Saved ${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        setSaveStatus(`Saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else {
        const formattedTime = lastSaved.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        setSaveStatus(`Saved at ${formattedTime}`);
      }
    } else {
      setSaveStatus('');
    }
  }, [isSaving, isSavingManually, unsavedChanges, lastSaved]);

  // Check URL for preview mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get('preview');
    if (preview === 'true') {
      setIsPreviewMode(true);
    }
  }, []);

  // Initialize pages and set current page
  useEffect(() => {
    if (!website?.settings?.pages || website.settings.pages.length === 0) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('pageId');
    
    // Try to use pageId from URL first
    if (pageId && website.settings.pages.find(p => p.id === pageId)) {
      setCurrentPageId(pageId);
      return;
    }
    
    // Fall back to home page or first page
    const homePage = website.settings.pages.find(page => page.isHomePage);
    const targetPageId = homePage?.id || website.settings.pages[0]?.id;
    
    if (targetPageId) {
      setCurrentPageId(targetPageId);
      if (!pageId) {
        navigate(`/builder/${id}?pageId=${targetPageId}`, { replace: true });
      }
    }

    // Ensure required pages exist
    ensureRequiredPages();
  }, [website, navigate, id]);

  // Load page content when page changes
  useEffect(() => {
    if (!website || !currentPageId) return;
    
    try {
      const pagesContent = website.settings.pagesContent || {};
      const pageContent = pagesContent[currentPageId] || [];
      const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
      
      setCurrentPageElements(pageContent.length ? pageContent : elements || []);
      setCurrentPageSettings(pageSettings);
      
      console.log("📄 Loaded page content:", currentPageId, pageContent.length);
    } catch (error) {
      console.error("💥 Error loading page content:", error);
      toast.error("Failed to load page content");
    }
  }, [currentPageId, website, elements, websiteName]);

  // Ensure required pages exist
  const ensureRequiredPages = async () => {
    if (!website?.settings?.pages) return;
    
    let updatedPages = [...(website.settings.pages || [])];
    let hasChanged = false;
    
    // Check for Home page
    const homePage = updatedPages.find(page => page.isHomePage || page.title.toLowerCase() === 'home');
    if (!homePage) {
      updatedPages.push({
        id: uuidv4(),
        title: 'Home',
        slug: '/',
        isHomePage: true
      });
      hasChanged = true;
    }
    
    // Check for Shop page
    const shopPage = updatedPages.find(page => page.title.toLowerCase() === 'shop');
    if (!shopPage) {
      updatedPages.push({
        id: uuidv4(),
        title: 'Shop',
        slug: '/shop',
        isHomePage: false
      });
      hasChanged = true;
    }
    
    // Check for About page
    const aboutPage = updatedPages.find(page => page.title.toLowerCase() === 'about');
    if (!aboutPage) {
      updatedPages.push({
        id: uuidv4(),
        title: 'About',
        slug: '/about',
        isHomePage: false
      });
      hasChanged = true;
    }
    
    if (hasChanged && website) {
      try {
        await saveWebsite(website.content, website.pageSettings, {
          ...website.settings,
          pages: updatedPages
        });
        console.log("✅ Required pages created");
      } catch (error) {
        console.error("💥 Error creating pages:", error);
      }
    }
  };

  // Manual save handler
  const handleSave = useCallback(async () => {
    if (!currentPageId || !website) {
      toast.error("Cannot save: No page selected");
      return;
    }
    
    setIsSavingManually(true);
    try {
      console.log("💾 Manual save triggered");
      document.dispatchEvent(new CustomEvent('save-website'));
    } catch (error) {
      console.error("💥 Save error:", error);
      toast.error("Failed to save website");
    } finally {
      setIsSavingManually(false);
    }
  }, [currentPageId, website]);

  // Save completion handler
  const handleSaveComplete = useCallback(async (updatedElements: BuilderElement[], updatedPageSettings: PageSettings) => {
    if (!currentPageId || !website) {
      toast.error("Cannot save: Missing data");
      return;
    }

    console.log("💾 Completing save for page:", currentPageId);
    
    try {
      const pagesContent = { ...(website.settings.pagesContent || {}) };
      const pagesSettings = { ...(website.settings.pagesSettings || {}) };
      
      pagesContent[currentPageId] = updatedElements;
      pagesSettings[currentPageId] = updatedPageSettings;
      
      const isHomePage = website.settings.pages?.find(p => p.isHomePage)?.id === currentPageId;
      
      const success = await saveWebsite(
        isHomePage ? updatedElements : website.content, 
        updatedPageSettings, 
        {
          ...website.settings,
          pagesContent,
          pagesSettings
        }
      );
      
      if (success) {
        console.log("✅ Save completed successfully");
        toast.success("Changes saved");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("💥 Save completion error:", error);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading builder..." />
      </div>
    );
  }

  // Error state
  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <button onClick={handleReturnToDashboard} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const pages = website?.settings?.pages || [];
  const currentPage = pages.find(page => page.id === currentPageId);

  // Preview mode for URLs with preview=true
  if (isPreviewMode && new URLSearchParams(window.location.search).get('preview') === 'true') {
    return (
      <ErrorBoundary>
        <CartProvider>
          <BuilderProvider 
            initialElements={currentPageElements} 
            initialPageSettings={currentPageSettings || { title: currentPage?.title || websiteName }}
            onSave={handleSaveComplete}
          >
            <div className="w-full min-h-screen">
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <BuilderContent isPreviewMode={true} />
              </Suspense>
            </div>
          </BuilderProvider>
        </CartProvider>
      </ErrorBoundary>
    );
  }

  // Main builder interface
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
              isSaving={isSaving || isSavingManually}
              isPublishing={isPublishing}
              isPreviewMode={isPreviewMode}
              setIsPreviewMode={setIsPreviewMode}
              currentPage={currentPage}
              pages={pages}
              onChangePage={handleChangePage}
              onShopLinkClick={handleShopLinkClick}
              onReturnToDashboard={handleReturnToDashboard}
              viewSiteUrl={`/view/${id}`}
              saveStatus={saveStatus}
            />
            <Suspense fallback={<LoadingSpinner size="lg" text="Loading content..." />}>
              <BuilderContent isPreviewMode={isPreviewMode} />
            </Suspense>
          </BuilderLayout>
        </BuilderProvider>
      </CartProvider>
    </ErrorBoundary>
  );
};

export default Builder;
