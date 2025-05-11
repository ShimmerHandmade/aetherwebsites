
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";
import { Move, Grip, Trash, Copy } from "lucide-react";
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
      className={`mb-4 ${isPreviewMode ? '' : 'border-2 rounded'} ${
        selected ? "border-indigo-500" : "border-transparent"
      } relative group`}
      onClick={handleClick}
      draggable={!isPreviewMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Make controls visible on hover for better editing experience */}
      {!isPreviewMode && (
        <div 
          className={`absolute top-2 right-2 flex space-x-2 bg-white p-1 rounded shadow-sm z-10 
            ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
            transition-opacity duration-200`}
        >
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100" title="Drag to move">
            <Grip className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDuplicate} 
            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50" 
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" 
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}
      {renderElement(element)}
    </div>
  );
};

// Create a default export for backward compatibility
const BuilderElement: React.FC<BuilderElementProps> = (props) => <ElementWrapper {...props} />;
export default BuilderElement;
