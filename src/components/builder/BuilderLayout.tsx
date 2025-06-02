
import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import PageEditorSidebar from "./PageEditorSidebar";
import BuilderCanvas from "./canvas/BuilderCanvas";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface BuilderLayoutProps {
  children?: React.ReactNode;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
}

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full mx-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          The builder encountered an error. This has been logged and our team will investigate.
        </p>
        <details className="text-left mb-6">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Error details
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        <Button onClick={resetErrorBoundary} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  </div>
);

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

  const handleError = (error: Error, errorInfo: any) => {
    console.error("Builder error:", error, errorInfo);
    toast.error("An error occurred in the builder. Please try refreshing the page.");
  };

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
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
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
