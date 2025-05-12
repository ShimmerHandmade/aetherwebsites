
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageSettings from "./PageSettings";
import ProductManager from "./ProductManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "@/lib/uuid";
import {
  LayoutGrid,
  Pencil,
  Settings,
  ShoppingBag,
  Search,
  Type,
  Image,
  Video,
  Square,
  FormInput,
  FileText as FileTextIcon,
  Package,
  Users,
  CreditCard,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PageEditorSidebarProps {
  isPreviewMode: boolean;
}

const PageEditorSidebar: React.FC<PageEditorSidebarProps> = ({ isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedElementId, addElement } = useBuilder();

  if (isPreviewMode) return null;

  const basicElements = [
    { 
      label: "Text", 
      icon: Type,
      onClick: () => addElement({
        id: uuidv4(),
        type: "text",
        content: "Double-click to edit this text",
        props: {}
      })
    },
    { 
      label: "Image", 
      icon: Image,
      onClick: () => addElement({
        id: uuidv4(),
        type: "image",
        content: "",
        props: {}
      })
    },
    { 
      label: "Button", 
      icon: Square,
      onClick: () => addElement({
        id: uuidv4(),
        type: "button",
        content: "Click Me",
        props: {
          variant: "primary"
        }
      })
    },
    { 
      label: "Video", 
      icon: Video,
      onClick: () => addElement({
        id: uuidv4(),
        type: "video",
        content: "",
        props: {
          controls: true
        }
      })
    },
    { 
      label: "Form", 
      icon: FormInput,
      onClick: () => addElement({
        id: uuidv4(),
        type: "form",
        content: "",
        props: {}
      })
    }
  ];

  const handleAddElement = (elementInfo: typeof basicElements[0]) => {
    if (elementInfo.onClick) {
      elementInfo.onClick();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search bar at top */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search"
            className="pl-9 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Navigation tabs */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab("elements")}
            className={cn(
              "flex-1 p-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === "elements"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            Elements
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            className={cn(
              "flex-1 p-4 text-sm font-medium border-b-2 transition-colors",
              selectedElementId ? "" : "opacity-50 cursor-not-allowed",
              activeTab === "properties"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
            disabled={!selectedElementId}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex-1 p-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            Page
          </button>
        </div>

        {/* Tab content */}
        <ScrollArea className="flex-1">
          {activeTab === "elements" && (
            <div className="p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-600 mb-3">Basic</h3>
                <div className="grid grid-cols-2 gap-4">
                  {basicElements.map((element) => (
                    <div
                      key={element.label}
                      className="flex flex-col items-center justify-center p-3 hover:bg-slate-50 rounded-md cursor-pointer border border-slate-200 transition-colors duration-200"
                      onClick={() => handleAddElement(element)}
                    >
                      <element.icon className="h-6 w-6 mb-2 text-slate-600" />
                      <span className="text-xs text-slate-600">{element.label}</span>
                    </div>
                  ))}
                  <div
                    className="flex flex-col items-center justify-center p-3 hover:bg-slate-50 rounded-md cursor-pointer border border-slate-200 transition-colors duration-200"
                  >
                    <Plus className="h-6 w-6 mb-2 text-slate-600" />
                    <span className="text-xs text-slate-600">More</span>
                  </div>
                </div>
              </div>
              <ElementPalette />
            </div>
          )}
          {activeTab === "properties" && <ElementProperties />}
          {activeTab === "settings" && <PageSettings />}
          {activeTab === "products" && <ProductManager />}
        </ScrollArea>
      </div>
    </div>
  );
};

export default PageEditorSidebar;
