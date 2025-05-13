
import { toast as sonerToast } from "sonner";

type ToastFunction = typeof sonerToast;

export const useToast = () => {
  return {
    toast: sonerToast
  };
};

export const toast = sonerToast;
