
import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { EditorToolbar } from "./editor-toolbar";
import { RichTextEditorProps } from "./types";
import { useToast } from "@/hooks/use-toast";

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, className, id, noToast = false, ...props }, ref) => {
    const [activeFormat, setActiveFormat] = React.useState<string[]>([]);
    const [headingLevel, setHeadingLevel] = React.useState<string>("paragraph");
    const editorRef = React.useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();

    // Convert the string onChange to handle textarea change events
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    // This is a simplified implementation that just shows the UI
    // In a real implementation, we'd apply the formatting to the text
    const toggleFormat = (format: string) => {
      if (activeFormat.includes(format)) {
        setActiveFormat(activeFormat.filter((f) => f !== format));
      } else {
        setActiveFormat([...activeFormat, format]);
        // Give feedback when format is applied
        if (!noToast) {
          toast({
            description: `${format.charAt(0).toUpperCase() + format.slice(1)} formatting applied`
          });
        }
      }
    };

    const setHeading = (level: string) => {
      setHeadingLevel(level);
      if (!noToast) {
        toast({
          description: `Heading set to ${level}`
        });
      }
    };

    return (
      <div 
        className={cn("border rounded-md overflow-hidden bg-white shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400", className)}
        ref={ref}
      >
        <EditorToolbar
          activeFormat={activeFormat}
          toggleFormat={toggleFormat}
          headingLevel={headingLevel}
          setHeading={setHeading}
        />
        
        <Textarea
          ref={editorRef}
          id={id}
          value={value}
          onChange={handleTextAreaChange}
          richEditor={true}
          className="min-h-[200px] focus:outline-none px-4 py-3"
          {...props}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

// Re-export for backward compatibility
export * from "./types";
