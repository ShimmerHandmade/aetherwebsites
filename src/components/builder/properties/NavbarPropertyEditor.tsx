
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const NavbarPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const links = element.props?.links || [];
  
  const handleAddLink = () => {
    const newLinks = [...links, { text: "New Link", url: "#" }];
    onPropertyChange("links", newLinks);
  };

  const handleUpdateLink = (index: number, field: "text" | "url", value: string) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    onPropertyChange("links", newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    onPropertyChange("links", newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Site Name</Label>
        <Input
          value={element.props?.siteName || "My Website"}
          onChange={(e) => onPropertyChange("siteName", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Style Variant</Label>
        <Select
          value={element.props?.variant || "default"}
          onValueChange={(value) => onPropertyChange("variant", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="transparent">Transparent</SelectItem>
            <SelectItem value="brand">Brand</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Navigation Links</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddLink} 
            className="h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                className="flex-grow"
                placeholder="Link Text"
                value={link.text}
                onChange={(e) => handleUpdateLink(index, "text", e.target.value)}
              />
              <Input
                className="flex-grow"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveLink(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-1.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarPropertyEditor;
