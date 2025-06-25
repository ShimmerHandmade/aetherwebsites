
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Copy,
  GripVertical
} from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement } from "@/contexts/builder/types";
import { cn } from "@/lib/utils";

interface LayerItemProps {
  element: BuilderElement;
  level: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  element,
  level,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = element.children && element.children.length > 0;
  
  const getElementIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: "T",
      image: "🖼️",
      button: "🔘",
      section: "📄",
      container: "📦",
      hero: "🎯",
      navbar: "🧭",
      footer: "👣",
      heading: "H",
      card: "🃏"
    };
    return icons[type] || "📄";
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors",
          isSelected && "bg-blue-50 border border-blue-200",
          "group"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(element.id)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        {/* Drag Handle */}
        <GripVertical className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Element Icon */}
        <span className="text-xs">{getElementIcon(element.type)}</span>
        
        {/* Element Name */}
        <span className="flex-1 truncate">
          {element.props?.title || element.content || `${element.type.charAt(0).toUpperCase() + element.type.slice(1)}`}
        </span>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(element.id);
            }}
            title="Toggle visibility"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(element.id);
            }}
            title="Duplicate"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {element.children!.map((child) => (
            <LayerItem
              key={child.id}
              element={child}
              level={level + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LayersPanel: React.FC = () => {
  const { 
    elements, 
    selectedElementId, 
    selectElement, 
    removeElement, 
    duplicateElement,
    updateElement 
  } = useBuilder();

  const handleToggleVisibility = (id: string) => {
    updateElement(id, { 
      props: { 
        style: { 
          display: 'none' // This is a simplified implementation
        } 
      } 
    });
  };

  const handleDelete = (id: string) => {
    removeElement(id);
  };

  const handleDuplicate = (id: string) => {
    duplicateElement(id);
  };

  const handleSelect = (id: string) => {
    selectElement(id);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-2">
          {elements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No elements added yet</p>
              <p className="text-xs mt-1">Add elements to see them here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {elements.map((element) => (
                <LayerItem
                  key={element.id}
                  element={element}
                  level={0}
                  isSelected={selectedElementId === element.id}
                  onSelect={handleSelect}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LayersPanel;
