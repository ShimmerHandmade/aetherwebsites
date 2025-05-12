
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const CardElement: React.FC<ElementProps> = ({ element }) => {
  const title = element.props?.title || "Card Title";
  const description = element.props?.description || "This is a card description with sample content.";
  const image = element.props?.image || "/placeholder.svg";
  const link = element.props?.link || "#";
  const metadata = element.props?.metadata || "";
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image doesn't load
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-6">
        {metadata && <p className="text-sm text-gray-500 mb-2">{metadata}</p>}
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={link}
          className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center"
        >
          Read More
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CardElement;
