
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./canvas/BuilderCanvas";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

interface BuilderLayoutProps {
  children?: React.ReactNode;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ 
  children, 
  isPreviewMode, 
  setIsPreviewMode 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          {!isPreviewMode && <BuilderSidebar isPreviewMode={isPreviewMode} />}
          
          <SidebarInset className="flex-1">
            {!isPreviewMode && (
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-sidebar-border" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">Website Builder</h1>
                </div>
              </header>
            )}
            
            <div className="flex-1 overflow-auto">
              {children || <BuilderCanvas isPreviewMode={isPreviewMode} />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default BuilderLayout;
