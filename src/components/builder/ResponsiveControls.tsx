
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Tablet, Smartphone } from "lucide-react";

const ResponsiveControls = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const breakpoints = [
    { id: 'desktop' as const, label: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'tablet' as const, label: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'mobile' as const, label: 'Mobile', icon: Smartphone, width: '375px' }
  ];

  const handleBreakpointChange = (breakpoint: 'desktop' | 'tablet' | 'mobile') => {
    setCurrentBreakpoint(breakpoint);
    
    // Apply breakpoint to preview iframe or canvas
    const canvas = document.querySelector('[data-testid="builder-canvas"]') as HTMLElement;
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    
    const targetElement = canvas || iframe;
    
    if (targetElement) {
      const breakpointConfig = breakpoints.find(bp => bp.id === breakpoint);
      if (breakpointConfig) {
        if (breakpoint === 'desktop') {
          targetElement.style.width = '100%';
          targetElement.style.maxWidth = 'none';
        } else {
          targetElement.style.width = breakpointConfig.width;
          targetElement.style.maxWidth = breakpointConfig.width;
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
      <span className="text-xs font-medium text-gray-600">Preview:</span>
      <div className="flex items-center gap-1">
        {breakpoints.map((breakpoint) => {
          const Icon = breakpoint.icon;
          const isActive = currentBreakpoint === breakpoint.id;
          
          return (
            <Button
              key={breakpoint.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleBreakpointChange(breakpoint.id)}
              className="h-8 px-2 gap-1"
            >
              <Icon className="h-3 w-3" />
              <span className="text-xs">{breakpoint.label}</span>
            </Button>
          );
        })}
      </div>
      <Badge variant="outline" className="text-xs">
        {breakpoints.find(bp => bp.id === currentBreakpoint)?.width}
      </Badge>
    </div>
  );
};

export default ResponsiveControls;
