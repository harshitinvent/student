import { useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>,
  callback: () => void,
  enabled: boolean,
  buttonRef?: React.RefObject<T | null>
) {
  useEffect(() => {
    if (!enabled) return;

    function handleOutsideClick(e: MouseEvent) {
      if (!elementRef?.current) return;

      if (!elementRef.current.contains(e.target as Node)) {
        if (
          buttonRef?.current &&
          buttonRef?.current.contains(e.target as Node)
        ) {
          return;
        }

        callback();
      }
    }

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [elementRef, callback, enabled]);
}
