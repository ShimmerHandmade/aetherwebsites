
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VideoPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input
          value={properties.src || ""}
          onChange={(e) => onPropertyChange("src", e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Poster Image URL</Label>
        <Input
          value={properties.poster || ""}
          onChange={(e) => onPropertyChange("poster", e.target.value)}
          placeholder="https://example.com/poster.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select 
          value={properties.aspectRatio || "16/9"}
          onValueChange={(value) => onPropertyChange("aspectRatio", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
            <SelectItem value="4/3">4:3 (Standard)</SelectItem>
            <SelectItem value="1/1">1:1 (Square)</SelectItem>
            <SelectItem value="21/9">21:9 (Ultrawide)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="controls" 
          checked={properties.controls !== false} 
          onCheckedChange={(checked) => onPropertyChange("controls", checked)}
        />
        <Label htmlFor="controls">Show Controls</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="autoplay" 
          checked={properties.autoplay || false} 
          onCheckedChange={(checked) => onPropertyChange("autoplay", checked)}
        />
        <Label htmlFor="autoplay">Autoplay</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="muted" 
          checked={properties.muted || false} 
          onCheckedChange={(checked) => onPropertyChange("muted", checked)}
        />
        <Label htmlFor="muted">Muted</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="loop" 
          checked={properties.loop || false} 
          onCheckedChange={(checked) => onPropertyChange("loop", checked)}
        />
        <Label htmlFor="loop">Loop</Label>
      </div>
    </div>
  );
};

export default VideoPropertyEditor;
