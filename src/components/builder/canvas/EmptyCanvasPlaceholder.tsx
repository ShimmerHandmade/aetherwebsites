
import React from "react";

interface EmptyCanvasPlaceholderProps {
  isPreviewMode: boolean;
}

const EmptyCanvasPlaceholder: React.FC<EmptyCanvasPlaceholderProps> = ({ isPreviewMode }) => {
  if (isPreviewMode) {
    return null;
  }
  
  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-medium text-gray-700 mb-4">Drop Elements Here</h3>
      <p className="text-gray-500 mb-6 max-w-lg mx-auto">
        Drag elements from the sidebar into this area to start building your website.
      </p>
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
        Your canvas is empty. Drag elements here to build your page.
      </div>
    </div>
  );
};

export default EmptyCanvasPlaceholder;
