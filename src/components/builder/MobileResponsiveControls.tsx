
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BreakpointType } from "@/contexts/builder/types";

const MobileResponsiveControls = () => {
  const { currentBreakpoint, setCurrentBreakpoint, previewBreakpoint, setPreviewBreakpoint } = useBuilder();

  const breakpoints = [
    { id: 'mobile' as BreakpointType, label: 'Mobile', icon: Smartphone, width: '375px' },
    { id: 'tablet' as BreakpointType, label: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'desktop' as BreakpointType, label: 'Desktop', icon: Monitor, width: '1200px' },
  ];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Responsive Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Editing Breakpoint */}
        <div>
          <label className="text-sm font-medium mb-2 block">Editing for:</label>
          <div className="grid grid-cols-3 gap-2">
            {breakpoints.map((bp) => {
              const Icon = bp.icon;
              return (
                <Button
                  key={bp.id}
                  variant={currentBreakpoint === bp.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentBreakpoint(bp.id)}
                  className="flex flex-col items-center gap-1 h-16 text-xs"
                >
                  <Icon className="h-4 w-4" />
                  <span>{bp.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Preview Breakpoint */}
        <div>
          <label className="text-sm font-medium mb-2 block">Preview as:</label>
          <div className="grid grid-cols-3 gap-2">
            {breakpoints.map((bp) => {
              const Icon = bp.icon;
              return (
                <Button
                  key={`preview-${bp.id}`}
                  variant={previewBreakpoint === bp.id ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setPreviewBreakpoint(bp.id)}
                  className="flex flex-col items-center gap-1 h-16 text-xs"
                >
                  <Icon className="h-4 w-4" />
                  <span>{bp.label}</span>
                  <span className="text-xs opacity-60">{bp.width}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {currentBreakpoint !== 'desktop' && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            💡 Changes here will apply to {currentBreakpoint} and larger screens unless overridden.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileResponsiveControls;
