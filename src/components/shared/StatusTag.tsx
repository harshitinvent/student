import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Tick02Icon,
  SearchIcon,
  CancelIcon,
  DashedLineCircleIcon,
} from '@hugeicons/core-free-icons';

export type StatusType = 'success' | 'pending' | 'error' | 'draft';

export default function StatusTag({
  icon = false,
  status = 'success',
  className = '',
  children,
}: {
  icon?: boolean | IconSvgElement;
  status?: StatusType;
  className?: string;
  children?: React.ReactNode;
}) {
  const styleClasses = {
    success: 'text-iconGreen/80 bg-bgIcon2',
    pending: 'text-iconBlue bg-bgIcon1',
    error: 'text-iconRed bg-bgIcon3',
    draft: 'text-textHeadline bg-bgInput',
  }[status];

  return (
    <div
      className={`text-body-l rounded-8 flex h-32 w-fit items-center gap-4 px-8 font-medium shadow-[0_0_0.25rem_rgba(18,18,18,0.1)] ${styleClasses} ${className}`}
    >
      {icon &&
        (typeof icon === 'boolean' ? (
          <>
            {status === 'success' && (
              <HugeiconsIcon className={'size-16'} icon={Tick02Icon} />
            )}
            {status === 'pending' && (
              <HugeiconsIcon className={'size-16'} icon={SearchIcon} />
            )}
            {status === 'error' && (
              <HugeiconsIcon className={'size-16'} icon={CancelIcon} />
            )}
            {status === 'draft' && (
              <HugeiconsIcon
                className={'text-textDescription size-16'}
                icon={DashedLineCircleIcon}
              />
            )}
          </>
        ) : (
          <HugeiconsIcon className={'size-16'} icon={icon} />
        ))}
      {children && <p>{children}</p>}
    </div>
  );
}
