
import React, { useState } from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Upload } from "lucide-react";

const ImagePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Convert file to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onPropertyChange("src", reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Stop propagation for click events on the input to prevent bubbling
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 pt-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Input 
              type="file" 
              id="imageUpload"
              accept="image/*"
              onChange={handleFileUpload} 
              onClick={handleInputClick}
              className="hidden"
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {isUploading ? 'Uploading...' : 'Click to upload image'}
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
            </label>
          </div>
          
          {properties.src && properties.src.startsWith('data:image') && (
            <div className="mt-4">
              <img 
                src={properties.src} 
                alt="Preview" 
                className="max-h-40 mx-auto rounded-md"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="imageSrc" className="text-sm text-gray-600 block mb-1">
              Image URL
            </Label>
            <Input
              id="imageSrc"
              value={properties.src || ""}
              onChange={(e) => onPropertyChange("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div>
        <Label htmlFor="imageAlt" className="text-sm text-gray-600 block mb-1">
          Alt Text
        </Label>
        <Input
          id="imageAlt"
          value={properties.alt || ""}
          onChange={(e) => onPropertyChange("alt", e.target.value)}
          placeholder="Image description"
          className="w-full"
        />
      </div>
      
      <ContentPropertyEditor 
        content={element.content} 
        onContentChange={onContentChange} 
      />
    </div>
  );
};

export default ImagePropertyEditor;
