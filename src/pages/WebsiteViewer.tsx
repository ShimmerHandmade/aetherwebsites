
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";

const WebsiteViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    website, 
    isLoading, 
    websiteName,
    elements
  } = useWebsite(id, navigate);
  
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Get the current path to determine which page to show
  const currentPath = location.pathname.replace(`/site/${id}`, '') || '/';

  // Set current page based on the URL path
  useEffect(() => {
    if (website?.settings?.pages) {
      // If it's the root path, find the home page
      if (currentPath === '/') {
        const homePage = website.settings.pages.find(page => page.isHomePage);
        if (homePage) {
          setCurrentPageId(homePage.id);
          console.log("Home page found:", homePage);
        } else if (website.settings.pages.length > 0) {
          setCurrentPageId(website.settings.pages[0].id);
          console.log("No home page found, using first page:", website.settings.pages[0]);
        }
      } else {
        // Find the page that matches the current path
        const matchingPage = website.settings.pages.find(page => page.slug === currentPath);
        if (matchingPage) {
          setCurrentPageId(matchingPage.id);
          console.log("Matched page by slug:", matchingPage);
        } else {
          // If no matching page, default to home
          const homePage = website.settings.pages.find(page => page.isHomePage);
          if (homePage) {
            setCurrentPageId(homePage.id);
            console.log("No matching page found, using home page instead");
          } else if (website.settings.pages.length > 0) {
            setCurrentPageId(website.settings.pages[0].id);
          }
        }
      }
    }
  }, [website, currentPath]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId) return;
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    console.log("Loading content for page ID:", currentPageId);
    console.log("Available page content:", Object.keys(pagesContent));
    console.log("Number of elements in page content:", pageContent.length);
    
    // If the page has no specific content and this is the homepage, use the main content
    if (pageContent.length === 0) {
      const homePage = website.settings.pages.find(p => p.isHomePage);
      if (homePage && homePage.id === currentPageId && Array.isArray(website.content)) {
        console.log("Using website main content for home page");
        setCurrentPageElements(website.content);
      } else {
        console.log("Using empty or fallback content");
        setCurrentPageElements(pageContent.length ? pageContent : elements || []);
      }
    } else {
      console.log("Using page-specific content");
      setCurrentPageElements(pageContent);
    }
    
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
