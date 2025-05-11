
import React from "react";
import { BookOpen, Layout } from "lucide-react";

interface EmptyCanvasPlaceholderProps {
  isPreviewMode: boolean;
}

const EmptyCanvasPlaceholder: React.FC<EmptyCanvasPlaceholderProps> = ({ isPreviewMode }) => {
  if (isPreviewMode) {
    return null;
  }
  
  return (
    <div className="text-center py-24 px-4">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Layout className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-2xl font-medium text-gray-700 mb-4">Build Your Page</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Drag sections and elements from the left sidebar to start building your page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
          <p className="font-medium text-gray-600 mb-2">Add a Section</p>
          <p className="text-sm text-gray-500">Sections like Hero, Features, Pricing</p>
        </div>
        <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
          <p className="font-medium text-gray-600 mb-2">Add Elements</p>
          <p className="text-sm text-gray-500">Individual elements like text, images, buttons</p>
        </div>
      </div>
      <div className="mt-8 text-sm flex items-center justify-center text-indigo-600">
        <BookOpen className="h-4 w-4 mr-1" />
        <span>Learn how to build pages</span>
      </div>
    </div>
  );
};

export default EmptyCanvasPlaceholder;
