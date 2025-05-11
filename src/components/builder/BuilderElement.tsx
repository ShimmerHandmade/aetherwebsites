
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
    // Layout Elements
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
      case "grid":
        const columns = element.props?.columns || 2;
        const gap = element.props?.gap === 'large' ? '4' : element.props?.gap === 'small' ? '2' : '3';
        return (
          <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap} p-4`}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={i} className="border border-dashed border-gray-300 p-4 text-center">
                Grid item {i + 1}
              </div>
            ))}
          </div>
        );
      case "flex":
        const direction = element.props?.direction === 'column' ? 'flex-col' : 'flex-row';
        const justify = element.props?.justify === 'between' ? 'justify-between' : 
                       element.props?.justify === 'around' ? 'justify-around' :
                       element.props?.justify === 'end' ? 'justify-end' : 'justify-center';
        const align = element.props?.align === 'start' ? 'items-start' :
                    element.props?.align === 'end' ? 'items-end' :
                    element.props?.align === 'stretch' ? 'items-stretch' : 'items-center';
        return (
          <div className={`flex ${direction} ${justify} ${align} p-4 border border-dashed border-gray-300`}>
            <div className="bg-gray-100 p-4 m-2">Flex Item 1</div>
            <div className="bg-gray-100 p-4 m-2">Flex Item 2</div>
          </div>
        );
      case "spacer":
        const height = element.props?.height === 'small' ? '4' : 
                      element.props?.height === 'large' ? '16' : '8';
        return <div className={`h-${height} w-full`}></div>;
      case "divider":
        const color = element.props?.color === 'dark' ? 'border-gray-700' : 
                     element.props?.color === 'light' ? 'border-gray-100' : 'border-gray-300';
        return <div className={`border-t ${color} my-4 w-full`}></div>;
      
      // Content Elements
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
      case "list":
        const listType = element.props?.type === 'numbered' ? 'ol' : 'ul';
        const ListTag = listType as keyof JSX.IntrinsicElements;
        return (
          <div className="p-4">
            <ListTag className={listType === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside'}>
              {(element.props?.items || ["Item 1", "Item 2"]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          </div>
        );
      case "icon":
        const iconSize = element.props?.size === 'small' ? 'h-4 w-4' : 
                       element.props?.size === 'large' ? 'h-8 w-8' : 'h-6 w-6';
        const iconColor = element.props?.color === 'indigo' ? 'text-indigo-600' :
                        element.props?.color === 'gray' ? 'text-gray-600' : 'text-current';
        return (
          <div className="p-4 flex justify-center">
            <div className={`${iconSize} ${iconColor}`}>★</div>
          </div>
        );
        
      // Interactive Elements
      case "form":
        return (
          <div className="p-4 border rounded">
            <h3 className="text-lg font-medium mb-4">{element.content || "Form"}</h3>
            <div className="space-y-4">
              {(element.props?.fields || ['name', 'email']).includes('name') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your name" disabled={isPreviewMode} />
                </div>
              )}
              {(element.props?.fields || ['name', 'email']).includes('email') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Your email" disabled={isPreviewMode} />
                </div>
              )}
              {(element.props?.fields || ['name', 'email']).includes('message') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea className="w-full px-3 py-2 border rounded" rows={3} placeholder="Your message" disabled={isPreviewMode}></textarea>
                </div>
              )}
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
            </div>
          </div>
        );
      case "input":
        return (
          <div className="p-4">
            <input 
              type={element.props?.type || "text"} 
              placeholder={element.props?.placeholder || "Enter text..."} 
              className="w-full px-3 py-2 border rounded"
              disabled={isPreviewMode}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="p-4">
            <textarea 
              placeholder={element.props?.placeholder || "Enter text..."} 
              rows={element.props?.rows || 3}
              className="w-full px-3 py-2 border rounded"
              disabled={isPreviewMode}
            ></textarea>
          </div>
        );
      case "checkbox":
        return (
          <div className="p-4 flex items-center">
            <input type="checkbox" className="mr-2" disabled={isPreviewMode} />
            <span>{element.content || "Checkbox label"}</span>
          </div>
        );
      case "select":
        return (
          <div className="p-4">
            <select className="w-full px-3 py-2 border rounded" disabled={isPreviewMode}>
              <option value="">Select an option</option>
              {(element.props?.options || ["Option 1", "Option 2"]).map((option: string, i: number) => (
                <option key={i} value={option.toLowerCase().replace(/\s+/g, '-')}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      // Complex Elements
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
      case "cta":
        return (
          <div className="p-8 bg-indigo-50 text-center rounded-lg">
            <h3 className="text-2xl font-bold mb-4">{element.content || "Call to Action"}</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">Take the next step and join thousands of satisfied customers today.</p>
            <button className={`px-6 py-3 rounded-lg text-white ${
              element.props?.buttonVariant === 'secondary' ? 'bg-gray-600' : 'bg-indigo-600'
            }`}>
              {element.props?.buttonText || "Get Started"}
            </button>
          </div>
        );
      case "card":
        return (
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-3">{element.content || "Card Title"}</h3>
            <p className="text-gray-600">{element.props?.description || "Card description goes here."}</p>
            {element.props?.showButton && (
              <button className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded">Learn More</button>
            )}
          </div>
        );
      case "faq":
        return (
          <div className="p-4 border rounded mb-2">
            <h3 className="font-medium mb-2">{element.content || "Frequently Asked Question"}</h3>
            <p className="text-gray-600">{element.props?.answer || "Answer to the question goes here."}</p>
          </div>
        );
      
      // Media Elements
      case "video":
        return (
          <div className="p-4">
            {element.props?.src ? (
              <video 
                src={element.props.src} 
                poster={element.props.poster}
                controls
                autoPlay={element.props.autoplay}
                className="w-full max-h-96"
              ></video>
            ) : (
              <div className="bg-gray-200 aspect-video flex items-center justify-center">
                <span className="text-gray-500">Video placeholder</span>
              </div>
            )}
          </div>
        );
      case "audio":
        return (
          <div className="p-4">
            {element.props?.src ? (
              <audio 
                src={element.props.src} 
                controls={element.props.controls !== false}
                className="w-full"
              ></audio>
            ) : (
              <div className="bg-gray-200 p-4 flex items-center justify-center">
                <span className="text-gray-500">Audio player placeholder</span>
              </div>
            )}
          </div>
        );
      case "carousel":
        return (
          <div className="p-4">
            <div className="bg-gray-200 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 mb-2">Image Carousel placeholder</div>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 aspect-square flex items-center justify-center">
                  <span className="text-gray-500">Image {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      // Navigation Elements
      case "navbar":
        return (
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <div className="font-bold">Logo</div>
            <nav>
              <ul className="flex space-x-4">
                {(element.props?.links || [{ text: "Home", url: "#" }, { text: "About", url: "#" }])
                  .map((link: { text: string, url: string }, i: number) => (
                  <li key={i}>
                    <a href={link.url} className="hover:text-indigo-600">{link.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        );
      case "menu":
        return (
          <div className="p-4">
            <ul className="space-y-2">
              {(element.props?.items || [{ text: "Item 1", url: "#" }, { text: "Item 2", url: "#" }])
                .map((item: { text: string, url: string }, i: number) => (
                <li key={i}>
                  <a href={item.url} className="block p-2 hover:bg-gray-100 rounded">{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        );
      case "footer":
        return (
          <div className="p-6 bg-gray-800 text-gray-200">
            <div className="text-center">
              <h3 className="mb-4">{element.content || "Website Footer"}</h3>
              <p className="text-sm">© 2025 Your Company. All rights reserved.</p>
            </div>
          </div>
        );
      case "breadcrumbs":
        return (
          <div className="p-4">
            <nav className="text-sm">
              <ol className="flex">
                {(element.props?.items || [{ text: "Home", url: "#" }, { text: "Section", url: "#" }])
                  .map((item: { text: string, url: string }, i: number, arr: any[]) => (
                  <li key={i} className="flex items-center">
                    <a href={item.url} className="hover:text-indigo-600">{item.text}</a>
                    {i < arr.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
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
