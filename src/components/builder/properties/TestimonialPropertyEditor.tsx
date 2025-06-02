
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

const TestimonialPropertyEditor: React.FC<PropertyEditorProps> = ({
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
            label="Testimonial Text"
            placeholder="Enter testimonial..."
            useMultiline={true}
          />
          
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input
              value={properties.customerName || ""}
              onChange={(e) => onPropertyChange("customerName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Customer Title</Label>
            <Input
              value={properties.customerTitle || ""}
              onChange={(e) => onPropertyChange("customerTitle", e.target.value)}
              placeholder="CEO, Company"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input
              value={properties.avatarUrl || ""}
              onChange={(e) => onPropertyChange("avatarUrl", e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showAvatar" 
              checked={properties.showAvatar || false} 
              onCheckedChange={(checked) => onPropertyChange("showAvatar", checked)}
            />
            <Label htmlFor="showAvatar">Show Avatar</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showRating" 
              checked={properties.showRating || false} 
              onCheckedChange={(checked) => onPropertyChange("showRating", checked)}
            />
            <Label htmlFor="showRating">Show Star Rating</Label>
          </div>
          
          {properties.showRating && (
            <div>
              <Label>Rating (1-5)</Label>
              <Select 
                value={String(properties.rating || 5)}
                onValueChange={(value) => onPropertyChange("rating", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestimonialPropertyEditor;
