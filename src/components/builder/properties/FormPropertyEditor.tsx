
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ContentPropertyEditor from "./ContentPropertyEditor";

const FormPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  if (element.type === "form") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Form Action URL</Label>
          <Input
            value={properties.action || ""}
            onChange={(e) => onPropertyChange("action", e.target.value)}
            placeholder="https://example.com/submit"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Method</Label>
          <Select 
            value={properties.method || "POST"}
            onValueChange={(value) => onPropertyChange("method", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  
  if (element.type === "input") {
    return (
      <div className="space-y-4">
        <ContentPropertyEditor 
          content={element.content} 
          onContentChange={onContentChange} 
          label="Label Text"
          placeholder="Enter label..."
        />
        
        <div className="space-y-2">
          <Label>Input Type</Label>
          <Select 
            value={properties.type || "text"}
            onValueChange={(value) => onPropertyChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="tel">Phone</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input
            value={properties.placeholder || ""}
            onChange={(e) => onPropertyChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="required" 
            checked={properties.required || false} 
            onCheckedChange={(checked) => onPropertyChange("required", checked)}
          />
          <Label htmlFor="required">Required</Label>
        </div>
      </div>
    );
  }
  
  // Default for other form elements
  return (
    <div className="space-y-4">
      <ContentPropertyEditor 
        content={element.content} 
        onContentChange={onContentChange} 
      />
    </div>
  );
};

export default FormPropertyEditor;
