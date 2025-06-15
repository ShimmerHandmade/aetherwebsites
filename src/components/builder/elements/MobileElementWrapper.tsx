
import React, { useState, useRef } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { useMobileBuilder } from "@/hooks/useMobileBuilder";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Copy, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Settings,
  GripVertical 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MobileElementWrapperProps {
  element: any;
  children: React.ReactNode;
  selected: boolean;
  isPreviewMode?: boolean;
  onSelect?: () => void;
}

const MobileElementWrapper: React.FC<MobileElementWrapperProps> = ({
  element,
  children,
  selected,
  isPreviewMode = false,
  onSelect,
}) => {
  const { 
    selectElement, 
    removeElement, 
    duplicateElement, 
    moveElementUp, 
    moveElementDown 
  } = useBuilder();
  const { isMobile, longPressActive, getMobileInteractionProps } = useMobileBuilder();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Only apply mobile wrapper on mobile devices
  if (!isMobile || isPreviewMode) {
    return <>{children}</>;
  }

  const handleElementTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    // Single tap to select
    if (!selected && onSelect) {
      onSelect();
    }
    
    // Long press to show context menu
    if (longPressActive && selected) {
      setShowMobileMenu(true);
    }
  };

  const handleDuplicate = () => {
    duplicateElement(element.id);
    setShowMobileMenu(false);
  };

  const handleDelete = () => {
    removeElement(element.id);
    setShowMobileMenu(false);
  };

  const handleMoveUp = () => {
    moveElementUp(element.id);
    setShowMobileMenu(false);
  };

  const handleMoveDown = () => {
    moveElementDown(element.id);
    setShowMobileMenu(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`
        relative transition-all duration-200
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${longPressActive ? 'scale-105 shadow-lg' : ''}
      `}
      onTouchStart={handleElementTouch}
      {...getMobileInteractionProps()}
    >
      {children}
      
      {/* Mobile selection indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 z-50">
          <DropdownMenu open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white border shadow-lg z-50"
            >
              <DropdownMenuItem onClick={handleMoveUp} className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                Move Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveDown} className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                Move Down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Drag handle for mobile */}
      {selected && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-40">
          <div className="bg-blue-600 rounded p-1 shadow-lg cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileElementWrapper;
