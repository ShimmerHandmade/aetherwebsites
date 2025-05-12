
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ContentPropertyEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  useRichEditor?: boolean;
}

const ContentPropertyEditor: React.FC<ContentPropertyEditorProps> = ({ 
  content, 
  onContentChange,
  useRichEditor = false
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div>
      <Label htmlFor="elementContent" className="text-sm text-gray-600 block mb-1">
        Content
      </Label>
      
      {useRichEditor ? (
        <RichTextEditor
          id="elementContent"
          value={content}
          onChange={onContentChange}
          className="w-full"
        />
      ) : (
        <Input
          id="elementContent"
          value={content}
          onChange={handleContentChange}
          className="w-full"
        />
      )}
    </div>
  );
};

export default ContentPropertyEditor;
