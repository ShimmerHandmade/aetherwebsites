
export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  noToast?: boolean;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  disableToolbar?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

export interface ToolbarButtonProps {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}
