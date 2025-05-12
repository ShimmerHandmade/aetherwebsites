
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const TestimonialElement: React.FC<ElementProps> = ({ element }) => {
  const quote = element.props?.quote || "This product has transformed our business completely!";
  const author = element.props?.author || "Jane Doe";
  const role = element.props?.role || "CEO, Example Inc.";
  const avatar = element.props?.avatar || "/placeholder.svg";
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-gray-500 text-3xl mb-4">"</div>
      <p className="text-gray-700 mb-6">{quote}</p>
      <div className="flex items-center">
        <img 
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full mr-4 object-cover"
          onError={(e) => {
            // Fallback if image doesn't load
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialElement;
