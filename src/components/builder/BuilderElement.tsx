
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";
import { Move, Grip } from "lucide-react";

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
      case "button":
        return (
          <div className="p-4">
            <button className={`px-4 py-2 ${element.props?.variant === 'primary' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} rounded hover:opacity-90`}>
              {element.content || "Button"}
            </button>
          </div>
        );
      case "feature":
        return (
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <span>{element.props?.icon || "★"}</span>
              </div>
              <h3 className="font-medium text-lg mb-2">{element.content}</h3>
              <p className="text-gray-500">{element.props?.description || "Feature description"}</p>
            </div>
          </div>
        );
      case "testimonial":
        return (
          <div className="p-6 border rounded-lg bg-gray-50">
            <p className="text-gray-700 mb-4 italic">"{element.content}"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">{element.props?.author || "Anonymous"}</p>
                <p className="text-sm text-gray-500">{element.props?.role || "Customer"}</p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-medium mb-4">{element.content}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your name" disabled={isPreviewMode} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Your email" disabled={isPreviewMode} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full px-3 py-2 border rounded" rows={4} placeholder="Your message" disabled={isPreviewMode}></textarea>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
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
      draggable={!isPreviewMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {selected && !isPreviewMode && (
        <div className="absolute top-2 right-2 flex space-x-2 bg-white p-1 rounded shadow-sm z-10">
          <button className="text-gray-500 hover:text-gray-700" title="Drag to move">
            <Grip className="h-4 w-4" />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700" title="Delete">
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
