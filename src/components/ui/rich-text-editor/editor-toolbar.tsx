
import * as React from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Quote,
  List,
  ListOrdered,
  Strikethrough,
  Heading1,
  TextIcon,
  ImageIcon,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolbarButton } from "./toolbar-button";
import { ToolbarDivider } from "./toolbar-divider";

interface EditorToolbarProps {
  activeFormat: string[];
  toggleFormat: (format: string) => void;
  headingLevel: string;
  setHeading: (level: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeFormat,
  toggleFormat,
  headingLevel,
  setHeading
}) => {
  return (
    <div className="flex items-center p-1 border-b gap-1 bg-white overflow-x-auto">
      <div className="flex items-center border-r pr-2 mr-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-sm"
          onClick={() => setHeading(headingLevel === 'heading1' ? 'paragraph' : 'heading1')}
        >
          <div className="flex items-center gap-1">
            {headingLevel === 'heading1' ? <Heading1 className="h-4 w-4" /> : <TextIcon className="h-4 w-4" />}
            <span className="text-xs">{headingLevel === 'heading1' ? 'Heading 1' : 'Paragraph'}</span>
          </div>
        </Button>
      </div>
      
      <ToolbarButton
        active={activeFormat.includes("bold")}
        onClick={() => toggleFormat("bold")}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={activeFormat.includes("italic")}
        onClick={() => toggleFormat("italic")}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={activeFormat.includes("underline")}
        onClick={() => toggleFormat("underline")}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarDivider />
      
      <ToolbarButton onClick={() => {}}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarDivider />
      
      <ToolbarButton
        active={activeFormat.includes("alignLeft")}
        onClick={() => toggleFormat("alignLeft")}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={activeFormat.includes("alignCenter")}
        onClick={() => toggleFormat("alignCenter")}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={activeFormat.includes("alignRight")}
        onClick={() => toggleFormat("alignRight")}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton
        active={activeFormat.includes("alignJustify")}
        onClick={() => toggleFormat("alignJustify")}
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarDivider />
      
      <ToolbarButton onClick={() => {}}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton onClick={() => {}}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarButton onClick={() => {}}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarDivider />
      
      <ToolbarButton onClick={() => {}}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      
      <ToolbarDivider />
      
      <ToolbarButton onClick={() => {}}>
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
