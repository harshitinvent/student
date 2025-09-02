import { useRef, useEffect, type MouseEvent } from 'react';
import { NavLink } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import CustomIcon from './icons/CustomIcon';

import type { NavigationItemType } from '../../types/navigation';

export default function NavigationItem({
  name,
  icon,
  path,
  sublist,

  collapsed,
  end,
  isOpenedAccordion,
  onToggleAccordion,
  onClick,
  className = '',
}: NavigationItemType & {
  collapsed?: boolean;
  end?: boolean;
  isOpenedAccordion: boolean;
  onToggleAccordion: () => void;
  onClick?: () => void;
  className?: string;
}) {
  const sublistWrapperRef = useRef<HTMLDivElement>(null);
  const sublistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sublistWrapperRef.current || !sublistRef.current) return;

    const sublistHeight =
      sublistRef.current.clientHeight || sublistRef.current.offsetHeight;

    if (isOpenedAccordion && !collapsed) {
      sublistWrapperRef.current.style.height = `${sublistHeight}px`;
    } else {
      sublistWrapperRef.current.style.height = `${sublistHeight}px`;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      sublistWrapperRef.current.offsetWidth;
      sublistWrapperRef.current.style.height = `0`;
    }
  }, [isOpenedAccordion, collapsed]);

  useEffect(() => {
    if (!sublistWrapperRef.current || !sublistRef.current) return;

    function handleTransitionEnd(e: TransitionEvent) {
      if (isOpenedAccordion && !collapsed && e.propertyName === 'height')
        sublistWrapperRef.current!.style.height = 'auto';
    }

    const el = sublistWrapperRef.current;

    el.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      el.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpenedAccordion, collapsed]);

  function handleButtonClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    onToggleAccordion();
  }

  return (
    <div className={`z-1 min-h-40 overflow-hidden duration-300 ${className}`}>
      <div className={`group/nav relative flex w-full items-center`}>
        <NavLink
          end={end}
          to={path}
          className={
            'rounded-12 relative z-1 flex h-40 w-full flex-1 items-center justify-between px-4 transition-colors duration-300 group-hover/nav:bg-[#f1f1f1] [&.active]:bg-[#f1f1f1]'
          }
          onClick={() => onClick?.()}
        >
          <div className={'flex items-center gap-12 overflow-hidden'}>
            <div
              className={
                'rounded-8 text-iconSec group-has-[.active]/nav:shadow-s1 group-hover/nav:shadow-s1 flex size-32 shrink-0 items-center justify-center duration-300 group-hover/nav:bg-white group-has-[.active]/nav:bg-white'
              }
            >
              <HugeiconsIcon icon={icon} className={'size-20'} />
            </div>
            <p
              className={`text-body-m overflow-hidden font-semibold text-ellipsis whitespace-nowrap duration-300 ${sublist ? 'pr-32' : ''} ${collapsed ? 'pointer-events-none opacity-0' : ''}`}
            >
              {name}
            </p>
          </div>
        </NavLink>

        {sublist && (
          <button
            tabIndex={-1}
            onClick={handleButtonClick}
            className={`text-textSecondary rounded-4 absolute right-12 z-1 flex size-16 cursor-pointer duration-300 select-none hover:bg-white ${collapsed ? 'pointer-events-none opacity-0' : ''}`}
          >
            <CustomIcon
              icon={'chevron'}
              className={`size-full transition-transform duration-300 ${isOpenedAccordion && !collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {sublist && (
        <div
          ref={sublistWrapperRef}
          className={'h-0 overflow-hidden duration-300'}
        >
          <div
            ref={sublistRef}
            className={`del pt-2 duration-200 ${isOpenedAccordion && !collapsed ? '' : 'opacity-0 delay-100'}`}
          >
            {sublist.map(({ name, path }, index) => (
              <NavLink
                key={'sublist-item-to-' + path}
                to={path}
                className={
                  'text-textDescription group/item hover:text-textPr [&.active]:text-textPr relative flex h-40 items-center pr-12 pl-48 transition-colors duration-300'
                }
                onClick={() => onClick?.()}
              >
                <div
                  className={
                    'text-linePr pointer-events-none absolute bottom-19.5 left-18.5 select-none'
                  }
                >
                  <CustomIcon
                    icon={index === 0 ? 'navigation-line-s' : 'navigation-line'}
                  />
                </div>
                <p
                  className={
                    'text-body-m w-full overflow-hidden font-semibold text-ellipsis whitespace-nowrap'
                  }
                >
                  {name}
                </p>
                <div
                  className={
                    'text-textSecondary ml-0 h-16 w-0 shrink-0 -rotate-90 overflow-hidden duration-300 group-hover/item:ml-12 group-hover/item:w-16'
                  }
                >
                  <CustomIcon icon={'chevron'} className={'size-full'} />
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
