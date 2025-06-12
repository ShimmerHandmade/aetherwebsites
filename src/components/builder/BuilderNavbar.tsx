
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Home,
  ExternalLink,
  Smartphone,
  Monitor,
  PanelsTopLeft,
  Package,
  ShoppingBag,
  FileText,
  CreditCard,
  Truck,
  ChevronDown
} from "lucide-react";
import { useBuilderNavigation } from "@/hooks/useBuilderNavigation";
import { useResponsiveControls } from "@/hooks/useResponsiveControls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Page {
  id: string;
  title: string;
  slug: string;
  isHomePage?: boolean;
}

interface BuilderNavbarProps {
  websiteName: string;
  setWebsiteName: (name: string) => void;
  onSave: () => void;
  onPublish: () => void;
  isPublished?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  currentPage?: Page | null;
  pages: Page[];
  onChangePage: (pageId: string) => void;
  onShopLinkClick?: () => void;
  onReturnToDashboard?: () => void;
  viewSiteUrl?: string;
  saveStatus?: string;
}

const BuilderNavbar = ({
  websiteName,
  setWebsiteName,
  onSave,
  onPublish,
  isPublished = false,
  isSaving = false,
  isPublishing = false,
  isPreviewMode,
  setIsPreviewMode,
  currentPage,
  pages,
  onChangePage,
  onReturnToDashboard,
  saveStatus = ''
}: BuilderNavbarProps) => {
  const {
    activeTab,
    handleTabChange,
    handleReturnToDashboard,
    handleOpenFullPreview
  } = useBuilderNavigation();

  const {
    previewBreakpoint,
    breakpoints,
    handleBreakpointChange
  } = useResponsiveControls();

  const iconComponents = {
    Smartphone,
    Monitor
  };

  // Filter out tablet from breakpoints
  const filteredBreakpoints = breakpoints.filter(bp => bp.type !== 'tablet');

  return (
    <div className="w-full flex flex-col bg-white border-b border-slate-200 relative z-50">
      {/* Top bar with better spacing */}
      <div className="h-16 flex items-center px-6 justify-between bg-white border-b border-slate-100">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleReturnToDashboard(isSaving, onReturnToDashboard)}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          
          <div className="flex items-center space-x-3">
            <Input
              className="w-56 h-9 text-sm font-medium flex-shrink-0"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="Website Name"
            />
            
            {saveStatus && (
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        {/* Right side controls with better spacing */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Responsive Controls - only mobile and desktop */}
          {activeTab === "edit" && (
            <div className="hidden lg:flex items-center space-x-1 bg-gray-50 border rounded-lg p-1">
              <span className="text-xs text-gray-600 px-2">View:</span>
              {filteredBreakpoints.map(({ type, icon, label }) => {
                const IconComponent = iconComponents[icon as keyof typeof iconComponents];
                return (
                  <Button
                    key={type}
                    variant={previewBreakpoint === type ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleBreakpointChange(type)}
                    className="flex items-center space-x-1 h-8 px-3"
                    title={`Switch to ${label} view`}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden xl:inline text-xs">{label}</span>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Page Switcher */}
          {activeTab === "edit" && pages.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {currentPage?.isHomePage && <Home className="h-4 w-4" />}
                  <span className="hidden sm:inline">
                    {currentPage?.title || 'Select Page'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {pages.map((page) => (
                  <DropdownMenuItem
                    key={page.id}
                    onClick={() => onChangePage(page.id)}
                    className="flex items-center gap-2"
                  >
                    {page.isHomePage && <Home className="h-4 w-4" />}
                    <span>{page.title}</span>
                    {page.isHomePage && (
                      <span className="ml-auto text-xs text-green-600">Home</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenFullPreview}
            title="Open in new tab"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          <Button 
            size="sm" 
            onClick={onPublish} 
            disabled={isPublishing}
            variant={isPublished ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {isPublishing ? "Publishing..." : isPublished ? "Published" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Tabs row */}
      <div className="px-6 border-t border-slate-200 bg-white">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent h-12 p-0 border-b border-transparent gap-6">
            <TabsTrigger 
              value="edit" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <PanelsTopLeft className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger 
              value="payment-settings" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger 
              value="shipping-settings" 
              className="px-3 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default BuilderNavbar;
