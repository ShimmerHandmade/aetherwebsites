
import React, { useState, useCallback, useEffect } from "react";
import { BuilderProvider } from "@/contexts/builder/BuilderProvider";
import { SidebarProvider } from "@/contexts/sidebar/SidebarProvider";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderNavbar from "@/components/builder/BuilderNavbar";
import BuilderContent from "@/components/builder/BuilderContent";
import TemplateSelection from "@/components/TemplateSelection";
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
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  
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
  
  const [currentPage, setCurrentPage] = useState<{ id: string; title: string; slug: string; isHomePage?: boolean; } | null>(null);
  const pages = website?.settings?.pages || [];

  // Check if website has content, if not show template selection
  useEffect(() => {
    if (website && !isLoading) {
      const hasContent = elements && elements.length > 0;
      const hasPages = website.settings?.pages && website.settings.pages.length > 0;
      
      if (!hasContent && !hasPages) {
        console.log("No content found, showing template selection");
        setShowTemplateSelection(true);
      } else {
        setShowTemplateSelection(false);
      }
    }
  }, [website, isLoading, elements]);

  useEffect(() => {
    if (website && website.settings?.pages && website.settings.pages.length > 0) {
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
    
    const selectedPage = pages.find(page => page.id === pageId);
    if (!selectedPage) {
      console.error("Page not found:", pageId);
      return;
    }
    
    setCurrentPage(selectedPage);
    
    const pageContent = website?.settings?.pagesContent?.[pageId] || [];
    updateElements(pageContent);
  };

  const handleTemplateSelect = useCallback((templateData: any) => {
    console.log("Template selected:", templateData);
    
    if (templateData.elements && Array.isArray(templateData.elements)) {
      console.log("Applying template elements:", templateData.elements);
      
      const elementsWithIds = templateData.elements.map((element: any) => ({
        ...element,
        id: element.id || uuidv4()
      }));
      
      updateElements(elementsWithIds);
      setShowTemplateSelection(false);
      console.log("Template applied successfully");
      toast.success(`${templateData.templateName || 'Template'} applied successfully!`);
    } else {
      console.error("Invalid template data:", templateData);
      toast.error("Failed to apply template - invalid data");
    }
  }, [updateElements]);

  const handleSkipTemplate = () => {
    setShowTemplateSelection(false);
    // Initialize with a basic element structure
    const basicElements = [
      {
        id: uuidv4(),
        type: "section",
        content: "",
        props: {
          padding: "large",
          backgroundColor: "bg-white"
        },
        children: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Welcome to Your Website",
            props: {
              level: "h1",
              className: "text-4xl font-bold text-center mb-8"
            }
          }
        ]
      }
    ];
    updateElements(basicElements);
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

  // Show template selection screen
  if (showTemplateSelection) {
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

  return (
    <BuilderProvider 
      initialElements={elements || []}
      initialPageSettings={pageSettings || { title: websiteName || 'My Website' }}
      onSave={handleBuilderSave}
    >
      <SidebarProvider>
        <div className="h-screen flex bg-gray-50">
          <BuilderSidebar isPreviewMode={isPreviewMode} />
          <div className="flex-1 flex flex-col">
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
