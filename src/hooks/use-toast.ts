
import { toast as sonerToast } from "sonner";

export const useToast = () => {
  return {
    toast: sonerToast
  };
};

export const toast = sonerToast;
