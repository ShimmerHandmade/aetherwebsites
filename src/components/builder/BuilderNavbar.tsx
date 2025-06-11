
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Settings,
  PanelsTopLeft,
  Store,
  FileText,
  Package,
  Save,
  ArrowLeft,
  Home,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  Truck,
  Smartphone,
  Tablet,
  Monitor,
  EyeIcon
} from "lucide-react";
import { toast } from "sonner";
import { useBuilder } from "@/contexts/BuilderContext";

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
  onShopLinkClick,
  onReturnToDashboard,
  viewSiteUrl,
  saveStatus = ''
}: BuilderNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { previewBreakpoint, setPreviewBreakpoint } = useBuilder();
  
  // Determine active tab based on current route
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path.includes('/products')) return "products";
    if (path.includes('/orders')) return "orders";
    if (path.includes('/pages')) return "pages";
    if (path.includes('/site-settings')) return "settings";
    if (path.includes('/payment-settings')) return "payment-settings";
    if (path.includes('/shipping-settings')) return "shipping-settings";
    return "edit";
  };
  
  const [activeTab, setActiveTab] = React.useState(getActiveTabFromRoute());
  
  // Update active tab when route changes
  React.useEffect(() => {
    setActiveTab(getActiveTabFromRoute());
  }, [location.pathname]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const websiteId = window.location.pathname.split("/")[2];
    if (!websiteId) return;
    
    switch (value) {
      case "edit":
        navigate(`/builder/${websiteId}`);
        break;
      case "products":
        navigate(`/builder/${websiteId}/products`);
        break;
      case "orders":
        navigate(`/builder/${websiteId}/orders`);
        break;
      case "pages":
        navigate(`/builder/${websiteId}/pages`);
        break;
      case "payment-settings":
        navigate(`/builder/${websiteId}/payment-settings`);
        break;
      case "shipping-settings":
        navigate(`/builder/${websiteId}/shipping-settings`);
        break;
    }
  };

  const handleReturnToDashboard = () => {
    if (isSaving) {
      toast("Please wait for the current save to complete", {
        description: "Your changes are being saved"
      });
      return;
    }
    
    if (onReturnToDashboard) {
      onReturnToDashboard();
    } else {
      navigate('/dashboard');
    }
  };

  const handleOpenFullPreview = () => {
    const websiteId = window.location.pathname.split("/")[2];
    if (!websiteId) return;
    
    // Use folder structure instead of subdomain
    window.open(`/site/${websiteId}`, '_blank');
  };

  const breakpoints = [
    { type: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
    { type: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { type: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' }
  ];

  const handleBreakpointChange = (breakpoint: string) => {
    console.log("📱 Breakpoint changed to:", breakpoint);
    setPreviewBreakpoint(breakpoint as any);
    
    // Apply responsive styles to the preview area
    const previewElement = document.querySelector('[data-builder-canvas]') || 
                          document.querySelector('.builder-canvas') ||
                          document.querySelector('.main-content');
                          
    if (previewElement) {
      // Remove existing breakpoint classes
      previewElement.classList.remove('preview-mobile', 'preview-tablet', 'preview-desktop');
      
      // Add new breakpoint class and set max-width
      const element = previewElement as HTMLElement;
      element.classList.add(`preview-${breakpoint}`);
      
      // Apply appropriate max-width based on breakpoint
      switch (breakpoint) {
        case 'mobile':
          element.style.maxWidth = '375px';
          element.style.margin = '0 auto';
          break;
        case 'tablet':
          element.style.maxWidth = '768px';
          element.style.margin = '0 auto';
          break;
        case 'desktop':
          element.style.maxWidth = '100%';
          element.style.margin = '0';
          break;
      }
      
      console.log("✅ Applied responsive styles to preview");
    } else {
      console.warn("❌ Preview element not found for responsive styling");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border-b border-slate-200 relative z-50">
      {/* Top bar - fixed height with better spacing */}
      <div className="h-14 flex items-center px-4 justify-between bg-white border-b border-slate-100">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReturnToDashboard}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          
          <Input
            className="w-48 h-8 text-sm font-medium flex-shrink-0"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            placeholder="Website Name"
          />

          <Select
            value={currentPage?.id || ""}
            onValueChange={(value) => onChangePage(value)}
          >
            <SelectTrigger className="w-40 h-8 flex-shrink-0">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title} {page.isHomePage ? "(Home)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {saveStatus && (
            <span className="text-xs text-gray-500 truncate min-w-0">
              {saveStatus}
            </span>
          )}
        </div>

        {/* Right side buttons - ensure they're always visible */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Responsive Controls - only show on edit tab */}
          {activeTab === "edit" && (
            <div className="hidden lg:flex items-center space-x-1 bg-gray-50 border rounded-lg p-1">
              <span className="text-xs text-gray-600 px-2">View:</span>
              {breakpoints.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant={previewBreakpoint === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleBreakpointChange(type)}
                  className="flex items-center space-x-1 h-7 px-2"
                  title={`Switch to ${label} view`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden xl:inline text-xs">{label}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Site Status Indicator */}
          {!isPublished && (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50"
            >
              <EyeIcon className="h-4 w-4" />
              Site is hidden
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenFullPreview}
            title="Open in new tab"
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          <Button 
            size="sm" 
            onClick={onPublish} 
            disabled={isPublishing}
            variant={isPublished ? "outline" : "default"}
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            {isPublishing ? "Publishing..." : isPublished ? "Published" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Tabs row */}
      <div className="px-4 border-t border-slate-200 bg-white">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent h-10 p-0 border-b border-transparent gap-4">
            <TabsTrigger 
              value="edit" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <PanelsTopLeft className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger 
              value="payment-settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger 
              value="shipping-settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
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
