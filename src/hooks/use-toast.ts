
import { toast as sonerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Create helper methods for common toast types
const createToast = {
  default: (props: ToastProps) => {
    return sonerToast(props.title || "", {
      description: props.description,
    });
  },
  error: (message: string, options?: { description?: string }) => {
    return sonerToast.error(message, {
      description: options?.description,
    });
  },
  success: (message: string, options?: { description?: string }) => {
    return sonerToast.success(message, {
      description: options?.description,
    });
  }
};

// This function matches the expected interface across the codebase
const toast = (props: ToastProps) => {
  if (props.variant === "destructive") {
    return sonerToast.error(props.title || "", {
      description: props.description,
    });
  }
  return sonerToast(props.title || "", {
    description: props.description,
  });
};

// Add error and success methods to toast function to match usage in existing code
toast.error = createToast.error;
toast.success = createToast.success;

export const useToast = () => {
  return {
    toast
  };
};

export { toast };
