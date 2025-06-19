
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export const useMobileBuilder = () => {
  const isMobile = useIsMobile();
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [longPressActive, setLongPressActive] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState<{ x: number; y: number } | null>(null);

  // Mobile-specific interaction handlers using React's synthetic events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartTime(Date.now());
    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
    setLongPressActive(false);
    setDragActive(false);
    
    // Start long press timer for element selection
    const longPressTimer = setTimeout(() => {
      if (!dragActive) {
        setLongPressActive(true);
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }
    }, 600); // Slightly longer for better UX

    // Store the clear function for cleanup
    (e.currentTarget as any).__clearLongPressTimer = () => {
      clearTimeout(longPressTimer);
    };
  }, [dragActive]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // Calculate movement distance
    if (touchStartPosition) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
      const deltaY = Math.abs(touch.clientY - touchStartPosition.y);
      const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // If significant movement detected, consider it a drag
      if (totalMovement > 10 && touchDuration > 150) {
        setDragActive(true);
        setLongPressActive(false);
      }
    }
  }, [touchStartTime, touchStartPosition]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear any pending long press timer
    const clearTimer = (e.currentTarget as any).__clearLongPressTimer;
    if (clearTimer) {
      clearTimer();
    }
    
    const touchDuration = Date.now() - touchStartTime;
    
    // Reset states after a brief delay to allow for proper event handling
    setTimeout(() => {
      setDragActive(false);
      setLongPressActive(false);
      setTouchStartPosition(null);
    }, 100);
  }, [touchStartTime]);

  // Enhanced touch interactions for mobile with better event handling
  const getMobileInteractionProps = useCallback(() => {
    if (!isMobile) return {};

    return {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        touchAction: 'manipulation' as const,
        userSelect: 'none' as const,
        WebkitTouchCallout: 'none' as const,
        WebkitUserSelect: 'none' as const,
      } as React.CSSProperties
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Helper function to determine if a touch was a tap vs long press
  const isTap = useCallback(() => {
    const touchDuration = Date.now() - touchStartTime;
    return touchDuration < 300 && !dragActive;
  }, [touchStartTime, dragActive]);

  // Helper function to determine if touch is ready for context menu
  const isReadyForContextMenu = useCallback(() => {
    return longPressActive && !dragActive;
  }, [longPressActive, dragActive]);

  return {
    isMobile,
    longPressActive,
    dragActive,
    touchStartTime,
    touchStartPosition,
    getMobileInteractionProps,
    isTap,
    isReadyForContextMenu
  };
};
