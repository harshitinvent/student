import { useEffect, useState, type RefObject } from 'react';

export function useActiveButtonDimension(
  containerRef: RefObject<HTMLElement | HTMLDivElement | null>,
  buttonRefs: RefObject<Array<HTMLButtonElement | HTMLDivElement | null>>,
  activeButtonIndex: number
) {
  const [activeItemDimension, setActiveItemDimension] = useState<{
    width: number;
    offsetLeft: number;
  }>({
    width: 0,
    offsetLeft: 0,
  });

  useEffect(() => {
    if (!containerRef || !buttonRefs) return;

    const activeButton = buttonRefs.current[activeButtonIndex || 0];

    setActiveItemDimension({
      width: activeButton?.offsetWidth || 0,
      offsetLeft: activeButton?.offsetLeft || 0,
    });
  }, [containerRef, buttonRefs, activeButtonIndex]);

  return {
    width: activeItemDimension.width,
    offsetLeft: activeItemDimension.offsetLeft,
  };
}
