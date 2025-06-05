
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
    <div className="flex flex-col space-y-3 bg-white border rounded-lg p-3">
      {/* Preview Controls */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">Preview:</span>
        <div className="flex space-x-1">
          {breakpoints.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={previewBreakpoint === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewBreakpoint(type)}
              className="flex items-center space-x-1 h-8 px-2"
              title={`Preview in ${label} mode`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Edit Controls */}
      <div className="flex items-center space-x-2 border-t pt-3">
        <span className="text-sm text-gray-600 font-medium">Edit:</span>
        <div className="flex space-x-1">
          {breakpoints.map(({ type, icon: Icon, label }) => (
            <Button
              key={`edit-${type}`}
              variant={currentBreakpoint === type ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentBreakpoint(type)}
              className="flex items-center space-x-1 h-8 px-2"
              title={`Edit ${label} styles`}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Current State Info */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
        <div>Viewing: <span className="font-medium capitalize">{previewBreakpoint}</span></div>
        <div>Editing: <span className="font-medium capitalize">{currentBreakpoint}</span></div>
      </div>
    </div>
  );
};

export default ResponsiveControls;
