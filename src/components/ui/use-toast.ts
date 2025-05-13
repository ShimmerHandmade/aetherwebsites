
// Re-export toast from hooks
import { useToast as useToastHook, toast as toastFunction, type ToastProps } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastFunction;
export type { ToastProps };
