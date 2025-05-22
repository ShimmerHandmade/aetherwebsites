
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
  const currentPath = location.pathname.replace(`/site/${id}`, '').replace(`/view/${id}`, '') || '/';
  
  // Check if we're on a special page
  const isCartPage = currentPath === '/cart';
  const isCheckoutPage = currentPath === '/checkout';
  
  // Check if we're on a product details page - used a better pattern matching for routes
  const productMatch = currentPath.match(/^\/product\/(.+)$/);
  const isProductPage = !!productMatch;
  const productId = productMatch ? productMatch[1] : null;

  console.log({
    currentPath,
    isProductPage,
    productId,
    fullPath: location.pathname
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
  }, [website, currentPath, isCartPage, isCheckoutPage, isProductPage]);

  // Load page content when currentPageId changes
  useEffect(() => {
    if (!website || !currentPageId || isCartPage || isCheckoutPage || isProductPage) return;
    
    // Get content for current page
    const pagesContent = website.settings.pagesContent || {};
    const pageContent = pagesContent[currentPageId] || [];
    const pageSettings = website.settings.pagesSettings?.[currentPageId] || { title: websiteName };
    
    console.log("Loading content for page ID:", currentPageId);
    
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
  }, [currentPageId, website, elements, websiteName, isCartPage, isCheckoutPage, isProductPage]);

  // Set global site settings for components to access
  useEffect(() => {
    if (website?.settings) {
      // Make site settings available globally for components
      window.__SITE_SETTINGS__ = {
        logoUrl: website.settings.logoUrl,
        siteId: id, // Add site ID to settings for cart routes
        isLiveSite: true, // Indicate this is a live site
        // Add other global settings here as needed
      };
    }
  }, [website?.settings, id]);

  if (isLoading) {
    return (
      <CartProvider>
        <div className="h-screen flex items-center justify-center">
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
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
            <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
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
          <div className="mx-auto max-w-[1920px]">
            <Cart siteName={websiteName} siteId={id} />
          </div>
        </div>
      ) : isProductPage ? (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px]">
            <ProductDetails productId={productId} siteId={id} />
          </div>
        </div>
      ) : isCheckoutPage ? (
        <div className="w-full min-h-screen">
          <div className="mx-auto max-w-[1920px]">
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
            <div className="mx-auto max-w-[1920px]">
              <BuilderContent isPreviewMode={true} isLiveSite={true} />
            </div>
          </div>
        </BuilderProvider>
      )}
    </CartProvider>
  );
};

export default WebsiteViewer;
