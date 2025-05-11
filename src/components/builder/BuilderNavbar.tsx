
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Save, Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface BuilderNavbarProps {
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
  isPublished 
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Builder Menu</SheetTitle>
                <SheetDescription>Configure your e-commerce website.</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <nav className="space-y-1">
                  <a href="#pages" className="block px-2 py-2 rounded hover:bg-gray-100">Pages</a>
                  <a href="#templates" className="block px-2 py-2 rounded hover:bg-gray-100">Templates</a>
                  <a href="#products" className="block px-2 py-2 rounded hover:bg-gray-100">Products</a>
                  <a href="#settings" className="block px-2 py-2 rounded hover:bg-gray-100">Settings</a>
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
        </div>

        <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </div>
  );
};

export default BuilderNavbar;
