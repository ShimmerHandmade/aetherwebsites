
import React, { useState } from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";

const VideoPropertyEditor: React.FC<PropertyEditorProps> = ({
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
              id="videoUpload"
              accept="video/*"
              onChange={handleFileUpload} 
              className="hidden"
            />
            <label htmlFor="videoUpload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {isUploading ? 'Uploading...' : 'Click to upload video'}
                </span>
                <span className="text-xs text-gray-400">
                  MP4, WebM up to 50MB
                </span>
              </div>
            </label>
          </div>
          
          {properties.src && (properties.src.startsWith('data:video') || properties.src.includes('.mp4')) && (
            <div className="mt-4">
              <video 
                src={properties.src} 
                controls
                className="max-h-40 w-full rounded-md"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="videoSrc" className="text-sm text-gray-600 block mb-1">
              Video URL
            </Label>
            <Input
              id="videoSrc"
              value={properties.src || ""}
              onChange={(e) => onPropertyChange("src", e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div>
        <Label htmlFor="videoPoster" className="text-sm text-gray-600 block mb-1">
          Poster Image URL
        </Label>
        <Input
          id="videoPoster"
          value={properties.poster || ""}
          onChange={(e) => onPropertyChange("poster", e.target.value)}
          placeholder="https://example.com/poster.jpg"
          className="w-full"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="autoplay" 
          checked={properties.autoplay || false}
          onCheckedChange={(checked) => onPropertyChange("autoplay", checked === true)}
        />
        <Label htmlFor="autoplay" className="text-sm">Autoplay</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="controls" 
          checked={properties.controls !== false}
          onCheckedChange={(checked) => onPropertyChange("controls", checked === true)}
        />
        <Label htmlFor="controls" className="text-sm">Show Controls</Label>
      </div>
    </div>
  );
};

export default VideoPropertyEditor;
