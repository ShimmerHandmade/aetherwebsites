
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const useMobileBuilder = () => {
  const isMobile = useIsMobile();
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [longPressActive, setLongPressActive] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mobile-specific interaction handlers using React's synthetic events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartTime(Date.now());
    setLongPressActive(false);
    
    // Start long press timer for element selection
    const longPressTimer = setTimeout(() => {
      if (!dragActive) {
        setLongPressActive(true);
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500);

    // Clear timer on touch end - we'll handle this in the component
    const clearTimer = () => {
      clearTimeout(longPressTimer);
    };

    // Store the clear function for cleanup
    (e.currentTarget as any).__clearLongPressTimer = clearTimer;
  }, [dragActive]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // If touch has been held for more than 100ms, consider it a drag
    if (touchDuration > 100) {
      setDragActive(true);
    }
  }, [touchStartTime]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear any pending long press timer
    const clearTimer = (e.currentTarget as any).__clearLongPressTimer;
    if (clearTimer) {
      clearTimer();
    }
    
    setDragActive(false);
    setLongPressActive(false);
  }, []);

  // Enhanced touch interactions for mobile
  const getMobileInteractionProps = useCallback(() => {
    if (!isMobile) return {};

    return {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        touchAction: 'manipulation' as const,
        userSelect: 'none' as const,
      } as React.CSSProperties
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isMobile,
    longPressActive,
    dragActive,
    getMobileInteractionProps,
    touchStartTime
  };
};
