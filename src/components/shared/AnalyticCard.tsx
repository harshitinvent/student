import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp02Icon } from '@hugeicons/core-free-icons';
import CardWrapper from './wrappers/CardWrapper';

export default function AnalyticCard({
  title,
  number,
  percent,
  positive,
}: {
  title: string;
  number: number | string;
  percent: number | string;
  positive: boolean;
}) {
  return (
    <CardWrapper className={'p-24 max-md:p-16'}>
      <h3 className={'text-h6 max-md:text-18 font-medium'}>{title}</h3>

      <div className={'mt-24 flex items-end justify-between gap-16'}>
        <div>
          <p className={'text-h3 text-textHeadline max-md:text-h5'}>{number}</p>
          <p
            className={
              'text-textDescription text-body-l mt-16 flex items-center gap-8 font-medium'
            }
          >
            <span
              className={`text-body-l flex items-center gap-2 ${
                positive ? 'text-iconGreen/80' : 'text-iconRed'
              }`}
            >
              <HugeiconsIcon
                className={`size-20 ${positive ? '' : 'rotate-180'}`}
                icon={ArrowUp02Icon}
              />
              {percent}%
            </span>
            vs last month
          </p>
        </div>

        <div>
          <img
            className={'block h-auto max-h-56 w-auto max-w-112'}
            src={
              positive ? '/pic/chart-mini-inc.svg' : '/pic/chart-mini-dec.svg'
            }
            alt="chart"
          />
        </div>
      </div>
    </CardWrapper>
  );
}
