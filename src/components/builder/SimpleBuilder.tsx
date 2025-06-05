
import React, { useState, useCallback, useEffect } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/contexts/sidebar/SidebarProvider";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement, PageSettings } from "@/contexts/builder/types";

const SimpleBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  
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
  } = useWebsite(id, navigate, { autoSave: false }); // Disable auto-save to prevent loops
  
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  const pages = website?.settings?.pages || [];

  // Initialize the builder once website data is loaded
  useEffect(() => {
    if (website && !isInitialized) {
      console.log("Initializing SimpleBuilder with website data:", website);
      setIsInitialized(true);
    }
  }, [website, isInitialized]);

  useEffect(() => {
    if (website && website.settings?.pages && website.settings.pages.length > 0) {
      // Find the home page or default to the first page
      const homePage = website.settings.pages.find(page => page.isHomePage) || website.settings.pages[0];
      if (!currentPage || currentPage.id !== homePage.id) {
        setCurrentPage(homePage);
      }
    }
  }, [website, currentPage]);

  useEffect(() => {
    if (lastSaved) {
      setSaveStatus(`Last saved ${lastSaved.toLocaleTimeString()}`);
    } else {
      setSaveStatus('');
    }
  }, [lastSaved]);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading website data...", { id: "load-data" });
    } else {
      toast.dismiss("load-data");
    }
  }, [isLoading]);

  useEffect(() => {
    if (unsavedChanges) {
      setSaveStatus("Unsaved changes");
    }
  }, [unsavedChanges]);

  const handleSave = async () => {
    const success = await saveWebsite();
    if (success) {
      setSaveStatus(`Last saved ${new Date().toLocaleTimeString()}`);
    }
  };

  const handlePublish = async () => {
    await publishWebsite();
  };

  const handleBuilderSave = async (elements: BuilderElement[], pageSettings: PageSettings) => {
    await saveWebsite(elements, pageSettings);
  };

  const handlePageChange = (pageId: string) => {
    console.log("Page changed to:", pageId);
    
    // Find the selected page
    const selectedPage = pages.find(page => page.id === pageId);
    if (!selectedPage) {
      console.error("Page not found:", pageId);
      return;
    }
    
    setCurrentPage(selectedPage);
    
    // Load content for the selected page
    const pageContent = website?.settings?.pagesContent?.[pageId] || [];
    updateElements(pageContent);
  };

  const handleTemplateSelect = useCallback((templateData: any) => {
    console.log("Template selected:", templateData);
    
    if (templateData.elements && Array.isArray(templateData.elements)) {
      console.log("Applying template elements:", templateData.elements);
      
      // Clear existing elements and apply template
      updateElements([]);
      
      // Add elements with proper IDs
      const elementsWithIds = templateData.elements.map((element: any) => ({
        ...element,
        id: element.id || uuidv4()
      }));
      
      setTimeout(() => {
        updateElements(elementsWithIds);
        console.log("Template applied successfully");
        toast.success(`${templateData.templateName || 'Template'} applied successfully!`);
      }, 100);
    } else {
      console.error("Invalid template data:", templateData);
      toast.error("Failed to apply template - invalid data");
    }
  }, [updateElements]);

  // Show loading state until builder is initialized
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

  return (
    <div className="h-screen flex">
      <BuilderProvider 
        initialElements={elements}
        initialPageSettings={pageSettings}
        onSave={handleBuilderSave}
      >
        <SidebarProvider>
          <div className="h-screen flex">
            <BuilderSidebar isPreviewMode={isPreviewMode} />
            <main className="flex-1 flex flex-col">
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
                viewSiteUrl={`https://${id}.aetherwebsites.com`}
                saveStatus={saveStatus}
              />
              <div className="flex-1 flex overflow-hidden">
                <BuilderContent 
                  isPreviewMode={isPreviewMode}
                />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BuilderProvider>
    </div>
  );
};

export default SimpleBuilder;
