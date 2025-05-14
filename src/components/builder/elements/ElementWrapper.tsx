import React, { useState, useRef } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { usePlan } from "@/contexts/PlanContext";
import { renderElement } from "./renderElement";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Trash, GripVertical, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import ResizableWrapper from "./ResizableWrapper";

interface BuilderElementProps {
  element: any;
  index: number;
  selected: boolean;
  isPreviewMode?: boolean;
  parentId?: string;
  canUseAnimations?: boolean;
  canUseEnterpriseAnimations?: boolean;
}

export const ElementWrapper: React.FC<BuilderElementProps> = ({
  element,
  index,
  selected,
  isPreviewMode = false,
  parentId,
  canUseAnimations,
  canUseEnterpriseAnimations,
}) => {
  const { selectElement, removeElement, duplicateElement, moveElementUp, moveElementDown } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Check if this is a premium animation element
  const isPremiumAnimationElement = element.props?.hasAnimation && (element.props?.animationType === 'premium' || element.props?.animationType === 'enterprise');
  
  // Use the props if provided, otherwise fallback to plan context
  const canUseAnimationsProp = canUseAnimations !== undefined ? canUseAnimations : (isPremium || isEnterprise);
  
  // Check if this is an enterprise-only animation element
  const isEnterpriseAnimationElement = element.props?.hasAnimation && element.props?.animationType === 'enterprise';
  const canUseEnterpriseAnimationsProp = canUseEnterpriseAnimations !== undefined ? canUseEnterpriseAnimations : isEnterprise;

  // Check if the element is resizable
  const isResizable = ["image", "video", "container", "section", "hero", "card", "feature", "gallery", "carousel", "testimonial"].includes(element.type);
  
  // Get resizable properties
  const maintainAspectRatio = element.props?.maintainAspectRatio || false;

  const handleElementClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
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
    if (isPreviewMode) return;
    
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
    
    // Add animation classes if available for this plan
    if (!isPreviewMode) {
      style += " hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2";
      
      if (selected) {
        style += " outline outline-2 outline-blue-500 outline-offset-2";
      }
      
      if (isDragging) {
        style += " opacity-50";
      }
    }

    // Add premium animations if available
    if (isPreviewMode) {
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

  // Render the element using the renderElement function
  const renderedElement = renderElement(element);
  
  // Some elements can't or shouldn't be draggable/editable
  const isDraggable = !isPreviewMode && !["navbar", "footer"].includes(element.type);

  // Create the element content
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
      style={{
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {/* Show premium badge if it's a premium animation element */}
      {isPremiumAnimationElement && !isPreviewMode && (
        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-1 rounded-br flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> 
          {isEnterpriseAnimationElement ? "Enterprise" : "Premium"}
        </div>
      )}

      {renderedElement}
    </div>
  );

  // Always show element controls for selected elements
  const controlsBar = !isPreviewMode && selected ? (
    <div className="absolute top-0 right-0 -mt-10 flex space-x-1 bg-white p-1 rounded shadow-sm z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleMoveUpClick}
        title="Move element up"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleMoveDownClick}
        title="Move element down"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      
      {isDraggable && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-grab"
          title="Drag to reposition"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDuplicateClick}
        title="Duplicate element"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      {!["navbar", "footer"].includes(element.type) && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDeleteClick}
          title="Remove element"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  ) : null;

  // If the element is resizable and not in preview mode, wrap it in ResizableWrapper
  if (isResizable && !isPreviewMode) {
    return (
      <div className="relative">
        {controlsBar}
        <ResizableWrapper
          elementId={element.id}
          isSelected={selected}
          isPreviewMode={isPreviewMode}
          maintainAspectRatio={maintainAspectRatio}
          minWidth={50}
          minHeight={50}
          showHandles={selected}
          className="resize-wrapper"
        >
          {content}
        </ResizableWrapper>
      </div>
    );
  }

  // Otherwise, return the content directly with controls
  return (
    <div className="relative">
      {controlsBar}
      {content}
    </div>
  );
};

// Also export as default for backward compatibility
export default ElementWrapper;
