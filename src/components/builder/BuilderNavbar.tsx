
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Save, Eye, EyeOff, Settings, Monitor, Smartphone, FileIcon, LayoutTemplate, ShoppingBag } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { PreviewModeProps } from "./BuilderLayout";
import { useBuilder } from "@/contexts/BuilderContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";

interface BuilderNavbarProps extends PreviewModeProps {
  websiteName: string;
  setWebsiteName: (name: string) => void;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  isPublished: boolean;
}

const BuilderNavbar: React.FC<BuilderNavbarProps> = ({ 
  websiteName, 
  setWebsiteName, 
  onSave, 
  onPublish,
  isPublished,
  isPreviewMode = false,
  setIsPreviewMode = () => {}
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const { saveElements } = useBuilder();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Get the current elements from the builder context
      const elements = saveElements();
      console.log("Saving elements:", elements);
      
      // Call the onSave prop which will save to the database
      await onSave();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Define menu items with their routes - updated to builder-specific routes
  const menuItems = [
    { title: "Pages", icon: FileIcon, route: `/builder/${id}/pages` },
    { title: "Site Settings", icon: LayoutTemplate, route: `/builder/${id}/site-settings` },
    { title: "Products", icon: ShoppingBag, route: `/builder/${id}/products` },
    { title: "Page Settings", icon: Settings, route: `/builder/${id}/page-settings` }
  ];

  // Also include links to Dashboard and Profile
  const appMenuItems = [
    { title: "Dashboard", icon: FileIcon, route: "/dashboard" },
    { title: "Profile", icon: Settings, route: "/profile" }
  ];

  const handleMenuItemClick = (route: string) => {
    // Close the sheet after clicking a menu item
    setIsSheetOpen(false);
    
    // Navigate to the route if provided, otherwise stay on the current page
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className={`bg-white border-b border-slate-200 py-2 px-4 flex items-center justify-between ${isPreviewMode ? 'bg-opacity-95' : ''}`}>
      {/* Left section */}
      <div className="flex items-center">
        {!isPreviewMode && (
          <>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Builder Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="space-y-1">
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">Site Controls</h3>
                      {menuItems.map((item) => (
                        <button 
                          key={item.title}
                          className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left"
                          onClick={() => handleMenuItemClick(item.route)}
                        >
                          <item.icon className="h-4 w-4 mr-2" /> {item.title}
                        </button>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">App Navigation</h3>
                      {appMenuItems.map((item) => (
                        <button 
                          key={item.title}
                          className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left"
                          onClick={() => handleMenuItemClick(item.route)}
                        >
                          <item.icon className="h-4 w-4 mr-2" /> {item.title}
                        </button>
                      ))}
                    </div>
                  </nav>
                </div>
                <div className="mt-auto pt-4">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => handleMenuItemClick("/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        {/* Page title */}
        <div className="ml-4">
          {!isPreviewMode ? (
            <Input
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="max-w-xs border-slate-200 font-medium"
            />
          ) : (
            <div className="text-slate-800 font-medium">{websiteName}</div>
          )}
          <div className="text-xs text-slate-500">Page · {isPublished ? 'Published' : 'Draft'}</div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-3">
        {/* Device preview toggles */}
        <div className="hidden md:flex items-center border border-slate-200 rounded-md p-1 mr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
            <Monitor size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
            <Smartphone size={16} />
          </Button>
        </div>

        {/* Preview toggle */}
        <Toggle
          pressed={isPreviewMode}
          onPressedChange={togglePreviewMode}
          aria-label="Toggle preview mode"
          className="border border-slate-200"
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {isPreviewMode ? "Edit" : "Preview"}
        </Toggle>
        
        {!isPreviewMode && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-200 text-slate-700"
              onClick={onPublish}
              disabled={isPublished}
            >
              {isPublished ? "Published" : "Publish"}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BuilderNavbar;
