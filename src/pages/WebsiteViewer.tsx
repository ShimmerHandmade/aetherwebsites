import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import BuilderContent from "@/components/builder/BuilderContent";
import { useWebsite } from "@/hooks/useWebsite";
import { BuilderElement, PageSettings } from "@/contexts/BuilderContext";
import Cart from "@/pages/Cart";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import { CartProvider } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

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

  // Determine if this is a live site view
  const isViewRoute = location.pathname.startsWith(`/view/${id}`);
  const isSiteRoute = location.pathname.startsWith(`/site/${id}`);
  // Also detect custom domain by checking window location
  const isCustomDomain = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('lovable.app');
  const isLiveSite = isSiteRoute || isViewRoute || isCustomDomain;

  // Get the current path to determine which page to show
  let currentPath = location.pathname.replace(`/site/${id}`, '').replace(`/view/${id}`, '') || '/';
  
  // If we're on a custom domain, the path is just the pathname
  if (isCustomDomain) {
    currentPath = location.pathname || '/';
  }
  
  // Check if we're on a special page
  const isCartPage = currentPath === '/cart';
  const isCheckoutPage = currentPath === '/checkout';
  
  // Check if we're on a product details page - use better pattern matching for routes
  const productMatch = currentPath.match(/^\/product\/(.+)$/);
  const isProductPage = !!productMatch;
  const productId = productMatch ? productMatch[1] : null;

  console.log("WebsiteViewer - ROUTE INFO:", { 
    currentPath,
    isLiveSite,
    isViewRoute,
    isSiteRoute,
    isCustomDomain,
    isCartPage,
    isCheckoutPage,
    isProductPage,
    productId,
    hostname: window.location.hostname,
    isMobile
  });

  // Set current page based on the URL path
  useEffect(() => {
    if (isCartPage || isCheckoutPage || isProductPage) {
      // Don't need to set current page ID for special pages
      return;
    }

    if (website?.settings?.pages) {
      // If it's the root path, find the home page
      if (currentPath === '/') {
        const homePage = website.settings.pages.find(page => page.isHomePage);
        if (homePage) {
          setCurrentPageId(homePage.id);
        } else if (website.settings.pages.length > 0) {
          setCurrentPageId(website.settings.pages[0].id);
        }
      } else {
        // Find the page that matches the current path
        const matchingPage = website.settings.pages.find(page => page.slug === currentPath);
        if (matchingPage) {
          setCurrentPageId(matchingPage.id);
        } else {
          // If no matching page, default to home
          const homePage = website.settings.pages.find(page => page.isHomePage);
          if (homePage) {
            setCurrentPageId(homePage.id);
          } else if (website.settings.pages.length > 0) {
            setCurrentPageId(website.settings.pages[0].id);
          }
        }
      }
    }
  }, [website, currentPath, isCartPage, isCheckoutPage, isProductPage]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId || isCartPage || isCheckoutPage || isProductPage) return;
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    // If the page has no specific content and this is the homepage, use the main content
    if (pageContent.length === 0) {
      const homePage = website.settings.pages.find(p => p.isHomePage);
      if (homePage && homePage.id === currentPageId && Array.isArray(website.content)) {
        setCurrentPageElements(website.content);
      } else {
        setCurrentPageElements(pageContent.length ? pageContent : elements || []);
      }
    } else {
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

  // Add viewport meta tag for mobile if missing
  useEffect(() => {
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(viewport);
    }
  }, []);

  if (isLoading) {
    return (
      <CartProvider>
        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading website...</p>
          </div>
        </div>
      </CartProvider>
    );
  }

  if (!website) {
    return (
      <CartProvider>
        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          </div>
        </div>
      </CartProvider>
    );
  }

  // Everything is wrapped in CartProvider to prevent useCart context errors
  return (
    <CartProvider>
      {isCartPage ? (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <Cart siteName={websiteName} siteId={id} />
          </div>
        </div>
      ) : isProductPage ? (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <ProductDetails productId={productId} siteId={id} />
          </div>
        </div>
      ) : isCheckoutPage ? (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
            <Checkout />
          </div>
        </div>
      ) : (
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
      )}
    </CartProvider>
  );
};

export default WebsiteViewer;
