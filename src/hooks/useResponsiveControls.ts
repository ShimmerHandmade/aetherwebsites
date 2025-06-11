
import { useCallback } from "react";
import { useBuilder } from "@/contexts/BuilderContext";

export const useResponsiveControls = () => {
  const { previewBreakpoint, setPreviewBreakpoint } = useBuilder();

  const breakpoints = [
    { type: 'mobile', icon: 'Smartphone', label: 'Mobile', width: '375px' },
    { type: 'tablet', icon: 'Tablet', label: 'Tablet', width: '768px' },
    { type: 'desktop', icon: 'Monitor', label: 'Desktop', width: '100%' }
  ];

  const handleBreakpointChange = useCallback((breakpoint: string) => {
    console.log("📱 Breakpoint changed to:", breakpoint);
    setPreviewBreakpoint(breakpoint as any);
    
    const previewElement = document.querySelector('[data-builder-canvas]') || 
                          document.querySelector('.builder-canvas') ||
                          document.querySelector('.main-content');
                          
    if (previewElement) {
      previewElement.classList.remove('preview-mobile', 'preview-tablet', 'preview-desktop');
      
      const element = previewElement as HTMLElement;
      element.classList.add(`preview-${breakpoint}`);
      
      switch (breakpoint) {
        case 'mobile':
          element.style.maxWidth = '375px';
          element.style.margin = '0 auto';
          break;
        case 'tablet':
          element.style.maxWidth = '768px';
          element.style.margin = '0 auto';
          break;
        case 'desktop':
          element.style.maxWidth = '100%';
          element.style.margin = '0';
          break;
      }
      
      console.log("✅ Applied responsive styles to preview");
    } else {
      console.warn("❌ Preview element not found for responsive styling");
    }
  }, [setPreviewBreakpoint]);

  return {
    previewBreakpoint,
    breakpoints,
    handleBreakpointChange
  };
};
