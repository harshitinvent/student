import PageTitleArea from '../components/shared/PageTitleArea';
import { Outlet } from 'react-router';
import NavigationItem from '../components/shared/NavigationItem';
import {
  SettingsIcon,
  SquareLock02Icon,
  NotificationIcon,
  UserIcon,
  CpuIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { useUserContext } from '../providers/user';
import CustomIcon from '../components/shared/icons/CustomIcon';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '../utils/hooks/useClickOutside';

type SettingNavType = {
  id: number | string;
  name: string;
  icon: IconSvgElement;
  path: string;
};

const studentSettingsNavList: SettingNavType[] = [
  {
    id: 1,
    name: 'General',
    icon: SettingsIcon,
    path: '/settings',
  },
  {
    id: 2,
    name: 'Security',
    icon: SquareLock02Icon,
    path: '/settings/security',
  },
  {
    id: 3,
    name: 'Notifications',
    icon: NotificationIcon,
    path: '/settings/notifications',
  },
];

const adminSettingsNavList = [
  {
    id: 1,
    name: 'Personal',
    icon: UserIcon,
    path: '/settings',
  },
  {
    id: 2,
    name: 'Security',
    icon: SquareLock02Icon,
    path: '/settings/security',
  },
  {
    id: 3,
    name: 'AI knowledge base',
    icon: CpuIcon,
    path: '/settings/ai-base',
  },
];

export default function SettingsLayout() {
  const { type } = useUserContext();

  return (
    <div className={'flex h-full flex-col'}>
      <PageTitleArea
        className={'border-linePr md:border-b'}
        title={'Settings'}
      />

      <div className={'grid md:flex-1 md:grid-cols-[11.25rem_1fr]'}>
        <div className={'border-linePr h-full border-r p-12'}>
          {type === 'Student' ? (
            <>
              <div className={'flex flex-col gap-2 max-md:hidden'}>
                {studentSettingsNavList.map(({ id, name, icon, path }) => (
                  <NavigationItem
                    key={`setting-nav-link-${id}`}
                    id={id}
                    end
                    name={name}
                    icon={icon}
                    path={path}
                    isOpenedAccordion={false}
                    onToggleAccordion={() => {}}
                  />
                ))}
              </div>

              <NavigationSettingsDropdown
                list={studentSettingsNavList}
                className={'md:hidden'}
              />
            </>
          ) : (
            <>
              <div className={'flex flex-col gap-2 max-md:hidden'}>
                {adminSettingsNavList.map(({ id, name, icon, path }) => (
                  <NavigationItem
                    key={`setting-nav-link-${id}`}
                    id={id}
                    end
                    name={name}
                    icon={icon}
                    path={path}
                    isOpenedAccordion={false}
                    onToggleAccordion={() => {}}
                  />
                ))}
              </div>

              <NavigationSettingsDropdown
                list={adminSettingsNavList}
                className={'md:hidden'}
              />
            </>
          )}
        </div>
        <div className={'max-md:px-16'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function NavigationSettingsDropdown({
  list,
  className = '',
}: {
  list: SettingNavType[];
  className?: string;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
    },
    isOpen,
    buttonRef
  );

  return (
    <div className={`relative z-49 ${className}`}>
      <div
        ref={buttonRef}
        className={
          'bg-bgNavigate rounded-12 border-linePr relative flex cursor-pointer items-center border'
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={'pointer-events-none select-none'}>
          {list.map(({ id, name, icon, path }) => (
            <NavigationItem
              key={`setting-nav-link-${id}`}
              id={id}
              end
              name={name}
              icon={icon}
              path={path}
              isOpenedAccordion={false}
              onToggleAccordion={() => {}}
              className={'not-has-[.active]:hidden'}
            />
          ))}
        </div>
        <div className={'absolute right-12'}>
          <CustomIcon className={'size-16'} icon={'chevron'} />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`rounded-16 absolute top-[calc(100%+0.25rem)] w-full min-w-171 origin-top-left border border-[#ECECEC] bg-[#FCFCFC] shadow-[0_9.5625rem_3.8125rem_rgba(0,0,0,0.01),0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_2.375rem_2.375rem_rgba(0,0,0,0.06),0_0.625rem_1.6875rem_rgba(0,0,0,0.07)] duration-300 select-none ${
          isOpen ? '' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <ul className={'grid gap-4 p-8'}>
          {list.map(({ id, name, icon, path }) => (
            <li key={`setting-nav-link-${id}`} onClick={() => setIsOpen(false)}>
              <NavigationItem
                id={id}
                end
                name={name}
                icon={icon}
                path={path}
                isOpenedAccordion={false}
                onToggleAccordion={() => {}}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
