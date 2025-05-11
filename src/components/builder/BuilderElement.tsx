
import React from "react";
import { useBuilder, BuilderElement as ElementType } from "@/contexts/BuilderContext";
import { Move, Grip, Trash, Copy } from "lucide-react";

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
      case "container":
        return (
          <div className={`p-${element.props?.padding === 'large' ? '8' : element.props?.padding === 'medium' ? '4' : '2'} ${
            element.props?.background === 'gray' ? 'bg-gray-50' : 
            element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
          } border border-dashed border-gray-300`}>
            {element.content || "Container - Add elements inside"}
          </div>
        );
      case "section":
        return (
          <div className={`py-12 px-4 ${
            element.props?.background === 'gray' ? 'bg-gray-50' : 
            element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
          }`}>
            <h2 className="text-2xl font-bold mb-6 text-center">{element.content || "Section Title"}</h2>
            <div className="border border-dashed border-gray-300 p-4 text-center">
              Section content area
            </div>
          </div>
        );
      case "text":
        return (
          <div className="p-4">
            <p>{element.content || "Text block. Click to edit."}</p>
          </div>
        );
      case "heading":
        const HeadingTag = (element.props?.level || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <div className="p-4">
            <HeadingTag className={
              HeadingTag === 'h1' ? 'text-3xl font-bold' :
              HeadingTag === 'h2' ? 'text-2xl font-bold' :
              HeadingTag === 'h3' ? 'text-xl font-bold' :
              HeadingTag === 'h4' ? 'text-lg font-bold' :
              'text-base font-bold'
            }>
              {element.content || `${HeadingTag.toUpperCase()} Heading`}
            </HeadingTag>
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
        const buttonVariant = element.props?.variant || 'primary';
        return (
          <div className="p-4">
            <button className={`px-4 py-2 rounded hover:opacity-90 ${
              buttonVariant === 'primary' ? 'bg-indigo-600 text-white' : 
              buttonVariant === 'secondary' ? 'bg-gray-200 text-gray-800' :
              buttonVariant === 'outline' ? 'border border-indigo-600 text-indigo-600' :
              'bg-indigo-600 text-white'
            }`}>
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
      case "pricing":
        return (
          <div className="p-6 border rounded-lg shadow-sm">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">{element.content || "Basic Plan"}</h3>
              <div className="text-3xl font-bold mb-2">{element.props?.price || "$9.99"}</div>
              <p className="text-sm text-gray-500 mb-4">{element.props?.period === 'yearly' ? 'per year' : 'per month'}</p>
              <ul className="mb-6 text-left space-y-2">
                {(element.props?.features || ["Feature 1", "Feature 2"]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Select Plan</button>
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
          <button 
            onClick={handleDuplicate} 
            className="text-blue-500 hover:text-blue-700" 
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-700" 
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}
      {renderElement()}
    </div>
  );
};

export default BuilderElement;
