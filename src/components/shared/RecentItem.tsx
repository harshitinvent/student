import { Link, type To } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import { ClockIcon, CenterFocusIcon } from '@hugeicons/core-free-icons';
import CustomIcon from './icons/CustomIcon';

export default function RecentItem({
  title,
  to,
}: {
  title: string;
  to?: To;
  visitedAt?: Date;
}) {
  return (
    <Link
      to={to || '/'}
      className={
        'group/item hover:shadow-s1 hover:bg-bgNavigate hover:border-linePr rounded-16 flex min-h-80 items-center justify-between gap-20 border border-transparent px-12 py-16 transition-colors duration-300 max-md:min-h-66 max-md:py-12'
      }
    >
      <div className={'flex items-center gap-20'}>
        <div
          className={
            'rounded-8 bg-bgNavigate text-iconSec group-hover/item:shadow-s1 flex size-40 shrink-0 items-center justify-center duration-300 group-hover/item:bg-white'
          }
        >
          <HugeiconsIcon className={'size-20'} icon={CenterFocusIcon} />
        </div>
        <div>
          <p className={'text-textHeadline text-16 leading-16 font-semibold'}>
            {title}
          </p>
          <p
            className={
              'text-textDescription text-14 mt-6 flex items-center gap-8'
            }
          >
            <HugeiconsIcon
              className={'text-iconSec size-16'}
              icon={ClockIcon}
            />
            <span>2 hours ago</span>
          </p>
        </div>
      </div>
      <div className={'text-iconSec size-24 shrink-0 -rotate-90'}>
        <CustomIcon className={'size-full'} icon={'chevron'} />
      </div>
    </Link>
  );
}
