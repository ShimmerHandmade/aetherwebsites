
import React from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BreakpointType } from "@/contexts/builder/types";

const ResponsiveControls: React.FC = () => {
  const { currentBreakpoint, previewBreakpoint, setCurrentBreakpoint, setPreviewBreakpoint } = useBuilder();

  const breakpoints: Array<{ 
    type: BreakpointType; 
    icon: React.ComponentType<any>; 
    label: string;
    width: string;
  }> = [
    { type: 'mobile', icon: Smartphone, label: 'Mobile', width: 'max-w-sm' },
    { type: 'tablet', icon: Tablet, label: 'Tablet', width: 'max-w-md' },
    { type: 'desktop', icon: Monitor, label: 'Desktop', width: 'max-w-full' }
  ];

  return (
    <div className="flex items-center space-x-2 bg-white border rounded-lg p-1">
      <span className="text-sm text-gray-600 px-2">View:</span>
      {breakpoints.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant={previewBreakpoint === type ? "default" : "ghost"}
          size="sm"
          onClick={() => setPreviewBreakpoint(type)}
          className="flex items-center space-x-1"
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
      
      <div className="border-l pl-2 ml-2">
        <span className="text-sm text-gray-600 px-2">Edit:</span>
        {breakpoints.map(({ type, icon: Icon, label }) => (
          <Button
            key={`edit-${type}`}
            variant={currentBreakpoint === type ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCurrentBreakpoint(type)}
            className="flex items-center space-x-1"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveControls;
