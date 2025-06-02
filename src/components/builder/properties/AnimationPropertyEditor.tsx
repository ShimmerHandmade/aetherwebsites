
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

const AnimationPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-purple-100 text-purple-800">
          <Crown className="h-3 w-3 mr-1" />
          Enterprise Feature
        </Badge>
      </div>
      
      <div className="space-y-2">
        <Label>Animation Type</Label>
        <Select 
          value={properties.animationType || "fade"}
          onValueChange={(value) => onPropertyChange("animationType", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade">Fade In</SelectItem>
            <SelectItem value="slide">Slide In</SelectItem>
            <SelectItem value="scale">Scale In</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
            <SelectItem value="rotate">Rotate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {properties.animationType === "slide" && (
        <div className="space-y-2">
          <Label>Slide Direction</Label>
          <Select 
            value={properties.direction || "left"}
            onValueChange={(value) => onPropertyChange("direction", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">From Left</SelectItem>
              <SelectItem value="right">From Right</SelectItem>
              <SelectItem value="top">From Top</SelectItem>
              <SelectItem value="bottom">From Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Duration (seconds)</Label>
        <Input
          type="number"
          value={parseFloat(properties.duration?.replace('s', '') || '0.5')}
          onChange={(e) => onPropertyChange("duration", `${e.target.value}s`)}
          min={0.1}
          max={5}
          step={0.1}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Delay (seconds)</Label>
        <Input
          type="number"
          value={parseFloat(properties.delay?.replace('s', '') || '0')}
          onChange={(e) => onPropertyChange("delay", `${e.target.value}s`)}
          min={0}
          max={5}
          step={0.1}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Trigger</Label>
        <Select 
          value={properties.trigger || "scroll"}
          onValueChange={(value) => onPropertyChange("trigger", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scroll">On Scroll</SelectItem>
            <SelectItem value="hover">On Hover</SelectItem>
            <SelectItem value="click">On Click</SelectItem>
            <SelectItem value="immediate">Immediate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="repeat" 
          checked={properties.repeat || false} 
          onCheckedChange={(checked) => onPropertyChange("repeat", checked)}
        />
        <Label htmlFor="repeat">Repeat Animation</Label>
      </div>
    </div>
  );
};

export default AnimationPropertyEditor;
