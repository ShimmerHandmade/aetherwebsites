
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  Globe,
  Settings,
  PanelsTopLeft,
  Store,
  FileText,
  Package
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  currentPage?: Page | null;
  pages: Page[];
  onChangePage: (pageId: string) => void;
  onShopLinkClick?: () => void;
}

const BuilderNavbar = ({
  websiteName,
  setWebsiteName,
  onSave,
  onPublish,
  isPublished = false,
  isPreviewMode,
  setIsPreviewMode,
  currentPage,
  pages,
  onChangePage,
  onShopLinkClick
}: BuilderNavbarProps) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [autoSave, setAutoSave] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoSave) {
      timer = setTimeout(() => {
        onSave();
        toast({
          title: "Auto-save",
          description: "Website saved automatically"
        });
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [websiteName, autoSave, onSave]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "edit") {
      // Stay on the current page, just change the tab
      return;
    }
    
    const websiteId = window.location.pathname.split("/")[2];
    if (!websiteId) return;
    
    switch (value) {
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

  return (
    <div className="w-full flex flex-col bg-white border-b border-slate-200">
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
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
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setAutoSave(!autoSave)}>
            {autoSave ? "Auto-save: On" : "Auto-save: Off"}
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
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
          <Button size="sm" onClick={onPublish} disabled={isPublished}>
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs row */}
      <div className="px-4 border-t border-slate-200">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent h-10 p-0 border-b border-transparent gap-4">
            <TabsTrigger 
              value="edit" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <PanelsTopLeft className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger 
              value="page-settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <Settings className="h-4 w-4 mr-2" />
              Page Settings
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="px-2 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
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
