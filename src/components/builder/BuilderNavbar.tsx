
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save, 
  Eye, 
  ExternalLink, 
  ArrowLeft, 
  Loader2, 
  Globe,
  Settings,
  ShoppingBag,
  FileText,
  Palette
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateSelector from "./TemplateSelector";

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
  isPreviewMode?: boolean;
  setIsPreviewMode?: (mode: boolean) => void;
  currentPage?: Page;
  pages?: Page[];
  onChangePage?: (pageId: string) => void;
  onShopLinkClick?: () => void;
  onReturnToDashboard?: () => void;
  viewSiteUrl?: string;
  saveStatus?: string;
}

const BuilderNavbar: React.FC<BuilderNavbarProps> = ({
  websiteName,
  setWebsiteName,
  onSave,
  onPublish,
  isPublished = false,
  isSaving = false,
  isPublishing = false,
  isPreviewMode = false,
  setIsPreviewMode,
  currentPage,
  pages = [],
  onChangePage,
  onShopLinkClick,
  onReturnToDashboard,
  viewSiteUrl,
  saveStatus,
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    console.log("Selected template:", templateId);
    setShowTemplates(false);
    // Template application logic would go here
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReturnToDashboard}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <Input
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            className="text-lg font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0 max-w-xs"
            placeholder="Website Name"
          />
          
          {currentPage && (
            <div className="text-sm text-gray-500">
              / {currentPage.title}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {saveStatus && (
            <span className="text-xs text-gray-500 mr-2">{saveStatus}</span>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
          >
            <Palette className="mr-2 h-4 w-4" />
            Templates
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onShopLinkClick}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangePage && onChangePage('pages')}>
                <FileText className="mr-2 h-4 w-4" />
                Pages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode && setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>

          <Button 
            size="sm" 
            onClick={onPublish}
            disabled={isPublishing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                {isPublished ? 'Update' : 'Publish'}
              </>
            )}
          </Button>

          {viewSiteUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(viewSiteUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Website Templates</DialogTitle>
          </DialogHeader>
          <TemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuilderNavbar;
