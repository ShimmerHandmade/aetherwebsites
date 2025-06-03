
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import { CartProvider } from "@/contexts/CartContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import PlanDebugInfo from "@/components/PlanDebugInfo";

const WebsiteViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const { 
    website, 
    isLoading, 
    websiteName,
    elements
  } = useWebsite(id, navigate);
  
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageElements, setCurrentPageElements] = useState<BuilderElement[]>([]);
  const [currentPageSettings, setCurrentPageSettings] = useState<PageSettings | null>(null);

  // Route detection - Enhanced to handle both /site and /view routes
  const isViewRoute = location.pathname.startsWith(`/view/${id}`);
  const isSiteRoute = location.pathname.startsWith(`/site/${id}`);
  const isCustomDomain = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('lovable.app');
  const isLiveSite = isSiteRoute || isViewRoute || isCustomDomain;

  // Extract the current path after the site/view prefix
  let currentPath = location.pathname;
  if (isSiteRoute) {
    currentPath = currentPath.replace(`/site/${id}`, '') || '/';
  } else if (isViewRoute) {
    currentPath = currentPath.replace(`/view/${id}`, '') || '/';
  } else if (isCustomDomain) {
    currentPath = location.pathname || '/';
  }
  
  const isCartPage = currentPath === '/cart';
  const isCheckoutPage = currentPath === '/checkout';
  const productMatch = currentPath.match(/^\/product\/(.+)$/);
  const isProductPage = !!productMatch;
  const productId = productMatch ? productMatch[1] : null;

  console.log("WebsiteViewer route detection:", {
    isViewRoute,
    isSiteRoute,
    isCustomDomain,
    isLiveSite,
    currentPath,
    isCartPage,
    isCheckoutPage,
    isProductPage,
    productId,
    fullPath: location.pathname
  });

  // Debug logging for website data
  useEffect(() => {
    if (website) {
      console.log("Website data loaded:", {
        id: website.id,
        name: website.name,
        template: (website as any).template,
        content: website.content,
        settings: website.settings,
        contentLength: website.content?.length || 0,
        hasPages: website.settings?.pages?.length || 0,
        hasPagesContent: Object.keys(website.settings?.pagesContent || {}).length
      });
    }
  }, [website]);

  // SEO meta tags update
  useEffect(() => {
    if (website && currentPageSettings) {
      document.title = currentPageSettings.title || websiteName || 'Website';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && currentPageSettings.meta?.description) {
        metaDescription.setAttribute('content', currentPageSettings.meta.description);
      } else if (!metaDescription && currentPageSettings.meta?.description) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = currentPageSettings.meta.description;
        document.head.appendChild(meta);
      }
    }
  }, [website, currentPageSettings, websiteName]);

  // Set current page based on the URL path
  useEffect(() => {
    if (isCartPage || isCheckoutPage || isProductPage) {
      // Don't need to set current page ID for special pages
      return;
    }

    if (website?.settings?.pages) {
      console.log("Available pages:", website.settings.pages);
      console.log("Current path:", currentPath);
      
      // If it's the root path, find the home page
      if (currentPath === '/') {
        const homePage = website.settings.pages.find(page => page.isHomePage);
        if (homePage) {
          console.log("Found home page:", homePage);
          setCurrentPageId(homePage.id);
        } else if (website.settings.pages.length > 0) {
          console.log("No home page found, using first page:", website.settings.pages[0]);
          setCurrentPageId(website.settings.pages[0].id);
        }
      } else {
        // Find the page that matches the current path
        const matchingPage = website.settings.pages.find(page => page.slug === currentPath);
        if (matchingPage) {
          console.log("Found matching page:", matchingPage);
          setCurrentPageId(matchingPage.id);
        } else {
          // If no matching page, default to home
          const homePage = website.settings.pages.find(page => page.isHomePage);
          if (homePage) {
            console.log("No matching page, using home page:", homePage);
            setCurrentPageId(homePage.id);
          } else if (website.settings.pages.length > 0) {
            console.log("No matching page or home page, using first page:", website.settings.pages[0]);
            setCurrentPageId(website.settings.pages[0].id);
          }
        }
      }
    }
  }, [website, currentPath, isCartPage, isCheckoutPage, isProductPage]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId || isCartPage || isCheckoutPage || isProductPage) return;
    
    console.log(`Loading content for page ID: ${currentPageId}`);
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    console.log("Page content from pagesContent:", pageContent);
    console.log("Page settings:", pageSettings);
    
    // If the page has no specific content and this is the homepage, use the main content
    if (pageContent.length === 0) {
      const homePage = website.settings.pages.find(p => p.isHomePage);
      if (homePage && homePage.id === currentPageId && Array.isArray(website.content)) {
        console.log("Using main website content for home page:", website.content);
        setCurrentPageElements(website.content);
      } else {
        console.log("Using fallback content:", elements || []);
        setCurrentPageElements(pageContent.length ? pageContent : elements || []);
      }
    } else {
      console.log("Using specific page content:", pageContent);
      setCurrentPageElements(pageContent);
    }
    
    setCurrentPageSettings(pageSettings);
  }, [currentPageId, website, elements, websiteName, isCartPage, isCheckoutPage, isProductPage]);

  // Set global site settings for components to access
  useEffect(() => {
    if (website?.settings) {
      console.log("Setting global site settings with isLiveSite =", isLiveSite);
      // Make site settings available globally for components
      window.__SITE_SETTINGS__ = {
        logoUrl: website.settings.logoUrl,
        siteId: id, // Add site ID to settings for cart routes
        isLiveSite: isLiveSite, // Indicate this is a live site
        customDomain: website.settings.customDomain,
        customDomainEnabled: website.settings.customDomainEnabled,
        isMobile: isMobile // Add mobile detection to global settings
      };
    }
  }, [website?.settings, id, isLiveSite, isMobile]);

  // Viewport optimization for mobile
  useEffect(() => {
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(viewport);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <PlanProvider>
        <CartProvider>
          <div className="h-screen flex items-center justify-center px-4">
            <LoadingSpinner size="lg" text="Loading website..." />
          </div>
          <PlanDebugInfo />
        </CartProvider>
      </PlanProvider>
    );
  }

  // Error state
  if (!website) {
    return (
      <PlanProvider>
        <CartProvider>
          <div className="h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">The website you're looking for doesn't exist or you don't have permission to access it.</p>
            </div>
          </div>
          <PlanDebugInfo />
        </CartProvider>
      </PlanProvider>
    );
  }

  const renderContent = () => {
    if (isCartPage) {
      console.log("Rendering Cart page with siteId:", id);
      return (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <Cart siteName={websiteName} siteId={id} />
          </div>
        </div>
      );
    }
    
    if (isProductPage) {
      console.log("Rendering ProductDetails page with productId:", productId, "siteId:", id);
      return (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <ProductDetails productId={productId} siteId={id} />
          </div>
        </div>
      );
    }
    
    if (isCheckoutPage) {
      console.log("Rendering Checkout page");
      return (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <Checkout />
          </div>
        </div>
      );
    }

    console.log("Rendering BuilderContent with elements:", currentPageElements);

    return (
      <BuilderProvider 
        initialElements={currentPageElements} 
        initialPageSettings={currentPageSettings || { title: websiteName }}
        onSave={() => {}}
      >
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <BuilderContent isPreviewMode={true} isLiveSite={isLiveSite} />
          </div>
        </div>
      </BuilderProvider>
    );
  };

  return (
    <ErrorBoundary>
      <PlanProvider>
        <CartProvider>
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading content..." />}>
            {renderContent()}
          </Suspense>
          <PlanDebugInfo />
        </CartProvider>
      </PlanProvider>
    </ErrorBoundary>
  );
};

export default WebsiteViewer;
