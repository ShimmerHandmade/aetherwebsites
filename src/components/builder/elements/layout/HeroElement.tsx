
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
  const buttonLink = element.props?.buttonLink || "#";
  const buttonVariant = element.props?.buttonVariant || "primary";
  const alignment = element.props?.alignment || "center";
  const background = element.props?.background || "indigo-50";
  const imageUrl = element.props?.imageUrl;
  const overlay = element.props?.overlay || false;
  const height = element.props?.height || "medium";
  
  // Generate dynamic classes based on properties
  const bgClass = background === 'dark' ? 'bg-gray-800 text-white' : 
                 background === 'light' ? 'bg-gray-50' : 
                 background === 'transparent' ? 'bg-transparent' : `bg-${background}`;
  
  const textAlign = alignment === 'left' ? 'text-left' : 
                   alignment === 'right' ? 'text-right' : 'text-center';
                   
  const buttonClass = buttonVariant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 
                     buttonVariant === 'secondary' ? 'bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50' : 
                     buttonVariant === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-900' : 
                     'bg-indigo-600 text-white hover:bg-indigo-700';
                     
  const heightClass = height === 'small' ? 'py-8' :
                     height === 'medium' ? 'py-16' :
                     height === 'large' ? 'py-24' : 'py-16';

  // Background with image support
  const backgroundStyle = imageUrl ? {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <div 
      className={`px-4 ${bgClass} ${textAlign} ${heightClass} relative`} 
      style={backgroundStyle}
    >
      {imageUrl && overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      
      <div className="relative z-10 container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className={`text-xl mb-6 ${background === 'dark' || overlay ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
        <a 
          href={buttonLink || "#"} 
          className={`inline-block px-6 py-3 ${buttonClass} rounded-md transition duration-200`}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default HeroElement;
