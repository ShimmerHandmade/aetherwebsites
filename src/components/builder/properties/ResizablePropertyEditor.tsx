
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { BuilderElement } from '@/contexts/builder/types';

interface ResizablePropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
}

const ResizablePropertyEditor: React.FC<ResizablePropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const width = element.props?.width || '';
  const height = element.props?.height || '';
  const maintainAspectRatio = element.props?.maintainAspectRatio || false;

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    onPropertyChange('width', value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    onPropertyChange('height', value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Size & Dimensions</h3>
      
      <div className="flex items-center gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="width">Width</Label>
          <div className="relative">
            <Input
              id="width"
              type="number"
              min={50}
              value={width}
              onChange={handleWidthChange}
              placeholder="Auto"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">px</span>
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <Label htmlFor="height">Height</Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              min={50}
              value={height}
              onChange={handleHeightChange}
              placeholder="Auto"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">px</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="aspect-ratio"
          checked={maintainAspectRatio}
          onCheckedChange={(checked) => onPropertyChange('maintainAspectRatio', checked)}
        />
        <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
      </div>
    </div>
  );
};

export default ResizablePropertyEditor;
