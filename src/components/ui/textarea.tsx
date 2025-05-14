
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  richEditor?: boolean;
  bordered?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  showScrollbar?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, richEditor, bordered = true, resize = "vertical", showScrollbar = true, style, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          bordered && "border border-input",
          !showScrollbar && "scrollbar-hide",
          className
        )}
        ref={ref}
        style={{
          ...style,
          resize: resize
        }}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
