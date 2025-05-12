import React, { useState, useEffect } from "react";
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
  Store
} from "lucide-react";

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
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoSave) {
      timer = setTimeout(() => {
        onSave();
        toast.success("Website saved automatically");
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [websiteName, autoSave]);

  return (
    <div className="w-full h-14 flex items-center border-b border-slate-200 bg-white px-4 justify-between">
      <div className="flex items-center space-x-4">
        <Input
          className="w-48 h-8 text-sm font-medium"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />

        <Select
          value={currentPage?.id || ""}
          onValueChange={(value) => onChangePage(value)}
        >
          <SelectTrigger className="w-32 h-8">
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

        {/* Add the Shop link */}
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
  );
};

export default BuilderNavbar;
