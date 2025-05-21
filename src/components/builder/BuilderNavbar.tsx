
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
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

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
  saveStatus?: string; // Added save status prop
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
  
  // Determine active tab based on current route
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path.includes('/products')) return "products";
    if (path.includes('/pages')) return "pages";
    if (path.includes('/page-settings')) return "page-settings";
    if (path.includes('/settings')) return "settings";
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
    
    // Prevent default navigation and use react-router instead
    switch (value) {
      case "edit":
        navigate(`/builder/${websiteId}`);
        break;
      case "products":
        navigate(`/builder/${websiteId}/products`);
        break;
      case "pages":
        navigate(`/builder/${websiteId}/pages`);
        break;
      case "page-settings":
        navigate(`/builder/${websiteId}/page-settings`);
        break;
      case "settings":
        navigate(`/builder/${websiteId}/settings`);
        break;
    }
  };

  const handleReturnToDashboard = () => {
    // Show confirmation if there are unsaved changes
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
    // If viewSiteUrl is provided, use that, otherwise use the default preview URL
    if (viewSiteUrl) {
      window.open(viewSiteUrl, '_blank');
    } else {
      const websiteId = window.location.pathname.split("/")[2];
      if (!websiteId) return;
      
      // Open a new tab with the preview URL
      window.open(`/builder/${websiteId}?preview=true`, '_blank');
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border-b border-slate-200">
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReturnToDashboard}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          
          <Input
            className="w-48 h-8 text-sm font-medium"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            placeholder="Website Name"
          />

          <Select
            value={currentPage?.id || ""}
            onValueChange={(value) => onChangePage(value)}
          >
            <SelectTrigger className="w-40 h-8">
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

          {/* Shop link */}
          {onShopLinkClick && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={onShopLinkClick}
            >
              <Store className="h-4 w-4" />
              Shop
            </Button>
          )}
          
          {/* Save status indicator */}
          {saveStatus && (
            <span className="text-xs text-gray-500 ml-2">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenFullPreview}
            title="Open in new tab"
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            )}
          </Button>
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1"
            aria-label="Save website manually"
            title={isSaving ? "Saving in progress..." : "Save website manually (changes are also auto-saved)"}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button 
            size="sm" 
            onClick={onPublish} 
            disabled={isPublishing || isPublished}
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            {isPublishing ? "Publishing..." : isPublished ? "Published" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Tabs row */}
      <div className="px-4 border-t border-slate-200">
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
              value="pages" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger 
              value="page-settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Page Settings
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default BuilderNavbar;

