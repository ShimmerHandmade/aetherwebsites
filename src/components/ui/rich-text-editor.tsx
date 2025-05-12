
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

import { cn } from "@/lib/utils";
import { TextArea, TextAreaProps } from "./textarea";
import { Button } from "./button";

interface RichTextEditorProps extends Omit<TextAreaProps, "richEditor"> {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  const [activeFormat, setActiveFormat] = React.useState<string[]>([]);
  const [headingLevel, setHeadingLevel] = React.useState<string>("paragraph");
  const editorRef = React.useRef<HTMLTextAreaElement>(null);

  // This is a simplified implementation that just shows the UI
  // In a real implementation, we'd apply the formatting to the text
  const toggleFormat = (format: string) => {
    if (activeFormat.includes(format)) {
      setActiveFormat(activeFormat.filter((f) => f !== format));
    } else {
      setActiveFormat([...activeFormat, format]);
    }
  };

  const setHeading = (level: string) => {
    setHeadingLevel(level);
  };

  return (
    <div className={cn("border rounded-md overflow-hidden bg-white", className)}>
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
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("bold") && "bg-slate-100")}
          onClick={() => toggleFormat("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("italic") && "bg-slate-100")}
          onClick={() => toggleFormat("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("underline") && "bg-slate-100")}
          onClick={() => toggleFormat("underline")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("alignLeft") && "bg-slate-100")}
          onClick={() => toggleFormat("alignLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("alignCenter") && "bg-slate-100")}
          onClick={() => toggleFormat("alignCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("alignRight") && "bg-slate-100")}
          onClick={() => toggleFormat("alignRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("p-1 h-8 w-8", activeFormat.includes("alignJustify") && "bg-slate-100")}
          onClick={() => toggleFormat("alignJustify")}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <TextArea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        richEditor={true}
        className="min-h-[200px] focus:outline-none"
        {...props}
      />
    </div>
  );
};
