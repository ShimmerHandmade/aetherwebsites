
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToolbarButtonProps } from "./types";

export const ToolbarButton = ({
  active = false,
  onClick,
  children
}: ToolbarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("p-1 h-8 w-8", active && "bg-slate-100")}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
