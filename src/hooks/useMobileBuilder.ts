
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const useMobileBuilder = () => {
  const isMobile = useIsMobile();
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [longPressActive, setLongPressActive] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mobile-specific interaction handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
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
      document.removeEventListener('touchend', clearTimer);
      document.removeEventListener('touchmove', clearTimer);
    };

    document.addEventListener('touchend', clearTimer, { once: true });
    document.addEventListener('touchmove', clearTimer, { once: true });
  }, [dragActive]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // If touch has been held for more than 100ms, consider it a drag
    if (touchDuration > 100) {
      setDragActive(true);
    }
  }, [touchStartTime]);

  const handleTouchEnd = useCallback(() => {
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
