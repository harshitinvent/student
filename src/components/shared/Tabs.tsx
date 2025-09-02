import { useRef } from 'react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

import { useActiveButtonDimension } from '../../utils/hooks/useActiveButtonDimension';

export type TabType = {
  id: string | number;
  title?: string;
  icon?: IconSvgElement;
};

export default function Tabs<T extends TabType>({
  activeTabId,
  onTabChange,
  tabsList,

  withoutText = false,
  squareType = false,
  className = '',
}: {
  activeTabId: T['id'];
  onTabChange: (tabId: T['id']) => void;
  tabsList: T[];

  withoutText?: boolean;
  squareType?: boolean;
  className?: string;
}) {
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeTabIndex = tabsList.findIndex((tab) => tab.id === activeTabId);

  const { width, offsetLeft } = useActiveButtonDimension(
    tabContainerRef,
    buttonRefs,
    activeTabIndex
  );

  return (
    <div
      ref={tabContainerRef}
      className={`bg-bgNavigate rounded-12 relative z-1 flex items-stretch border p-4 ${
        squareType
          ? 'w-fit border-transparent'
          : 'border-linePr w-250 inset-shadow-[0_0.0625rem_0.125rem_rgba(50,50,50,0.1)]'
      } ${className}`}
    >
      {tabsList.map(({ id, title, icon }, index) => (
        <button
          key={'tab-button-' + id}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          className={`text-body-l relative z-1 flex h-32 flex-1 cursor-pointer items-center justify-center gap-2 px-7 font-semibold whitespace-nowrap transition-colors duration-300 ${
            id === activeTabId ? 'text-textHeadline' : 'text-textDescription'
          } ${squareType ? 'size-32 shrink-0' : 'px-16'}`}
          onClick={() => onTabChange(id)}
        >
          {icon && <HugeiconsIcon className={'size-18 shrink-0'} icon={icon} />}
          {!withoutText && (title || id)}
        </button>
      ))}

      <hr
        className={
          'rounded-8 bg-bgSec absolute left-0 h-32 w-0 border-none shadow-[0_0.0625rem_0.1875rem_rgba(50,50,50,0.1)] duration-300'
        }
        style={{
          width,
          transform: `translateX(${offsetLeft}px)`,
        }}
      />
    </div>
  );
}
