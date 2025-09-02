import { RefObject, useEffect } from 'react';

export function useComputeElementHeight(
  elementRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  callback: () => void,
  isOpen: boolean
) {
  useEffect(() => {
    if (!elementRef.current || !contentRef.current) return;

    const contentHeight =
      contentRef.current.clientHeight || contentRef.current.offsetHeight;

    if (isOpen) {
      elementRef.current.style.height = `${contentHeight}px`;
    } else {
      elementRef.current.style.height = `${contentHeight}px`;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      elementRef.current.offsetWidth;
      callback();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!elementRef.current || !contentRef.current) return;

    function handleTransitionEnd(e: TransitionEvent) {
      if (isOpen && e.propertyName === 'height')
        elementRef.current!.style.height = 'auto';
    }

    const el = elementRef.current;

    el.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      el.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen]);
}
