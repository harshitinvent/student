import { useState, useRef, type RefObject } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { NotificationIcon } from '@hugeicons/core-free-icons';

import PopUpWrapper from '../shared/wrappers/PopUpWrapper';
import NotificationList from '../features/NotificationList';

import { useClickOutside } from '../../utils/hooks/useClickOutside';

export default function NotificationWidget({
  className = '',
}: {
  className?: string;
}) {
  const popupRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [opened, setOpened] = useState<boolean>(false);
  const [newNotification, setNewNotification] = useState<boolean>(true);

  useClickOutside(
    popupRef,
    () => {
      setOpened(false);
      setNewNotification(false);
    },
    opened,
    buttonRef
  );

  return (
    <div className={`relative z-50 ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => {
          if (opened) {
            setNewNotification(false);
          }

          setOpened(!opened);
        }}
        className={`hover:bg-bgNavigate rounded-8 text-iconSec relative flex size-32 cursor-pointer items-center justify-center border-none transition-colors duration-300 outline-none ${
          opened ? 'bg-bgNavigate' : ''
        }`}
      >
        <HugeiconsIcon className={'size-20'} icon={NotificationIcon} />
        {newNotification && (
          <hr
            className={'bg-iconBlue absolute top-4 right-4 size-6 rounded-full'}
          />
        )}
      </button>

      <PopUpWrapper
        ref={popupRef as RefObject<HTMLDivElement>}
        className={`absolute top-[calc(100%+0.3125rem)] right-0 z-1 max-h-728 w-383 origin-top-right duration-300 select-none ${
          opened ? '' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div
          className={
            'flex items-center justify-between border-b border-[#E2E2E2] px-20 py-16'
          }
        >
          <p className={'text-14 text-textHeadline font-semibold'}>
            Notifications
          </p>

          <div className={'text-body-m flex items-center justify-end gap-4'}>
            <button
              className={`rounded-10 hover:bg-bgNavigate text-textDescription flex h-24 cursor-pointer items-center px-8 font-medium transition-colors duration-300 ${
                activeTab === 'all'
                  ? 'text-textHeadline bg-bgNavigate'
                  : 'bg-transparent'
              }`}
              onClick={() => {
                setActiveTab('all');
              }}
            >
              All
            </button>
            <button
              className={`rounded-10 hover:bg-bgNavigate text-textDescription flex h-24 cursor-pointer items-center px-8 font-medium transition-colors duration-300 ${
                activeTab === 'unread'
                  ? 'text-textHeadline bg-bgNavigate'
                  : 'bg-transparent'
              }`}
              onClick={() => {
                setActiveTab('unread');
              }}
            >
              Unread
            </button>
          </div>
        </div>

        <div className={'relative'}>
          <NotificationList className={'max-h-672 overflow-y-auto'} />
          <hr
            className={
              'from-neutral-5 to-neutral-5/0 absolute inset-x-0 bottom-0 h-104 border-none bg-linear-to-t outline-none'
            }
          />
        </div>
      </PopUpWrapper>
    </div>
  );
}
