import React from 'react';
import { useUserContext } from '../../providers/user';
import { NavigationItemType } from '../../types/navigation';

interface PermissionBasedNavigationProps {
    navigationItems: NavigationItemType[];
    children: (filteredItems: NavigationItemType[]) => React.ReactNode;
}

export default function PermissionBasedNavigation({
    navigationItems,
    children,
}: PermissionBasedNavigationProps) {
    const { hasModuleAccess } = useUserContext();

    const filterNavigationByPermissions = (items: NavigationItemType[]): NavigationItemType[] => {
        return items.filter((item) => {
            // Always show home/dashboard
            if (item.id === 'home' || item.id === 'dashboard') {
                return true;
            }

            // Check if user has access to this module
            const moduleAccess = hasModuleAccess(item.id);
            if (!moduleAccess) {
                return false;
            }

            // Filter sublist items as well
            if (item.sublist) {
                const filteredSublist = item.sublist.filter((subItem) => {
                    // Map sublist items to modules (you may need to adjust this mapping)
                    const subModule = subItem.path?.split('/')[1] || subItem.name?.toLowerCase();
                    return hasModuleAccess(subModule);
                });

                // Only show parent item if it has accessible sublist items or no sublist
                if (filteredSublist.length === 0) {
                    return false;
                }

                return {
                    ...item,
                    sublist: filteredSublist,
                };
            }

            return true;
        });
    };

    const filteredItems = filterNavigationByPermissions(navigationItems);

    return <>{children(filteredItems)}</>;
} 