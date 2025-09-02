import { useState } from 'react';
import { Link } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MenuIcon, CancelIcon } from '@hugeicons/core-free-icons';

import { NAVIGATION, NAVIGATION_ADMIN } from '../../constants/navigation';

import { useUserContext } from '../../providers/user';
import type { NavigationItemType } from '../../types/navigation';

import NavigationItem from '../shared/NavigationItem';
import Avatar from '../shared/Avatar';
import CustomIcon from '../shared/icons/CustomIcon';

export default function MobileHeader() {
  const { type } = useUserContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeAccordionId, setActiveAccordionId] = useState<
    NavigationItemType['id'] | null
  >(null);

  return (
    <div className={'fixed inset-x-0 top-0 z-50 md:hidden'}>
      <div
        className={
          'border-linePr bg-bgPr relative z-1 flex h-64 items-center justify-between border-b px-16'
        }
      >
        <Link className={'flex h-28'} to={'/'}>
          <img
            className={'block h-full w-auto'}
            src="/assets/logo.svg"
            alt="auron"
          />
        </Link>

        <button
          className={
            'text-textHeadline flex size-32 items-center justify-center'
          }
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <HugeiconsIcon className={'size-24'} icon={CancelIcon} />
          ) : (
            <HugeiconsIcon className={'size-24'} icon={MenuIcon} />
          )}
        </button>
      </div>

      <div
        className={`bg-bgPr absolute inset-x-0 top-0 flex h-screen flex-col items-stretch justify-between overflow-y-auto px-16 pt-64 pb-22 duration-500 ${
          menuOpen ? '' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`relative flex max-h-full flex-col gap-2 overflow-y-auto overscroll-none pt-24 pb-24`}
        >
          {type === 'Admin'
            ? NAVIGATION_ADMIN &&
              NAVIGATION_ADMIN.map(
                (item) =>
                  item.component && (
                    <NavigationItem
                      key={'nav-item-to-' + item.id}
                      {...item}
                      collapsed={false}
                      isOpenedAccordion={activeAccordionId === item.id}
                      onToggleAccordion={() => {
                        setActiveAccordionId(
                          activeAccordionId === item.id ? null : item.id
                        );
                      }}
                      onClick={() => setMenuOpen(false)}
                    />
                  )
              )
            : NAVIGATION &&
              NAVIGATION.map(
                (item) =>
                  item.component && (
                    <NavigationItem
                      key={'nav-item-to-' + item.id}
                      {...item}
                      collapsed={false}
                      isOpenedAccordion={activeAccordionId === item.id}
                      onToggleAccordion={() => {
                        setActiveAccordionId(
                          activeAccordionId === item.id ? null : item.id
                        );
                      }}
                      onClick={() => setMenuOpen(false)}
                    />
                  )
              )}
        </div>

        <div
          className={`border-linePr relative flex items-center justify-start overflow-hidden border-t pt-12`}
        >
          <div
            className={
              'relative z-2 flex flex-1 items-center gap-12 overflow-hidden'
            }
          >
            <Avatar className={'relative size-32 shrink-0'} />
            <div>
              <p
                className={`text-textHeadline text-14 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity`}
              >
                {type}
              </p>
              <p
                className={`text-iconGreen/80 text-body-m mt-4 font-medium transition-opacity`}
              >
                {type}
              </p>
            </div>
          </div>

          <Link
            to={'/login'}
            className={`text-iconSec rounded-4 hover:bg-buttonSecHover flex size-32 items-center justify-center bg-white select-none`}
          >
            <CustomIcon className={'size-20 -rotate-90'} icon={'chevron'} />
          </Link>
        </div>
      </div>
    </div>
  );
}
