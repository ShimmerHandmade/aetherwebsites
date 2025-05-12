
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

interface CardPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const CardPropertyEditor: React.FC<CardPropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <ContentPropertyEditor 
                content={element.content} 
                onContentChange={onContentChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={element.props?.description || ""}
                onChange={(e) => onPropertyChange("description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showButton" 
                checked={element.props?.showButton || false} 
                onCheckedChange={(checked) => onPropertyChange("showButton", checked === true)}
              />
              <Label htmlFor="showButton">Show Button</Label>
            </div>
            
            {element.props?.showButton && (
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={element.props?.buttonText || "Learn More"}
                  onChange={(e) => onPropertyChange("buttonText", e.target.value)}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardPropertyEditor;
