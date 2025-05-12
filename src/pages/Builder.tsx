import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "@/lib/uuid";

// Declare global site settings interface for window
declare global {
  interface Window {
    __SITE_SETTINGS__?: {
      logoUrl?: string;
      [key: string]: any;
    };
  }
}

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
    updateElements,
    refreshWebsite
  } = useWebsite(id, navigate);
  
  // Track preview mode state at this level
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Set current page to home page by default or from URL param
  useEffect(() => {
    if (website?.settings?.pages) {
      const pageId = new URLSearchParams(window.location.search).get('pageId');
      
      // If pageId is specified in URL, use it
      if (pageId) {
        const page = website.settings.pages.find(page => page.id === pageId);
        if (page) {
          setCurrentPageId(pageId);
        } else {
          // If specified pageId doesn't exist, default to home
          const homePage = website.settings.pages.find(page => page.isHomePage);
          setCurrentPageId(homePage?.id || website.settings.pages[0]?.id || null);
        }
      } else {
        // Default to home page
        const homePage = website.settings.pages.find(page => page.isHomePage);
        if (homePage) {
          setCurrentPageId(homePage.id);
        } else if (website.settings.pages.length > 0) {
          setCurrentPageId(website.settings.pages[0].id);
        }
      }

      // Ensure we have at least a home page, shop page, and about page
      ensureRequiredPages();
    }
  }, [website]);

  // Set global site settings for components to access
  useEffect(() => {
    if (website?.settings) {
      // Make site settings available globally for components
      window.__SITE_SETTINGS__ = {
        logoUrl: website.settings.logoUrl,
        // Add other global settings here as needed
      };
    }
  }, [website?.settings]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId) return;
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    // Set current page elements and settings
    setCurrentPageElements(pageContent.length ? pageContent : elements || []);
    setCurrentPageSettings(pageSettings);
    
    console.log("Loaded page content for:", currentPageId, pageContent);
  }, [currentPageId, website, elements, websiteName]);

  // Ensure Home, Shop and About pages exist
  const ensureRequiredPages = async () => {
    if (!website?.settings?.pages) return;
    
    let updatedPages = [...(website.settings.pages || [])];
    let hasChanged = false;
    
    // Check for Home page
    const homePage = updatedPages.find(page => page.isHomePage || page.title.toLowerCase() === 'home');
    if (!homePage) {
      const newHomePage = {
        id: uuidv4(),
        title: 'Home',
        slug: '/',
        isHomePage: true
      };
      updatedPages.push(newHomePage);
      hasChanged = true;
    } else if (!homePage.isHomePage) {
      // Ensure the home page has isHomePage set to true
      updatedPages = updatedPages.map(p => 
        p.id === homePage.id ? {...p, isHomePage: true} : p
      );
      hasChanged = true;
    }
    
    // Check for Shop page
    const shopPage = updatedPages.find(page => page.title.toLowerCase() === 'shop');
    if (!shopPage) {
      const newShopPage = {
        id: uuidv4(),
        title: 'Shop',
        slug: '/shop',
        isHomePage: false
      };
      updatedPages.push(newShopPage);
      hasChanged = true;
    }
    
    // Add About page if it doesn't exist
    const aboutPage = updatedPages.find(page => page.title.toLowerCase() === 'about');
    if (!aboutPage) {
      const newAboutPage = {
        id: uuidv4(),
        title: 'About',
        slug: '/about',
        isHomePage: false
      };
      updatedPages.push(newAboutPage);
      hasChanged = true;
    }
    
    // If changes were made, update the website settings
    if (hasChanged && website) {
      const updatedSettings = {
        ...website.settings,
        pages: updatedPages
      };
      
      await saveWebsite(website.content, website.pageSettings, updatedSettings);
    }
  };

  const handleSave = async () => {
    if (!currentPageId || !website) return;
    
    // Get the current elements from the builder context
    document.dispatchEvent(new CustomEvent('save-website'));
  };

  const handleSaveComplete = async (updatedElements: BuilderElement[], updatedPageSettings: PageSettings) => {
    if (!currentPageId || !website) return;

    console.log("Saving page content:", updatedElements);
    
    // Create deep copies of objects to avoid mutation issues
    const pagesContent = JSON.parse(JSON.stringify(website.settings.pagesContent || {}));
    const pagesSettings = JSON.parse(JSON.stringify(website.settings.pagesSettings || {}));
    
    // Update content and settings for current page
    pagesContent[currentPageId] = updatedElements;
    pagesSettings[currentPageId] = updatedPageSettings;
    
    console.log("Saving content for page:", currentPageId, updatedElements);
    
    // Save to database
    await saveWebsite(
      currentPageId === website.settings.pages?.find(p => p.isHomePage)?.id ? updatedElements : website.content, 
      updatedPageSettings, 
      {
        pagesContent,
        pagesSettings
      }
    );
    
    // Refresh website data after save to ensure consistency
    refreshWebsite();
  };
  
  const handleChangePage = (pageId: string) => {
    // Save current page first
    handleSave();
    
    // Update URL with pageId parameter
    navigate(`/builder/${id}?pageId=${pageId}`);
    setCurrentPageId(pageId);
  };

  const handleShopLinkClick = useCallback(() => {
    // Save current page first
    handleSave();
    
    // Navigate to the shop page
    navigate(`/builder/${id}/shop`);
  }, [handleSave, id, navigate]);
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

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

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const pages = website?.settings?.pages || [];
  const currentPage = pages.find(page => page.id === currentPageId);

  return (
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
        />
        <BuilderContent isPreviewMode={isPreviewMode} />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
