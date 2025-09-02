import { useEffect, useState } from 'react';

export function useCheckMobileMatchMedia() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    // Initial check
    setIsMobile(mediaQuery.matches);

    // Listener for changes
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', handler); // Modern syntax

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handler); // Modern syntax
    };
  }, []); // Empty dependency array as the media query string is static

  return {
    isMobile,
  };
}
