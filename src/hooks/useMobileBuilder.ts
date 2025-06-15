
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

    // Clear timer if touch ends early
    const clearTimer = () => {
      clearTimeout(longPressTimer);
    };

    // Set up cleanup on component unmount or touch end
    const timeoutId = setTimeout(() => clearTimer(), 1000);
    
    return () => clearTimeout(timeoutId);
  }, [dragActive]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // If touch has been held for more than 100ms, consider it a drag
    if (touchDuration > 100) {
      setDragActive(true);
    }
  }, [touchStartTime]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
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
        touchAction: 'manipulation', // Prevent default touch behaviors
        userSelect: 'none', // Prevent text selection on touch
      }
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
