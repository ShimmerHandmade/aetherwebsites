
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ElementProperties = () => {
  const { elements, selectedElementId, updateElement } = useBuilder();
  const [content, setContent] = useState("");
  const [properties, setProperties] = useState<Record<string, any>>({});

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.content || "");
      setProperties(selectedElement.props || {});
    } else {
      setContent("");
      setProperties({});
    }
  }, [selectedElement]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { content: newContent });
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    const updatedProps = { ...properties, [property]: value };
    setProperties(updatedProps);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { props: updatedProps });
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4 border-t border-gray-200 mt-4">
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 mt-4">
      <h3 className="font-medium mb-2">Element Properties</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600 block mb-1">Element Type</Label>
          <p className="text-sm font-medium capitalize">{selectedElement.type}</p>
        </div>
        
        <div>
          <Label htmlFor="elementContent" className="text-sm text-gray-600 block mb-1">
            Content
          </Label>
          <Input
            id="elementContent"
            value={content}
            onChange={handleContentChange}
            className="w-full"
          />
        </div>

        {/* Render property fields based on element type */}
        {selectedElement.type === "image" && (
          <>
            <div>
              <Label htmlFor="imageSrc" className="text-sm text-gray-600 block mb-1">
                Image URL
              </Label>
              <Input
                id="imageSrc"
                value={properties.src || ""}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt" className="text-sm text-gray-600 block mb-1">
                Alt Text
              </Label>
              <Input
                id="imageAlt"
                value={properties.alt || ""}
                onChange={(e) => handlePropertyChange("alt", e.target.value)}
                placeholder="Image description"
                className="w-full"
              />
            </div>
          </>
        )}

        {selectedElement.type === "button" && (
          <div>
            <Label htmlFor="buttonVariant" className="text-sm text-gray-600 block mb-1">
              Button Style
            </Label>
            <Select 
              value={properties.variant || "primary"}
              onValueChange={(value) => handlePropertyChange("variant", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedElement.type === "feature" && (
          <>
            <div>
              <Label htmlFor="featureDescription" className="text-sm text-gray-600 block mb-1">
                Description
              </Label>
              <Textarea
                id="featureDescription"
                value={properties.description || ""}
                onChange={(e) => handlePropertyChange("description", e.target.value)}
                placeholder="Feature description"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="featureIcon" className="text-sm text-gray-600 block mb-1">
                Icon
              </Label>
              <Input
                id="featureIcon"
                value={properties.icon || ""}
                onChange={(e) => handlePropertyChange("icon", e.target.value)}
                placeholder="★"
                className="w-full"
              />
            </div>
          </>
        )}

        {selectedElement.type === "testimonial" && (
          <>
            <div>
              <Label htmlFor="testimonialAuthor" className="text-sm text-gray-600 block mb-1">
                Author Name
              </Label>
              <Input
                id="testimonialAuthor"
                value={properties.author || ""}
                onChange={(e) => handlePropertyChange("author", e.target.value)}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="testimonialRole" className="text-sm text-gray-600 block mb-1">
                Role/Position
              </Label>
              <Input
                id="testimonialRole"
                value={properties.role || ""}
                onChange={(e) => handlePropertyChange("role", e.target.value)}
                placeholder="Customer"
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ElementProperties;
