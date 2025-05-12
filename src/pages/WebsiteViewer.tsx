
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";

const WebsiteViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName,
    elements
  } = useWebsite(id, navigate);
  
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Set current page to home page by default
  useEffect(() => {
    if (website?.settings?.pages) {
      // Default to home page
      const homePage = website.settings.pages.find(page => page.isHomePage);
      if (homePage) {
        setCurrentPageId(homePage.id);
      } else if (website.settings.pages.length > 0) {
        setCurrentPageId(website.settings.pages[0].id);
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading website...</p>
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
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider 
      initialElements={currentPageElements} 
      initialPageSettings={currentPageSettings || { title: websiteName }}
      onSave={() => {}}
    >
      <div className="w-full min-h-screen">
        <BuilderContent isPreviewMode={true} />
      </div>
    </BuilderProvider>
  );
};

export default WebsiteViewer;
