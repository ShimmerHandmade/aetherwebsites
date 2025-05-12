import React, { useState } from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Upload, Loader2, Image as ImageIcon, ExternalLink, Info } from "lucide-react";
import { uploadProductImage } from "@/api/products";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ImagePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const { id: websiteId } = useParams<{ id: string }>();
  const properties = element.props || {};
  const [isUploading, setIsUploading] = useState(false);
  
  // Helper function to format URLs
  const formatImageUrl = (url: string) => {
    if (!url) return url;
    
    // If it's an absolute URL already, return as is
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
      return url;
    }
    
    // If it starts with a slash, prepend the current website domain
    if (url.startsWith('/')) {
      const origin = window.location.origin;
      return `${origin}${url}`;
    }
    
    // Otherwise, add https:// prefix
    return `https://${url}`;
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !websiteId) {
      toast.error("No file selected or missing website ID");
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Show immediate feedback with a local preview
      const objectUrl = URL.createObjectURL(file);
      onPropertyChange("src", objectUrl);
      
      // Upload to Supabase storage
      const imageUrl = await uploadProductImage(
        file, 
        websiteId, 
        element.id || 'builder-image'
      );
      
      if (imageUrl) {
        // Update with the actual Supabase URL
        onPropertyChange("src", imageUrl);
        console.log("Image uploaded and URL set:", imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        // If upload fails but we already set a preview, keep it
        toast.error("Upload to storage failed, using local preview");
      }
    } catch (error) {
      console.error("Error in image upload process:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  // Format URL on blur
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedUrl = formatImageUrl(e.target.value);
    if (formattedUrl !== e.target.value) {
      onPropertyChange("src", formattedUrl);
    }
  };
  
  // Stop propagation for click events on the input to prevent bubbling
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-5">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 transition-all hover:bg-gray-100">
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
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <span className="text-sm font-medium text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Upload className="h-7 w-7 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </span>
                  </>
                )}
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </span>
              </div>
            </label>
          </div>
          
          {properties.src && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img 
                src={properties.src} 
                alt="Preview" 
                className="max-h-48 w-full object-cover rounded-md"
                onError={(e) => {
                  console.error("Error loading preview image:", properties.src);
                  e.currentTarget.classList.add("border", "border-red-500");
                  e.currentTarget.style.display = "none";
                  toast.error("Failed to load image preview");
                }}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="url" className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="imageSrc" className="text-sm font-medium text-gray-700 block">
              Image URL
            </Label>
            <div className="relative">
              <Input
                id="imageSrc"
                value={properties.src || ""}
                onChange={(e) => onPropertyChange("src", e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com/image.jpg"
                className="pr-10"
              />
              <ExternalLink className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              URLs starting with / will be automatically prefixed with your site domain
            </p>
          </div>
          
          {properties.src && (
            <div className="rounded-md overflow-hidden border bg-gray-50 p-1">
              <img 
                src={properties.src} 
                alt="Preview" 
                className="max-h-48 w-full object-contain rounded"
                onError={(e) => {
                  console.error("Error loading preview image:", properties.src);
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="h-32 flex items-center justify-center text-red-500">
                        <div class="text-center">
                          <div class="flex justify-center">
                            <ImageIcon className="h-8 w-8 text-red-400 mb-2" />
                          </div>
                          <p class="text-sm">Failed to load image</p>
                          <p class="text-xs text-gray-500 mt-1">${properties.src}</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="space-y-3">
        <Label htmlFor="imageAlt" className="text-sm font-medium text-gray-700 block">
          Alt Text
        </Label>
        <Input
          id="imageAlt"
          value={properties.alt || ""}
          onChange={(e) => onPropertyChange("alt", e.target.value)}
          placeholder="Image description"
          className="w-full"
        />
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Important for accessibility and SEO
        </p>
      </div>
      
      <div className="pt-2">
        <ContentPropertyEditor 
          content={element.content} 
          onContentChange={onContentChange} 
        />
      </div>
    </div>
  );
};

export default ImagePropertyEditor;
