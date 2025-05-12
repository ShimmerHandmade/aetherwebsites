
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

interface FormPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const FormPropertyEditor: React.FC<FormPropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const fields = element.props?.fields || ["name", "email"];
  
  const toggleField = (fieldName: string) => {
    let updatedFields;
    if (fields.includes(fieldName)) {
      updatedFields = fields.filter((field: string) => field !== fieldName);
    } else {
      updatedFields = [...fields, fieldName];
    }
    onPropertyChange("fields", updatedFields);
  };
  
  const updateSubmitButtonText = (text: string) => {
    onPropertyChange("submitButtonText", text);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="fields">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content">Title</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="submit">Submit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
        </TabsContent>
        
        <TabsContent value="fields" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="name" 
                checked={fields.includes("name")} 
                onCheckedChange={() => toggleField("name")} 
              />
              <Label htmlFor="name">Name Field</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email" 
                checked={fields.includes("email")} 
                onCheckedChange={() => toggleField("email")}
              />
              <Label htmlFor="email">Email Field</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="phone" 
                checked={fields.includes("phone")} 
                onCheckedChange={() => toggleField("phone")}
              />
              <Label htmlFor="phone">Phone Field</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="subject" 
                checked={fields.includes("subject")} 
                onCheckedChange={() => toggleField("subject")}
              />
              <Label htmlFor="subject">Subject Field</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="message" 
                checked={fields.includes("message")} 
                onCheckedChange={() => toggleField("message")}
              />
              <Label htmlFor="message">Message Field</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="submit" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Submit Button Text</Label>
            <Input 
              value={element.props?.submitButtonText || "Submit"} 
              onChange={(e) => updateSubmitButtonText(e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormPropertyEditor;
