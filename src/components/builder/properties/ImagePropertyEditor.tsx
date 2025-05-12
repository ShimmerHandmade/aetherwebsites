
import React, { useState } from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Upload, Loader2 } from "lucide-react";
import { uploadProductImage } from "@/api/products";
import { useParams } from "react-router-dom";

const ImagePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const { id: websiteId } = useParams<{ id: string }>();
  const properties = element.props || {};
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !websiteId) return;
    
    setIsUploading(true);
    
    try {
      // First upload to Supabase storage
      const imageUrl = await uploadProductImage(
        file, 
        websiteId, 
        element.id || 'builder-image'
      );
      
      if (imageUrl) {
        // Set the actual image URL from Supabase
        onPropertyChange("src", imageUrl);
        console.log("Image uploaded and URL set:", imageUrl);
      } else {
        // Fallback to base64 if Supabase upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          onPropertyChange("src", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      
      // Fallback to base64 if Supabase upload fails
      const reader = new FileReader();
      reader.onloadend = () => {
        onPropertyChange("src", reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
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
              disabled={isUploading}
              className="hidden"
            />
            <label htmlFor="imageUpload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    <span className="text-sm font-medium text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload image
                    </span>
                  </>
                )}
                <span className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
            </label>
          </div>
          
          {properties.src && (
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
