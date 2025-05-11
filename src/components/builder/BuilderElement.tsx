
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";

interface BuilderElementProps {
  element: ElementType;
  index: number;
  selected: boolean;
  isPreviewMode?: boolean;
}

const BuilderElement: React.FC<BuilderElementProps> = ({ 
  element, 
  index, 
  selected,
  isPreviewMode = false
}) => {
  const { selectElement, removeElement } = useBuilder();

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const renderElement = () => {
    switch (element.type) {
      case "header":
        return (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-medium">{element.content || "Header"}</h2>
          </div>
        );
      case "hero":
        return (
          <div className="py-12 px-4 bg-indigo-50 text-center">
            <h1 className="text-3xl font-bold mb-4">{element.content || "Hero Title"}</h1>
            <p className="text-gray-600 mb-6">This is a hero section. Click to edit.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              Call to Action
            </button>
          </div>
        );
      case "text":
        return (
          <div className="p-4">
            <p>{element.content || "Text block. Click to edit."}</p>
          </div>
        );
      case "image":
        return (
          <div className="p-4">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              {element.props?.src ? (
                <img src={element.props.src} alt={element.props.alt || ""} className="max-h-full" />
              ) : (
                <span className="text-gray-500">Image placeholder</span>
              )}
            </div>
          </div>
        );
      default:
        return <div className="p-4">Unknown element type: {element.type}</div>;
    }
  };

  return (
    <div
      className={`mb-4 ${isPreviewMode ? '' : 'border-2 rounded'} ${
        selected ? "border-indigo-500" : "border-transparent"
      } relative`}
      onClick={handleClick}
    >
      {selected && !isPreviewMode && (
        <div className="absolute top-2 right-2 flex space-x-2 bg-white p-1 rounded shadow-sm">
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
      {renderElement()}
    </div>
  );
};

export default BuilderElement;
