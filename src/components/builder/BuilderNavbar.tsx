
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [isSaving, setIsSaving] = useState(false);
  const { saveElements } = useBuilder();

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

  return (
    <div className={`bg-white border-b border-slate-200 py-2 px-4 flex items-center justify-between ${isPreviewMode ? 'bg-opacity-95' : ''}`}>
      {/* Left section */}
      <div className="flex items-center">
        {!isPreviewMode && (
          <>
            <Sheet>
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
                    <button className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left">
                      <FileIcon className="h-4 w-4 mr-2" /> Pages
                    </button>
                    <button className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left">
                      <LayoutTemplate className="h-4 w-4 mr-2" /> Site Settings
                    </button>
                    <button className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left">
                      <ShoppingBag className="h-4 w-4 mr-2" /> Products
                    </button>
                    <button className="w-full flex items-center px-2 py-2 rounded hover:bg-slate-100 text-left">
                      <Settings className="h-4 w-4 mr-2" /> Page Settings
                    </button>
                  </nav>
                </div>
                <div className="mt-auto pt-4">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
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
