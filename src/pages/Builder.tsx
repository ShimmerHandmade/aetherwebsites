
import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderLayout from "@/components/builder/BuilderLayout";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import { useState, useEffect } from "react";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName, 
    elements,
    pageSettings,
    setWebsiteName, 
    saveWebsite, 
    publishWebsite,
    updateElements
  } = useWebsite(id, navigate);
  
  // Track preview mode state at this level
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Set current page to home page by default
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
    }
  }, [website]);

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
    
  }, [currentPageId, website, elements, websiteName]);

  const handleSave = async (updatedElements: BuilderElement[], updatedPageSettings: PageSettings) => {
    if (!currentPageId || !website) return;

    // Create or update pagesContent and pagesSettings in website settings
    const pagesContent = website.settings.pagesContent || {};
    const pagesSettings = website.settings.pagesSettings || {};
    
    // Update content and settings for current page
    pagesContent[currentPageId] = updatedElements;
    pagesSettings[currentPageId] = updatedPageSettings;
    
    // Save to database
    await saveWebsite(
      updatedElements, 
      updatedPageSettings, 
      {
        pagesContent,
        pagesSettings
      }
    );
  };
  
  const handleChangePage = (pageId: string) => {
    // Save current page first
    document.dispatchEvent(new CustomEvent('save-website'));
    
    // Update URL with pageId parameter
    navigate(`/builder/${id}?pageId=${pageId}`);
    setCurrentPageId(pageId);
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

  const pages = website.settings.pages || [];
  const currentPage = pages.find(page => page.id === currentPageId);

  return (
    <BuilderProvider 
      initialElements={currentPageElements} 
      initialPageSettings={currentPageSettings || { title: currentPage?.title || websiteName }}
      onSave={handleSave}
    >
      <BuilderLayout isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode}>
        <BuilderNavbar 
          websiteName={websiteName} 
          setWebsiteName={setWebsiteName} 
          onSave={async () => {
            document.dispatchEvent(new CustomEvent('save-website'));
          }} 
          onPublish={publishWebsite}
          isPublished={website.published}
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          currentPage={currentPage}
          pages={pages}
          onChangePage={handleChangePage}
        />
        <BuilderContent isPreviewMode={isPreviewMode} />
      </BuilderLayout>
    </BuilderProvider>
  );
};

export default Builder;
