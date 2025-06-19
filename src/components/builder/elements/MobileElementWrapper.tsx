
import React, { useState, useRef, useEffect } from "react";
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
  GripVertical,
  Eye 
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
  const { 
    isMobile, 
    longPressActive, 
    getMobileInteractionProps,
    isTap,
    isReadyForContextMenu 
  } = useMobileBuilder();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only apply mobile wrapper on mobile devices
  if (!isMobile || isPreviewMode) {
    return <>{children}</>;
  }

  // Enhanced touch handling
  const handleElementTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    
    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    
    // Handle tap to select
    if (isTap() && onSelect) {
      onSelect();
      
      // Show quick actions briefly for selected elements
      if (selected) {
        setShowQuickActions(true);
        touchTimeoutRef.current = setTimeout(() => {
          setShowQuickActions(false);
        }, 3000);
      }
    }
    
    // Handle long press for context menu
    if (isReadyForContextMenu() && selected) {
      setShowMobileMenu(true);
      setShowQuickActions(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const handleDuplicate = () => {
    duplicateElement(element.id);
    setShowMobileMenu(false);
    setShowQuickActions(false);
  };

  const handleDelete = () => {
    removeElement(element.id);
    setShowMobileMenu(false);
    setShowQuickActions(false);
  };

  const handleMoveUp = () => {
    moveElementUp(element.id);
    setShowMobileMenu(false);
    setShowQuickActions(false);
  };

  const handleMoveDown = () => {
    moveElementDown(element.id);
    setShowMobileMenu(false);
    setShowQuickActions(false);
  };

  const handleEdit = () => {
    selectElement(element.id);
    setShowMobileMenu(false);
    setShowQuickActions(false);
  };

  const mobileProps = getMobileInteractionProps();

  return (
    <div
      ref={wrapperRef}
      className={`
        relative transition-all duration-200 rounded-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20' : ''}
        ${longPressActive ? 'scale-105 shadow-xl ring-2 ring-blue-400' : ''}
        ${showQuickActions ? 'ring-1 ring-blue-300' : ''}
      `}
      onTouchStart={(e) => {
        handleElementTouch(e);
        if (mobileProps.onTouchStart) {
          mobileProps.onTouchStart(e);
        }
      }}
      onTouchMove={mobileProps.onTouchMove}
      onTouchEnd={mobileProps.onTouchEnd}
      style={mobileProps.style}
    >
      {children}
      
      {/* Enhanced mobile selection indicator with quick actions */}
      {selected && showQuickActions && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-blue-600 rounded-full px-3 py-2 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full"
              onClick={handleMoveUp}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full"
              onClick={handleMoveDown}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Context menu trigger for long press */}
      {selected && (
        <div className="absolute -top-2 -right-2 z-50">
          <DropdownMenu open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white"
              >
                <MoreVertical className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white border shadow-xl z-50 rounded-lg"
            >
              <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-3 py-3">
                <Settings className="h-5 w-5" />
                <span className="text-base">Edit Properties</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMoveUp} className="flex items-center gap-3 py-3">
                <ArrowUp className="h-5 w-5" />
                <span className="text-base">Move Up</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveDown} className="flex items-center gap-3 py-3">
                <ArrowDown className="h-5 w-5" />
                <span className="text-base">Move Down</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-3 py-3">
                <Copy className="h-5 w-5" />
                <span className="text-base">Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="flex items-center gap-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-5 w-5" />
                <span className="text-base">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Visual feedback for long press */}
      {longPressActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Release for menu
          </div>
        </div>
      )}
      
      {/* Drag handle for mobile - more prominent */}
      {selected && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-40">
          <div className="bg-blue-600 rounded-full p-2 shadow-lg cursor-grab active:cursor-grabbing border-2 border-white">
            <GripVertical className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileElementWrapper;
