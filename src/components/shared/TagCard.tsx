import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Link, type To } from 'react-router';

export default function TagCard({
  title,
  description,
  to,
  icon: Icon,
}: {
  to?: To;
  title: string;
  description: string;
  icon: IconSvgElement;
}) {
  return (
    <Link
      to={to || '/'}
      className={
        'bg-bgSec rounded-16 border-linePr hover:shadow-s1 relative flex cursor-pointer items-center gap-16 border p-8 pr-16 duration-300 max-md:h-80 max-md:min-w-227'
      }
    >
      <div
        className={
          'bg-bgIcon2 text-iconGreen rounded-8 shadow-s1 m flex size-64 shrink-0 items-center justify-center'
        }
      >
        <HugeiconsIcon icon={Icon} className={'size-32'} />
      </div>
      <div>
        <p className={'text-16 text-textHeadline font-semibold'}>{title}</p>
        <p className={'text-body-m text-textDescription mt-4 font-medium'}>
          {description}
        </p>
      </div>

      {to && (
        <hr
          className={
            'bg-iconGreen/80 absolute top-12 right-12 size-8 rounded-full border-none outline-none'
          }
        />
      )}
    </Link>
  );
}
