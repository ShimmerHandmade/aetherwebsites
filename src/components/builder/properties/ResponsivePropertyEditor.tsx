
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement, BreakpointType } from "@/contexts/builder/types";

interface ResponsivePropertyEditorProps {
  element: BuilderElement;
}

const ResponsivePropertyEditor: React.FC<ResponsivePropertyEditorProps> = ({ element }) => {
  const { currentBreakpoint, updateElementResponsive } = useBuilder();
  
  const responsiveSettings = element.responsiveSettings?.[currentBreakpoint] || {};

  const handleResponsiveUpdate = (property: string, value: any) => {
    updateElementResponsive(element.id, currentBreakpoint, {
      ...responsiveSettings,
      [property]: value
    });
  };

  const handleToggleVisibility = (hidden: boolean) => {
    handleResponsiveUpdate('hidden', hidden);
  };

  const handleOrderChange = (order: string) => {
    const orderNum = parseInt(order) || 0;
    handleResponsiveUpdate('order', orderNum);
  };

  const handleClassNameChange = (className: string) => {
    handleResponsiveUpdate('className', className);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">
          {currentBreakpoint.charAt(0).toUpperCase() + currentBreakpoint.slice(1)} Settings
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Reset responsive settings for current breakpoint
            updateElementResponsive(element.id, currentBreakpoint, {});
          }}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="visibility" className="text-sm">
            Hide on {currentBreakpoint}
          </Label>
          <Switch
            id="visibility"
            checked={responsiveSettings.hidden || false}
            onCheckedChange={handleToggleVisibility}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order" className="text-sm">
            Display Order
          </Label>
          <Input
            id="order"
            type="number"
            value={responsiveSettings.order || 0}
            onChange={(e) => handleOrderChange(e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsive-class" className="text-sm">
            Custom CSS Classes
          </Label>
          <Input
            id="responsive-class"
            value={responsiveSettings.className || ''}
            onChange={(e) => handleClassNameChange(e.target.value)}
            placeholder="e.g., hidden md:block lg:flex"
            className="w-full"
          />
        </div>

        {currentBreakpoint === 'mobile' && (
          <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
            Mobile-first: Changes here affect mobile and up unless overridden.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsivePropertyEditor;
