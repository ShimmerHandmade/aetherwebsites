
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import PageEditorSidebar from "./PageEditorSidebar";
import BuilderCanvas from "./canvas/BuilderCanvas";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        {!isPreviewMode && (
          <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 border-r border-gray-200 bg-white flex-shrink-0 overflow-hidden`}>
            <PageEditorSidebar isPreviewMode={isPreviewMode} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Container */}
          <div className="flex-1 overflow-auto">
            {children || <BuilderCanvas isPreviewMode={isPreviewMode} />}
          </div>
        </div>

        {/* Sidebar Toggle (when collapsed) */}
        {!isPreviewMode && sidebarCollapsed && (
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-lg"
            onClick={() => setSidebarCollapsed(false)}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default BuilderLayout;
