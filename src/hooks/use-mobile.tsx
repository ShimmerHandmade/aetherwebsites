
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set initial value
    checkIsMobile()

    // Use both resize and orientationchange for better mobile detection
    const handleResize = () => {
      checkIsMobile()
    }

    const handleOrientationChange = () => {
      // Small delay to account for orientation change timing
      setTimeout(checkIsMobile, 100)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleOrientationChange)
    
    // Also listen for media query changes for more accurate detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleOrientationChange)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
