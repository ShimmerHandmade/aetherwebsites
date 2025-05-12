
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";
import { Move, Grip, Trash, Copy, Settings, Edit } from "lucide-react";
import { renderElement } from "./renderElement";
import CanvasDragDropHandler from "../canvas/CanvasDragDropHandler";

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
    
    const data = {
      id: element.id,
      type: element.type,
      sourceIndex: index,
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    
    // Add a slight delay to improve UX
    setTimeout(() => {
      if (selected) {
        document.body.classList.add("is-dragging");
      }
    }, 0);
  };

  const handleDragEnd = () => {
    document.body.classList.remove("is-dragging");
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
        <div className="absolute top-2 right-2 flex space-x-1 bg-white p-1 rounded shadow-sm z-10">
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
            title="Edit properties"
            onClick={() => selectElement(element.id)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
            title="Drag to move"
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
