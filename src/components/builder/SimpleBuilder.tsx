
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
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Update save status
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('Saving...');
    } else if (unsavedChanges) {
      setSaveStatus('Unsaved changes');
    } else if (lastSaved) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setSaveStatus(`Saved ${diffInSeconds} seconds ago`);
      } else {
        setSaveStatus(`Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      }
    } else {
      setSaveStatus('');
    }
  }, [isSaving, unsavedChanges, lastSaved]);

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

  // Load page content
  useEffect(() => {
    if (!website || !currentPageId) return;
    
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    setCurrentPageElements(pageContent.length ? pageContent : elements || []);
    setCurrentPageSettings(pageSettings);
  }, [currentPageId, website, elements, websiteName]);

  const handleSave = useCallback(async () => {
    if (!currentPageId || !website) {
      toast.error("Cannot save: No page selected");
      return;
    }
    
    try {
      document.dispatchEvent(new CustomEvent('save-website'));
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save website");
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
      
      if (success) {
        toast.success("Changes saved");
      } else {
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
              saveStatus={saveStatus}
            />
            <BuilderContent isPreviewMode={isPreviewMode} />
          </BuilderLayout>
        </BuilderProvider>
      </CartProvider>
    </ErrorBoundary>
  );
};

export default SimpleBuilder;
