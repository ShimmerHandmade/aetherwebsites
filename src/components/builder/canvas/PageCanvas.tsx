
import React, { useEffect } from "react";
import { useBuilder } from "@/contexts/builder/BuilderProvider";
import BuilderElement from "../BuilderElement";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import { v4 as uuidv4 } from "@/lib/uuid";
import { hasRequiredStructure, ensureElementsOrder } from "@/contexts/builder/pageStructureUtils";

export interface PageCanvasProps {
  isPreviewMode: boolean;
  canUseAnimations?: boolean;
  canUseEnterpriseAnimations?: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ 
  isPreviewMode, 
  canUseAnimations = false, 
  canUseEnterpriseAnimations = false 
}) => {
  const { elements, selectedElementId, setElements } = useBuilder();

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
      return;
    }

    // Check if we need to add header/footer and ensure proper order
    const { hasHeader, hasFooter } = hasRequiredStructure(elements);
    
    // Only update the elements if we need to add header/footer
    if (!hasHeader || !hasFooter) {
      // Create a new array with the elements we need to add
      let updatedElements = [...elements];
      
      // Add navbar if missing
      if (!hasHeader) {
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
        updatedElements.push(navbarElement);
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
        updatedElements.push(footerElement);
      }
      
      // Order the elements properly
      updatedElements = ensureElementsOrder(updatedElements);
      
      // Update the elements in the builder context
      setElements(updatedElements);
    }
  }, []); // Only run once on component mount

  return (
    <div className="w-full h-full bg-white overflow-auto">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {elements.length > 0 ? (
          <div className="page-content">
            {elements.map((element, index) => (
              <BuilderElement
                key={`${element.id}-${index}`} // Adding index to key to force re-render when switching pages
                element={element}
                index={index}
                selected={element.id === selectedElementId}
                isPreviewMode={isPreviewMode}
                canUseAnimations={canUseAnimations}
                canUseEnterpriseAnimations={canUseEnterpriseAnimations}
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
    </div>
  );
};

export default PageCanvas;
