
import React, { useEffect, useRef, useState } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ScrollRevealElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const ScrollRevealElement: React.FC<ScrollRevealElementProps> = ({ element, isPreviewMode }) => {
  const { content, props } = element;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isPreviewMode) {
      // Always show in builder mode
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isPreviewMode]);
  
  return (
    <div 
      ref={elementRef} 
      className={`p-4 transition-all duration-700 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10"
      }`}
    >
      {content || props?.content || "Scroll to reveal this content"}
    </div>
  );
};

export default ScrollRevealElement;
