
import React, { useState, useEffect } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Edit } from "lucide-react";
import { useBuilder } from "@/contexts/builder/BuilderProvider";

// Extend the interface to include isLiveSite
interface BuilderContentProps extends PreviewModeProps {
  isLiveSite?: boolean;
}

const BuilderContent: React.FC<BuilderContentProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { elements } = useBuilder();
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'elements' | 'rendering'>('initial');
  const [retryCount, setRetryCount] = useState(0);
  
  // Enhanced loading effect with retry mechanism
  useEffect(() => {
    // First, mark that we're loading
    setIsLoading(true);
    setContentReady(false);
    setLoadingStage('initial');
    
    const minLoadingTime = 1000; // minimum ms to show loading state
    const startTime = Date.now();
    
    const checkElementsAndFinishLoading = () => {
      // Update loading stage to show progress
      setLoadingStage('elements');
      
      // Check if elements are available
      const hasElements = elements && elements.length > 0;
      
      // Calculate how much time has passed
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime >= minLoadingTime) {
        // We've shown the loading state for at least the minimum time
        setLoadingStage('rendering');
        
        // If we have elements or have already retried enough times, finish loading
        if (hasElements || retryCount > 2) {
          setTimeout(() => {
            setIsLoading(false);
            // Add a small delay before showing content for smoother transition
            setTimeout(() => {
              setContentReady(true);
            }, 150);
          }, 200);
        } else if (retryCount <= 2) {
          // Retry loading elements a few times before giving up
          setRetryCount(prev => prev + 1);
          setTimeout(checkElementsAndFinishLoading, 800);
        }
      } else {
        // Need to wait longer to meet minimum loading time
        setTimeout(
          checkElementsAndFinishLoading, 
          minLoadingTime - elapsedTime
        );
      }
    };
    
    // Start the loading process
    setTimeout(checkElementsAndFinishLoading, 200);
    
    // Clean up any pending timeouts if component unmounts
    return () => {
      setIsLoading(false);
    };
  }, [elements]);
  
  // Always check if we're on the /site/:id route to ensure we're in full preview mode
  const isSiteRoute = window.location.pathname.includes('/site/');
  const isFullPreview = isPreviewMode && (isSiteRoute || new URLSearchParams(window.location.search).get('preview') === 'true');

  // For full preview mode, render just the canvas without any UI controls
  if (isFullPreview || isSiteRoute) {
    return (
      <div className="flex-1 min-h-screen">
        <BuilderCanvas isPreviewMode={true} isLiveSite={isLiveSite} />
      </div>
    );
  }

  // Regular preview mode or edit mode
  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-slate-100 overflow-auto">
        <BuilderCanvas isPreviewMode={true} isLiveSite={isLiveSite} />
      </div>
    );
  }

  // Enhanced loading indicator with stages
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100 transition-opacity duration-300">
        <div className="text-center max-w-md">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium mb-2">
            {loadingStage === 'initial' ? 'Preparing builder content...' : 
             loadingStage === 'elements' ? 'Loading page elements...' : 
             'Rendering your page...'}
          </p>
          <p className="text-gray-500 text-sm">
            {retryCount > 0 ? `Still working on it... (attempt ${retryCount + 1})` : 'This will just take a moment'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex ${contentReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {/* Left sidebar - visible on desktop */}
      <div className="hidden md:block w-[220px] bg-white border-r border-slate-200">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
        <PageEditorSidebar isPreviewMode={isPreviewMode} />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-slate-100 overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} isLiveSite={isLiveSite} />
        
        {/* Mobile view: Bottom Drawer trigger */}
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="default"
              size="sm" 
              className="fixed bottom-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white shadow-md md:hidden rounded-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <div className="px-4 pt-4 pb-8">
              <PageEditorSidebar isPreviewMode={isPreviewMode} />
            </div>
          </DrawerContent>
        </Drawer>
        
        {/* Element editing actions - inspired by Squarespace */}
        <div className="hidden group-hover:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col gap-2">
          <Button variant="secondary" size="icon" className="bg-white shadow-md rounded-full">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderContent;
