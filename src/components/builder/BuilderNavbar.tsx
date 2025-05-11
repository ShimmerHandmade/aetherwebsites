
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, ArrowRight, Eye, EyeOff, Monitor, Menu, Smartphone } from "lucide-react";
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
      const elements = saveElements();
      console.log("Saving elements:", elements);
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
    <div className="bg-white text-gray-800 py-2 px-4 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-medium uppercase tracking-wide px-6"
            onClick={handleSave}
          >
            SAVE
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="font-medium uppercase tracking-wide px-6"
            onClick={() => navigate("/dashboard")}
          >
            EXIT
          </Button>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <Button variant="ghost" size="sm" className="p-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-center">
            <div className="text-sm font-medium">Home</div>
            <div className="text-xs text-gray-500">Page · {isPublished ? 'Published' : 'Draft'}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-1">
            <Monitor className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <Smartphone className="h-5 w-5" />
          </Button>
          <Button 
            variant={isPreviewMode ? "default" : "outline"} 
            size="sm"
            onClick={togglePreviewMode}
            className="border border-gray-200"
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderNavbar;
