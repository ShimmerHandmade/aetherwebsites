
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";
import { Move, Grip, Trash, Copy, Settings, Edit } from "lucide-react";
import { renderElement } from "./renderElement";

interface BuilderElementProps {
  element: ElementType;
  index: number;
  selected: boolean;
  isPreviewMode?: boolean;
}

export const ElementWrapper: React.FC<BuilderElementProps> = ({ 
  element, 
  index, 
  selected,
  isPreviewMode = false
}) => {
  const { selectElement, removeElement, duplicateElement } = useBuilder();

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duplicateElement) {
      duplicateElement(element.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    // Find parent container id if any
    const container = e.currentTarget.closest('[data-container-id]');
    const parentId = container ? (container as HTMLElement).dataset.containerId : undefined;
    
    const data = {
      id: element.id,
      type: element.type,
      sourceIndex: index,
      parentId
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    
    // Add visual feedback for dragging
    setTimeout(() => {
      document.body.classList.add("is-dragging");
      if (selected) {
        e.currentTarget.classList.add("opacity-50");
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    document.body.classList.remove("is-dragging");
    e.currentTarget.classList.remove("opacity-50");
  };
  
  return (
    <div
      className={`relative mb-4 ${isPreviewMode ? '' : 'border-2 rounded'} ${
        selected ? "border-blue-500" : "border-transparent hover:border-gray-300"
      }`}
      onClick={handleClick}
      draggable={!isPreviewMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-element-type={element.type}
      data-element-id={element.id}
    >
      {!isPreviewMode && (
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none ${
          selected ? 'bg-blue-50 bg-opacity-10' : 'hover:bg-gray-50 hover:bg-opacity-20'
        }`}></div>
      )}
      
      {selected && !isPreviewMode && (
        <div className="absolute top-2 right-2 flex space-x-1 bg-white p-1 rounded shadow-sm z-20">
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
            title="Edit properties"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded cursor-grab" 
            title="Drag to move"
            onMouseDown={(e) => {
              // This helps initiate drag from the handle
              const parentElement = e.currentTarget.closest('[draggable="true"]');
              if (parentElement) {
                e.stopPropagation();
              }
            }}
          >
            <Grip className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDuplicate} 
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded" 
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" 
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className={`${selected && !isPreviewMode ? 'opacity-90' : ''}`}>
        {renderElement(element)}
      </div>
    </div>
  );
};

// Create a default export for backward compatibility
const BuilderElement: React.FC<BuilderElementProps> = (props) => <ElementWrapper {...props} />;
export default BuilderElement;
