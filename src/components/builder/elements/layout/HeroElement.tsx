
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const HeroElement: React.FC<ElementProps> = ({ element }) => {
  // Extract properties with defaults
  const title = element.content || "Hero Title";
  const subtitle = element.props?.subtitle || "This is a hero section. Click to edit.";
  const buttonText = element.props?.buttonText || "Call to Action";
  const buttonVariant = element.props?.buttonVariant || "primary";
  const alignment = element.props?.alignment || "center";
  const background = element.props?.background || "indigo-50";
  
  // Generate dynamic classes based on properties
  const bgClass = background === 'dark' ? 'bg-gray-800 text-white' : 
                 background === 'light' ? 'bg-gray-50' : 
                 background === 'transparent' ? 'bg-transparent' : `bg-${background}`;
  
  const textAlign = alignment === 'left' ? 'text-left' : 
                   alignment === 'right' ? 'text-right' : 'text-center';
                   
  const buttonClass = buttonVariant === 'primary' ? 'bg-indigo-600 text-white' : 
                     buttonVariant === 'secondary' ? 'bg-white text-indigo-600 border border-indigo-600' : 
                     buttonVariant === 'dark' ? 'bg-gray-800 text-white' : 
                     'bg-indigo-600 text-white';

  return (
    <div className={`py-12 px-4 ${bgClass} ${textAlign}`}>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className={`${background === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{subtitle}</p>
      <button className={`px-4 py-2 ${buttonClass} rounded`}>
        {buttonText}
      </button>
    </div>
  );
};

export default HeroElement;
