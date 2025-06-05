
import React, { useState, useRef, useEffect } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { usePlan } from "@/contexts/PlanContext";
import { renderElement } from "./renderElement";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Trash, GripVertical, ArrowUp, ArrowDown, Sparkles, Lock } from "lucide-react";
import ResizableWrapper from "./ResizableWrapper";

interface BuilderElementProps {
  element: any;
  index: number;
  selected: boolean;
  isPreviewMode?: boolean;
  parentId?: string;
  canUseAnimations?: boolean;
  canUseEnterpriseAnimations?: boolean;
  isLiveSite?: boolean;
  onElementReady?: () => void;
}

interface ResponsiveSettings {
  hidden?: boolean;
  order?: number;
  className?: string;
  props?: Record<string, any>;
}

export const ElementWrapper: React.FC<BuilderElementProps> = ({
  element,
  index,
  selected,
  isPreviewMode = false,
  parentId,
  canUseAnimations,
  canUseEnterpriseAnimations,
  isLiveSite = false,
  onElementReady,
}) => {
  const { selectElement, removeElement, duplicateElement, moveElementUp, moveElementDown, previewBreakpoint } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Notify parent when element is ready
  useEffect(() => {
    // Call onElementReady when the component mounts
    if (onElementReady) {
      onElementReady();
    }
  }, [onElementReady]);

  // Get responsive settings for current preview breakpoint
  const getResponsiveSettings = (): ResponsiveSettings => {
    if (!element.responsiveSettings) return {};
    
    // Get settings for current breakpoint and merge with base settings
    const mobileSettings = element.responsiveSettings.mobile || {};
    const tabletSettings = element.responsiveSettings.tablet || {};
    const desktopSettings = element.responsiveSettings.desktop || {};
    
    // Apply cascading responsive settings
    let settings: ResponsiveSettings = {};
    if (previewBreakpoint === 'mobile') {
      settings = mobileSettings;
    } else if (previewBreakpoint === 'tablet') {
      settings = { ...mobileSettings, ...tabletSettings };
    } else {
      settings = { ...mobileSettings, ...tabletSettings, ...desktopSettings };
    }
    
    return settings;
  };

  const responsiveSettings = getResponsiveSettings();
  
  // Check if element should be hidden on current breakpoint
  if (responsiveSettings.hidden && (isPreviewMode || isLiveSite)) {
    return null;
  }

  // Check if this is a premium animation element
  const isPremiumAnimationElement = element.props?.hasAnimation && (element.props?.animationType === 'premium' || element.props?.animationType === 'enterprise');
  
  // Use the props if provided, otherwise fallback to plan context
  const canUseAnimationsProp = canUseAnimations !== undefined ? canUseAnimations : (isPremium || isEnterprise);
  
  // Check if this is an enterprise-only animation element
  const isEnterpriseAnimationElement = element.props?.hasAnimation && element.props?.animationType === 'enterprise';
  const canUseEnterpriseAnimationsProp = canUseEnterpriseAnimations !== undefined ? canUseEnterpriseAnimations : isEnterprise;

  // Is the element locked due to plan restrictions
  const isElementLocked = (isPremiumAnimationElement && !canUseAnimationsProp) || 
                          (isEnterpriseAnimationElement && !canUseEnterpriseAnimationsProp);

  // Check if the element is resizable
  const isResizable = ["image", "video", "container", "section", "hero", "card", "feature", "gallery", "carousel", "testimonial"].includes(element.type);
  
  // Get resizable properties
  const maintainAspectRatio = element.props?.maintainAspectRatio || false;

  const handleElementClick = (e: React.MouseEvent) => {
    // Only allow selecting elements in builder mode, not in preview or live site
    if (!isPreviewMode && !isLiveSite) {
      e.stopPropagation();
      selectElement(element.id);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };
  
  const handleMoveUpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveElementUp(element.id);
  };
  
  const handleMoveDownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveElementDown(element.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isPreviewMode || isElementLocked || isLiveSite) {
      e.preventDefault();
      return false;
    }
    
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    
    const data = {
      id: element.id,
      type: element.type,
      sourceIndex: index,
      parentId: parentId
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    
    // Add a class to the element being dragged
    if (elementRef.current) {
      elementRef.current.classList.add("opacity-50");
      
      // Create a drag image
      const dragImage = document.createElement('div');
      dragImage.textContent = element.type;
      dragImage.className = 'bg-blue-100 text-blue-800 p-2 rounded shadow';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      
      // Remove the element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (elementRef.current) {
      elementRef.current.classList.remove("opacity-50");
    }
  };

  // Add different styling based on element type and animation status
  const getElementStyle = () => {
    // Basic style for all elements
    let style = "transition-all duration-150 relative";
    
    // Apply responsive classes
    if (responsiveSettings.className) {
      style += ` ${responsiveSettings.className}`;
    }
    
    // Add responsive order if specified
    if (responsiveSettings.order !== undefined) {
      style += ` order-${responsiveSettings.order}`;
    }
    
    // Add preview mode indication for hidden elements
    if (responsiveSettings.hidden && !isPreviewMode && !isLiveSite) {
      style += " opacity-50 border-2 border-dashed border-orange-300";
    }
    
    // Add animation classes if available for this plan
    if (!isPreviewMode && !isLiveSite) {
      style += " hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2";
      
      if (selected) {
        style += " outline outline-2 outline-blue-500 outline-offset-2";
      }
      
      if (isDragging) {
        style += " opacity-50";
      }
      
      if (isElementLocked) {
        style += " opacity-75";
      }
    }

    // Add premium animations if available
    if (isPreviewMode || isLiveSite) {
      if (element.props?.hasAnimation) {
        if ((element.props.animationType === 'premium' && canUseAnimationsProp) || 
            (element.props.animationType === 'enterprise' && canUseEnterpriseAnimationsProp) || 
            element.props.animationType === 'basic') {
          switch (element.props.animationEffect) {
            case 'fade-in':
              style += " animate-fade-in";
              break;
            case 'scale-in':
              style += " animate-scale-in";
              break;
            case 'slide-in':
              style += " animate-slide-in-right";
              break;
            default:
              // No animation
          }
        }
      }
    }
    
    // Add specific styling based on element type
    if (element.type === "section") {
      style += " min-h-[100px]";
    } else if (element.type === "container") {
      style += " min-h-[80px] p-4";
    }
    
    return style;
  };

  // Add a class to prevent interactions in builder mode for certain elements
  const getPreventInteractionClass = () => {
    if (!isPreviewMode && !isLiveSite) {
      return "pointer-events-none";
    }
    return "";
  };

  // Render the element using the renderElement function
  const renderedElement = renderElement(element, isPreviewMode, isLiveSite);
  
  // Some elements can't or shouldn't be draggable/editable
  const isDraggable = !isPreviewMode && !isLiveSite && !["navbar", "footer"].includes(element.type) && !isElementLocked;

  // Always show element controls for selected elements in builder mode - Fixed positioning
  const controlsBar = !isPreviewMode && !isLiveSite && selected ? (
    <div className="absolute -top-8 left-0 flex space-x-1 bg-white p-1 rounded shadow-lg border z-50 min-w-max">
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={handleMoveUpClick}
        title="Move element up"
      >
        <ArrowUp className="h-3 w-3" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={handleMoveDownClick}
        title="Move element down"
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
      
      {isDraggable && (
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 cursor-grab"
          title="Drag to reposition"
        >
          <GripVertical className="h-3 w-3" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={handleDuplicateClick}
        title="Duplicate element"
      >
        <Copy className="h-3 w-3" />
      </Button>
      
      {!["navbar", "footer"].includes(element.type) && (
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={handleDeleteClick}
          title="Remove element"
        >
          <Trash className="h-3 w-3 text-red-500" />
        </Button>
      )}
    </div>
  ) : null;

  // Create the element content with responsive container
  const content = (
    <div
      ref={elementRef}
      className={getElementStyle()}
      onClick={handleElementClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-element-id={element.id}
      data-element-type={element.type}
      data-breakpoint={previewBreakpoint}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        order: responsiveSettings.order || 'initial'
      }}
    >
      {/* Show responsive indicator in builder mode */}
      {!isPreviewMode && !isLiveSite && responsiveSettings.hidden && (
        <div className="absolute top-0 right-0 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl flex items-center gap-1">
          <span>Hidden on {previewBreakpoint}</span>
        </div>
      )}

      {/* Show premium badge with improved styling */}
      {isPremiumAnimationElement && !isPreviewMode && !isLiveSite && (
        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-1 rounded-br flex items-center gap-1 shadow-sm">
          {isElementLocked ? <Lock className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
          <span>{isEnterpriseAnimationElement ? "Enterprise" : "Premium"}</span>
        </div>
      )}

      {/* Show an overlay for locked elements */}
      {isElementLocked && !isPreviewMode && !isLiveSite && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-20 rounded">
          <div className="bg-white p-2 rounded-lg shadow-lg flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium">Upgrade to unlock</span>
          </div>
        </div>
      )}

      {/* Apply pointer-events-none to children in builder to prevent interactions */}
      <div className={!isPreviewMode && !isLiveSite ? "pointer-events-none" : ""}>
        {renderedElement}
      </div>
    </div>
  );

  // If the element is resizable and not in preview or live site mode, wrap it in ResizableWrapper
  if (isResizable && !isPreviewMode && !isLiveSite) {
    return (
      <div className="relative mt-10 mb-4"> {/* Increased top margin for controls */}
        {controlsBar}
        <ResizableWrapper
          elementId={element.id}
          isSelected={selected}
          isPreviewMode={isPreviewMode}
          maintainAspectRatio={maintainAspectRatio}
          minWidth={50}
          minHeight={50}
          showHandles={false}
          className="resize-wrapper"
        >
          {content}
        </ResizableWrapper>
      </div>
    );
  }

  // Otherwise, return the content directly with controls
  return (
    <div className={`relative ${!isPreviewMode && !isLiveSite ? "mt-10" : ""} mb-4`}> {/* Increased top margin for controls */}
      {controlsBar}
      {content}
    </div>
  );
};

// Also export as default for backward compatibility
export default ElementWrapper;
