
import { toast as sonerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
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

export const useToast = () => {
  return {
    toast
  };
};

export { toast };
