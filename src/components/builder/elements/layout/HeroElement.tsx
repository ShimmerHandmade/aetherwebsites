
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { cn } from "@/lib/utils";

interface ElementProps {
  element: BuilderElement;
}

const HeroElement: React.FC<ElementProps> = ({ element }) => {
  // Extract properties with defaults
  const title = element.props?.title || element.content || "Hero Title";
  const subtitle = element.props?.subtitle || "This is a hero section. Click to edit.";
  const buttonText = element.props?.buttonText || "Call to Action";
  const buttonLink = element.props?.buttonLink || "#";
  const buttonVariant = element.props?.buttonVariant || "primary";
  const alignment = element.props?.alignment || "center";
  const background = element.props?.background || "indigo-50";
  const imageUrl = element.props?.imageUrl;
  const overlay = element.props?.overlay || false;
  const height = element.props?.height || "medium";
  
  // Text color properties with defaults
  const titleColor = element.props?.titleColor || "default";
  const customTitleColor = element.props?.customTitleColor;
  const subtitleColor = element.props?.subtitleColor || "default";
  const customSubtitleColor = element.props?.customSubtitleColor;
  
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
  
  // Title color classes
  const titleColorClass = cn({
    "text-gray-900": titleColor === "default" && !customTitleColor,
    "text-primary": titleColor === "primary" && !customTitleColor,
    "text-secondary": titleColor === "secondary" && !customTitleColor,
    "text-gray-600": titleColor === "muted" && !customTitleColor,
    "text-black": titleColor === "black" && !customTitleColor,
    "text-white": titleColor === "white" && !customTitleColor,
    "text-red-500": titleColor === "red" && !customTitleColor,
    "text-blue-500": titleColor === "blue" && !customTitleColor,
    "text-green-500": titleColor === "green" && !customTitleColor,
    "text-yellow-500": titleColor === "yellow" && !customTitleColor,
    "text-purple-500": titleColor === "purple" && !customTitleColor,
    "text-pink-500": titleColor === "pink" && !customTitleColor,
  });
  
  // Subtitle color classes
  const subtitleColorClass = cn({
    "text-gray-600": subtitleColor === "default" && !customSubtitleColor,
    "text-primary": subtitleColor === "primary" && !customSubtitleColor,
    "text-secondary": subtitleColor === "secondary" && !customSubtitleColor,
    "text-gray-500": subtitleColor === "muted" && !customSubtitleColor,
    "text-black": subtitleColor === "black" && !customSubtitleColor,
    "text-white": subtitleColor === "white" && !customSubtitleColor,
    "text-red-500": subtitleColor === "red" && !customSubtitleColor,
    "text-blue-500": subtitleColor === "blue" && !customSubtitleColor,
    "text-green-500": subtitleColor === "green" && !customSubtitleColor,
    "text-yellow-500": subtitleColor === "yellow" && !customSubtitleColor,
    "text-purple-500": subtitleColor === "purple" && !customSubtitleColor,
    "text-pink-500": subtitleColor === "pink" && !customSubtitleColor,
  });
  
  // Custom color styles
  const titleStyle = customTitleColor ? { color: customTitleColor } : {};
  const subtitleStyle = customSubtitleColor ? { color: customSubtitleColor } : {};

  return (
    <div 
      className={`px-4 ${bgClass} ${textAlign} ${heightClass} relative`} 
      style={backgroundStyle}
    >
      {imageUrl && overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}
      
      <div className="relative z-10 container mx-auto">
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-4 ${titleColorClass}`} 
          style={titleStyle}
        >
          {title}
        </h1>
        <p 
          className={`text-xl mb-6 ${subtitleColorClass}`} 
          style={subtitleStyle}
        >
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
