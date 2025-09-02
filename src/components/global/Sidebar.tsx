import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, CoinsIcon } from '@hugeicons/core-free-icons';

import { type NavigationItemType } from '../../types/navigation';
import { NAVIGATION, NAVIGATION_ADMIN } from '../../constants/navigation';

import NavigationItem from '../shared/NavigationItem';
import CustomIcon from '../shared/icons/CustomIcon';
import LogoIcon from '../shared/icons/LogoIcon';
import Avatar from '../shared/Avatar';
import { useUserContext } from '../../providers/user';
import LogoutConfirmModal from '../shared/modals/LogoutConfirmModal';

export default function Sidebar() {
  const { type, setType, setIsAuthenticated, hasModuleAccess } = useUserContext();
  const navigate = useNavigate();
  const [activeAccordionId, setActiveAccordionId] = useState<
    NavigationItemType['id'] | null
  >(null);

  const [menuHidden, setMenuHidden] = useState<boolean>(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    console.log('Logging out user...');

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');

    // Clear user context
    setType(null);
    setIsAuthenticated(false);

    // Close modal
    setLogoutModalOpen(false);

    // Force page reload to clear all state
    window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  return (
    <div
      className={`border-linePr row-span-2 flex h-full flex-col justify-between overflow-hidden border-r p-20 pr-19 duration-300 max-md:hidden ${menuHidden ? 'w-80' : 'w-220'
        }`}
    >
      <div
        className={
          'relative flex w-full items-center justify-between py-4 pl-4 duration-300'
        }
      >
        <div className={`${menuHidden ? 'w-32' : 'w-100'}`}>
          <LogoIcon className={`min-w-100`} hideText={menuHidden} />
        </div>

        {/* Simple Chat Button */}
        {hasModuleAccess('chat') && !menuHidden && (
          <button
            onClick={() => navigate('/chat')}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs font-medium"
            title="Chat"
          >
            💬 Chat
          </button>
        )}



        <button
          className={`bg-bgSec rounded-4 border-linePr text-iconSec border-05 hover:bg-buttonSecHover absolute flex size-16 cursor-pointer items-center justify-center duration-300 ${menuHidden ? '-right-16' : 'right-0'
            }`}
          onClick={() => {
            setMenuHidden(!menuHidden);
            setActiveAccordionId(null);
          }}
        >
          <CustomIcon
            icon={'arrow'}
            className={`duration-300 ${menuHidden ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      <div className={'relative flex-1 overflow-hidden'}>
        <div
          className={
            'absolute inset-x-0 top-0 z-2 h-20 bg-linear-to-b from-white to-white/0'
          }
        ></div>

        <div
          className={
            'absolute inset-x-0 bottom-0 z-2 h-20 bg-linear-to-t from-white to-white/0'
          }
        ></div>

        <div
          className={`relative flex max-h-full flex-col gap-2 overflow-y-auto overscroll-none py-20 duration-300 ${menuHidden ? 'w-40' : 'w-full'}`}
        >


          {type === 'Admin'
            ? NAVIGATION_ADMIN &&
            NAVIGATION_ADMIN.filter(item => {
              const hasAccess = hasModuleAccess(String(item.id));
              // console.log('Checking module access for:', item.id, 'Result:', hasAccess);
              // Check if user has access to this module
              if (item.id === 'home') return hasModuleAccess('dashboard');
              if (item.id === 'departments') return hasModuleAccess('departments');
              if (item.id === 'students') return hasModuleAccess('students');
              if (item.id === 'teachers') return hasModuleAccess('teachers');
              if (item.id === 'program-management') return hasModuleAccess('program-management');
              if (item.id === 'course-management') return hasModuleAccess('course-management');
              if (item.id === 'assignments') return hasModuleAccess('assignments');
              if (item.id === 'financial-management') return hasModuleAccess('financial-management');
              if (item.id === 'financial-transactions') return hasModuleAccess('financial-transactions');
              if (item.id === 'vendor-management') return hasModuleAccess('vendor-management');
              if (item.id === 'invoice-management') return hasModuleAccess('invoice-management');
              if (item.id === 'user-management') return hasModuleAccess('user-management');
              if (item.id === 'role-management') return hasModuleAccess('role-management');
              if (item.id === 'accommodations') return hasModuleAccess('accommodations');
              if (item.id === 'calendar') return hasModuleAccess('calendar');
              if (item.id === 'chat') return hasModuleAccess('chat');
              if (item.id === 'settings') return hasModuleAccess('settings');
              if (item.id === 'reports') return hasModuleAccess('reports');
              if (item.id === 'whiteboard') return hasModuleAccess('whiteboard');
              if (item.id === 'canvas') return hasModuleAccess('whiteboard'); // Canvas uses whiteboard permission
              if (item.id === 'notifications') return hasModuleAccess('notifications');
              if (item.id === 'admissions') return hasModuleAccess('admissions');
              if (item.id === 'announcements') return hasModuleAccess('announcements');
              if (item.id === 'payment-reports') return hasModuleAccess('payment-reports');
              if (item.id === 'fee-structure') return hasModuleAccess('fee-structure');
              // Default to true for other items
              return true;
            }).map(
              (item) =>
                item.component && (
                  <NavigationItem
                    key={'nav-item-to-' + item.id}
                    {...item}
                    collapsed={menuHidden}
                    isOpenedAccordion={activeAccordionId === item.id}
                    onToggleAccordion={() => {
                      setActiveAccordionId(
                        activeAccordionId === item.id ? null : item.id
                      );
                    }}
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
                    collapsed={menuHidden}
                    isOpenedAccordion={activeAccordionId === item.id}
                    onToggleAccordion={() => {
                      setActiveAccordionId(
                        activeAccordionId === item.id ? null : item.id
                      );
                    }}
                  />
                )
            )}
        </div>
      </div>

      <div
        className={`border-linePr relative flex items-center justify-start overflow-hidden border-t pt-12 duration-300 ${menuHidden ? 'w-32 translate-x-4' : 'w-full'
          }`}
      >
        <div
          className={
            'relative z-2 flex flex-1 items-center gap-12 overflow-hidden'
          }
        >
          <Avatar className={'relative size-32 shrink-0'} />
          <div>
            <p
              className={`text-textHeadline text-14 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity duration-300 ${menuHidden ? 'opacity-0' : ''
                }`}
            >
              {type}
            </p>
            <p
              className={`text-iconGreen/80 text-body-m mt-4 font-medium transition-opacity duration-300 ${menuHidden ? 'opacity-0' : ''
                }`}
            >
              {type}
            </p>
          </div>
        </div>



        <button
          onClick={handleLogoutClick}
          className={`text-iconSec rounded-4 hover:bg-buttonSecHover flex size-32 items-center justify-center bg-white select-none ${menuHidden
            ? 'pointer-events-none ml-0 w-0 opacity-0 duration-100'
            : 'ml-12 shrink-0 duration-300'
            }`}
          title="Logout"
        >
          <HugeiconsIcon className={'size-20'} icon={ArrowRight02Icon} />
        </button>
      </div>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
