import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '../../utils/hooks/useClickOutside';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import CustomIcon from './icons/CustomIcon';

export default function Dropdown({
  label,
  direction = 'up',
  directionX = 'left',
  icon,
  size = 'sm',
  value,
  list,
  isFullWidthList = false,
  className = '',
  onChange,
}: {
  label?: string;
  direction?: 'up' | 'down';
  directionX?: 'left' | 'right';
  size?: 'sm' | 'md';
  icon?: IconSvgElement;
  value?: string | null;
  list: string[];
  isFullWidthList?: boolean;
  className?: string;

  onChange?: (value: string | null) => void;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [activeItem, setActiveItem] = useState<string | null>(value || null);

  useEffect(() => {
    onChange?.(activeItem);
  }, [activeItem]);

  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
    },
    isOpen,
    buttonRef
  );

  return (
    <div className={`relative z-1 ${className}`}>
      {label && (
        <p className={'text-body-m text-textHeadline mb-8 font-medium'}>
          {label}
        </p>
      )}
      <div
        ref={buttonRef}
        className={`rounded-12 flex w-full cursor-pointer items-center justify-between gap-12 overflow-hidden border border-[#E2E2E2] bg-[#F8F7F7] select-none ${
          size === 'md' ? 'h-48 px-16' : 'h-40 px-12'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={'flex flex-1 items-center gap-4 overflow-hidden'}>
          {icon && (
            <div
              className={'flex size-24 shrink-0 items-center justify-center'}
            >
              <HugeiconsIcon className={'size-16'} icon={icon} />
            </div>
          )}
          <p
            className={`text-textHeadline max-w-full overflow-hidden font-medium text-ellipsis whitespace-nowrap ${
              size === 'md' ? 'text-body-l' : 'text-body-m'
            }`}
          >
            {activeItem ? activeItem : 'Select'}
          </p>
        </div>
        <CustomIcon
          className={`text-textPr [&_*]:stroke-1.5 shrink-0 duration-300 ${isOpen ? 'rotate-180' : ''} ${
            size === 'md' ? 'size-24' : 'size-16'
          }`}
          icon={'chevron'}
        />
      </div>

      <div
        ref={dropdownRef}
        className={`rounded-16 absolute min-w-171 border border-[#ECECEC] bg-[#FCFCFC] shadow-[0_9.5625rem_3.8125rem_rgba(0,0,0,0.01),0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_2.375rem_2.375rem_rgba(0,0,0,0.06),0_0.625rem_1.6875rem_rgba(0,0,0,0.07)] duration-300 select-none ${
          isOpen ? '' : 'pointer-events-none scale-95 opacity-0'
        } ${
          direction === 'down'
            ? 'top-[calc(100%+0.5rem)] origin-top-left'
            : 'bottom-[calc(100%+0.5rem)] origin-bottom-left'
        } ${isFullWidthList ? 'w-full' : directionX === 'left' ? '-left-6' : '-right-6'}`}
      >
        <ul className={'p-8'}>
          {list.map((item, listIndex) => (
            <li
              key={'list-item-' + listIndex}
              className={
                'text-body-m rounded-10 flex h-36 cursor-pointer items-center gap-4 p-6 text-ellipsis whitespace-nowrap transition-colors duration-300 hover:bg-[#F1F1F1]'
              }
              onClick={() => {
                setActiveItem(item);
                setIsOpen(false);
              }}
            >
              <div
                className={
                  'text-textSecondary flex size-24 items-center justify-center'
                }
              >
                {activeItem === item && (
                  <HugeiconsIcon icon={Tick02Icon} className={'size-16'} />
                )}
              </div>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
