import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { UnfoldMoreIcon } from '@hugeicons/core-free-icons';

export default function Table({
  tableConfig,
  titles,
  gridClassName,
  children,
}: {
  tableConfig?: {
    title?: string | React.ReactNode;
    content?: React.ReactNode;
  };
  titles: Array<{
    icon?: IconSvgElement;
    title: string | React.ReactNode;
    sortable?: boolean;
  }>;
  gridClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={'md:bg-bgSec md:rounded-16 md:border-linePr md:border md:p-8'}
    >
      {tableConfig && (
        <div
          className={
            'max-md:border-linePr mb-10 flex items-center justify-between gap-12 px-24 py-10 max-md:mb-16 max-md:border-b max-md:px-8 max-md:py-16'
          }
        >
          {tableConfig.title && (
            <p
              className={
                'text-h6 max-md:text-16 text-textHeadline font-medium max-md:font-semibold'
              }
            >
              {tableConfig.title}
            </p>
          )}

          {tableConfig.content}
        </div>
      )}

      <div
        className={`md:rounded-12 md:border-linePr grid items-center overflow-hidden md:border-b ${
          gridClassName ?? `md:grid-cols-${titles.length}`
        }`}
      >
        <div
          className={`grid max-md:hidden col-span-${titles.length} bg-bgNavigate grid-cols-subgrid items-center [&>*]:px-24 [&>*]:py-16`}
        >
          {titles.map(({ icon, title, sortable }, index) => (
            <div
              key={'table-th-' + index}
              className={'flex items-center gap-12'}
            >
              {icon && (
                <HugeiconsIcon className={'text-iconSec size-20'} icon={icon} />
              )}
              <p className={'text-14 font-medium'}>{title}</p>
              {sortable && (
                <HugeiconsIcon
                  className={'text-iconSec ml-auto size-16'}
                  icon={UnfoldMoreIcon}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className={`grid md:col-span-${titles.length} md:[&>*:nth-child(even)]:bg-bgPr items-center max-md:gap-12 md:grid-cols-subgrid md:[&>*]:grid md:[&>*]:col-span-${titles.length} max-md:[&>*]:bg-bgSec max-md:[&>*]:border-linePr md:[&>*]:border-linePr max-md:[&>*]:rounded-16 [&>*]:items-center max-md:[&>*]:border max-md:[&>*]:p-12 md:[&>*]:grid-cols-subgrid md:[&>*+*]:border-t md:[&>*>*]:px-24 md:[&>*>*]:py-16`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
