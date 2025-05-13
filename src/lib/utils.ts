
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast as sonnerToast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Wrapper for toast to handle different toast implementations
export const toast = {
  error: (message: string, options?: { description?: string }) => {
    return sonnerToast.error(message, {
      description: options?.description
    });
  },
  success: (message: string, options?: { description?: string }) => {
    return sonnerToast.success(message, {
      description: options?.description
    });
  },
  info: (message: string, options?: { description?: string }) => {
    return sonnerToast(message, {
      description: options?.description
    });
  }
};
