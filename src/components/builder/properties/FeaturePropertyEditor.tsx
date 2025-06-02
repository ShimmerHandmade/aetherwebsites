
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

const FeaturePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
            label="Feature Title"
            placeholder="Enter feature title..."
          />
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={properties.description || ""}
              onChange={(e) => onPropertyChange("description", e.target.value)}
              placeholder="Describe this feature..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Icon Name</Label>
            <Select 
              value={properties.iconName || "star"}
              onValueChange={(value) => onPropertyChange("iconName", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star">Star</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
                <SelectItem value="shield">Shield</SelectItem>
                <SelectItem value="zap">Zap</SelectItem>
                <SelectItem value="award">Award</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="target">Target</SelectItem>
                <SelectItem value="trending-up">Trending Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label>Layout</Label>
            <Select 
              value={properties.layout || "vertical"}
              onValueChange={(value) => onPropertyChange("layout", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Icon Style</Label>
            <Select 
              value={properties.iconStyle || "default"}
              onValueChange={(value) => onPropertyChange("iconStyle", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="filled">Filled Circle</SelectItem>
                <SelectItem value="outlined">Outlined Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturePropertyEditor;
