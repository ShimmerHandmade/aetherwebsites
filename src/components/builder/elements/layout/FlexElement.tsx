
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import CanvasDragDropHandler from "../../canvas/CanvasDragDropHandler";
import { ElementWrapper } from "../ElementWrapper";
import { useBuilder } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FlexElement: React.FC<ElementProps> = ({ element }) => {
  const { selectedElementId } = useBuilder();
  const direction = element.props?.direction === 'column' ? 'flex-col' : 'flex-row';
  const justify = element.props?.justify === 'between' ? 'justify-between' : 
                element.props?.justify === 'around' ? 'justify-around' :
                element.props?.justify === 'end' ? 'justify-end' : 'justify-center';
  const align = element.props?.align === 'start' ? 'items-start' :
              element.props?.align === 'end' ? 'items-end' :
              element.props?.align === 'stretch' ? 'items-stretch' : 'items-center';
  const wrap = element.props?.wrap ? 'flex-wrap' : 'flex-nowrap';
  const gap = element.props?.gap === 'large' ? 'gap-6' : 
              element.props?.gap === 'small' ? 'gap-2' : 'gap-4';
  
  return (
    <div className={`flex ${direction} ${justify} ${align} ${wrap} ${gap} p-4 border border-dashed border-gray-300 hover:border-blue-300 transition-colors rounded-md relative min-h-[100px]`}>
      <CanvasDragDropHandler
        isPreviewMode={false}
        onCanvasClick={(e) => e.stopPropagation()}
        className="min-h-[80px] w-full flex"
        containerId={element.id}
      >
        {element.children && element.children.length > 0 ? (
          <div className={`flex ${direction} ${wrap} ${gap} w-full`}>
            {element.children.map((child, index) => (
              <div key={child.id} className="flex-1 min-w-0 relative">
                <ElementWrapper 
                  element={child} 
                  index={index} 
                  selected={child.id === selectedElementId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 w-full">
            <div className="bg-gray-100 p-4 flex-1 rounded-md shadow-sm">
              <div className="aspect-video flex items-center justify-center text-gray-400">
                Flex Item 1
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex-1 rounded-md shadow-sm">
              <div className="aspect-video flex items-center justify-center text-gray-400">
                Flex Item 2
              </div>
            </div>
          </div>
        )}
      </CanvasDragDropHandler>
    </div>
  );
};

export default FlexElement;
