
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";

interface ContentPropertyEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  useRichEditor?: boolean;
  useMultiline?: boolean;
  label?: string;
  placeholder?: string;
}

const ContentPropertyEditor: React.FC<ContentPropertyEditorProps> = ({ 
  content, 
  onContentChange,
  useRichEditor = false,
  useMultiline = false,
  label = "Content",
  placeholder = "Enter content here..."
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <Label htmlFor="elementContent" className="text-sm text-gray-600 block mb-1">
        {label}
      </Label>
      
      {useRichEditor ? (
        <RichTextEditor
          id="elementContent"
          value={content}
          onChange={onContentChange}
          className="w-full min-h-32"
          placeholder={placeholder}
        />
      ) : useMultiline ? (
        <Textarea
          id="elementContent"
          value={content}
          onChange={handleContentChange}
          className="w-full"
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <Input
          id="elementContent"
          value={content}
          onChange={handleContentChange}
          className="w-full"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default ContentPropertyEditor;
