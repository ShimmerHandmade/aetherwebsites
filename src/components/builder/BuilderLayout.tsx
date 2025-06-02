
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./canvas/BuilderCanvas";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-gray-100">
          {!isPreviewMode && <BuilderSidebar isPreviewMode={isPreviewMode} />}
          
          <SidebarInset className="flex-1">
            {!isPreviewMode && (
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-gray-800">Website Builder</h1>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="flex items-center gap-2"
                >
                  {isPreviewMode ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Exit Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Preview
                    </>
                  )}
                </Button>
              </header>
            )}
            
            <div className="flex-1 overflow-auto bg-white">
              {children || <BuilderCanvas isPreviewMode={isPreviewMode} />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default BuilderLayout;
