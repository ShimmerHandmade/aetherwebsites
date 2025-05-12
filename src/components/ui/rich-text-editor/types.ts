
export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export interface ToolbarButtonProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
