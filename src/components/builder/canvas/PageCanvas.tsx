
import React, { useEffect } from "react";
import { useBuilder } from "@/contexts/builder/BuilderProvider";
import BuilderElement from "../BuilderElement";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import { v4 as uuidv4 } from "@/lib/uuid";

interface PageCanvasProps {
  isPreviewMode: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ isPreviewMode }) => {
  const { elements, selectedElementId, addElement, setElements } = useBuilder();

  // Effect to ensure every page has a header and footer
  useEffect(() => {
    // Only add default elements if the canvas is completely empty
    if (elements.length === 0) {
      // Create a complete page structure with header and footer when canvas is empty
      const defaultElements = [
        {
          id: uuidv4(),
          type: "navbar",
          content: "",
          props: {
            siteName: "Your Website",
            links: [
              { text: "Home", url: "#" },
              { text: "About", url: "#" },
              { text: "Services", url: "#" },
              { text: "Contact", url: "#" }
            ],
            variant: "default"
          }
        },
        {
          id: uuidv4(),
          type: "section",
          content: "",
          props: {
            padding: "large"
          },
          children: []
        },
        {
          id: uuidv4(),
          type: "footer",
          content: "",
          props: {
            siteName: "Your Website",
            links: [
              { text: "Home", url: "#" },
              { text: "About", url: "#" },
              { text: "Services", url: "#" },
              { text: "Contact", url: "#" }
            ],
            variant: "dark"
          }
        }
      ];

      setElements(defaultElements);
    } else {
      // Check if header and footer exist
      const hasNavbar = elements.some(el => el.type === "navbar");
      const hasFooter = elements.some(el => el.type === "footer");

      // Add navbar if missing
      if (!hasNavbar) {
        const navbarElement = {
          id: uuidv4(),
          type: "navbar",
          content: "",
          props: {
            siteName: "Your Website",
            links: [
              { text: "Home", url: "#" },
              { text: "About", url: "#" },
              { text: "Services", url: "#" },
              { text: "Contact", url: "#" }
            ],
            variant: "default"
          }
        };
        addElement(navbarElement, 0); // Add at the beginning
      }

      // Add footer if missing
      if (!hasFooter) {
        const footerElement = {
          id: uuidv4(),
          type: "footer",
          content: "",
          props: {
            siteName: "Your Website",
            links: [
              { text: "Home", url: "#" },
              { text: "About", url: "#" },
              { text: "Services", url: "#" },
              { text: "Contact", url: "#" }
            ],
            variant: "dark"
          }
        };
        addElement(footerElement); // Add at the end
      }
    }
  }, [elements.length]); // Only run when elements array length changes

  return (
    <div className="w-full h-full bg-white">
      {elements.length > 0 ? (
        <div className="page-content">
          {elements.map((element, index) => (
            <BuilderElement
              key={`${element.id}-${index}`} // Adding index to key to force re-render when switching pages
              element={element}
              index={index}
              selected={element.id === selectedElementId}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>
      ) : (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      )}
      
      {/* Add hover indicators for sections when not in preview mode */}
      {!isPreviewMode && elements.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="section-indicators"></div>
        </div>
      )}
    </div>
  );
};

export default PageCanvas;
