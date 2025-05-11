
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Save, Eye, EyeOff, Settings, LayoutGrid } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { PreviewModeProps } from "./BuilderLayout";
import { useBuilder } from "@/contexts/BuilderContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
    <div className={`bg-gray-900 text-white py-2 px-4 ${isPreviewMode ? 'bg-opacity-80' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {!isPreviewMode && (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Builder Menu</SheetTitle>
                    <SheetDescription>Configure your website builder.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <nav className="space-y-1">
                      <button className="w-full flex items-center px-2 py-2 rounded hover:bg-gray-100 text-left">
                        <LayoutGrid className="h-4 w-4 mr-2" /> Pages
                      </button>
                      <button className="w-full flex items-center px-2 py-2 rounded hover:bg-gray-100 text-left">
                        <Settings className="h-4 w-4 mr-2" /> Settings
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

              <Input
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="ml-4 max-w-xs bg-gray-800 border-gray-700 text-white"
              />
            </>
          )}
          {isPreviewMode && (
            <span className="text-white font-medium">{websiteName}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Toggle
            pressed={isPreviewMode}
            onPressedChange={togglePreviewMode}
            aria-label="Toggle preview mode"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreviewMode ? "Edit" : "Preview"}
          </Toggle>
          
          {!isPreviewMode && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={onPublish}
                disabled={isPublished}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPublished ? "Published" : "Publish"}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderNavbar;
