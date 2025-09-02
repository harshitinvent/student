import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SmartPhone02Icon,
  Tablet02Icon,
  ComputerIcon,
} from '@hugeicons/core-free-icons';

import CardWrapper from '../shared/wrappers/CardWrapper';
import DevicesChart from '../features/DevicesChart';

const devicesAnalytics = [
  { name: 'Mobile', value: 1485, percent: '15.20' },
  { name: 'Tablet', value: 1700, percent: '17.1' },
  { name: 'Desktop', value: 8515, percent: '66.62' },
];

export default function DevicesPanel() {
  const [recentActiveChartCell, setRecentActiveChartCell] = useState<
    string | null
  >(null);

  return (
    <CardWrapper className={'p-12 pb-32 max-md:pb-16'}>
      <CardWrapper.TitleArea
        title={'Devices'}
        className={'px-12 max-md:px-0'}
      />

      <div className={'mt-32 flex flex-col items-center px-12 max-md:mt-8'}>
        <div className={'relative flex size-225 items-center justify-center'}>
          <div className={'relative z-1 size-full'}>
            <DevicesChart
              data={[
                ...devicesAnalytics.map(({ name, value }) => ({ name, value })),
              ]}
              onHover={(name) => {
                setRecentActiveChartCell(name);
              }}
            />
          </div>

          {recentActiveChartCell && (
            <div className={'absolute text-center'}>
              <p className={'text-h3 text-textHeadline font-medium'}>
                {
                  devicesAnalytics.find(
                    (i) => i.name === recentActiveChartCell
                  )!.percent
                }
                %
              </p>
              <p className={'text-body-m text-textSecondary font-semibold'}>
                {recentActiveChartCell}
              </p>
            </div>
          )}
        </div>

        <div className={'mt-32 grid w-full grid-cols-3'}>
          <div className={'flex items-start gap-8'}>
            <HugeiconsIcon
              className={'text-iconSec size-24'}
              icon={SmartPhone02Icon}
            />
            <div>
              <p className={'text-body-l text-textDescription mb-4'}>Mobile</p>
              <p className={'text-16 text-textHeadline font-semibold'}>
                15.20%
              </p>
            </div>
          </div>
          <div className={'flex items-start gap-8'}>
            <HugeiconsIcon
              className={'text-iconSec size-24'}
              icon={Tablet02Icon}
            />
            <div>
              <p className={'text-body-l text-textDescription mb-4'}>Tablet</p>
              <p className={'text-16 text-textHeadline font-semibold'}>17.1%</p>
            </div>
          </div>
          <div className={'flex items-start gap-8'}>
            <HugeiconsIcon
              className={'text-iconSec size-24'}
              icon={ComputerIcon}
            />
            <div>
              <p className={'text-body-l text-textDescription mb-4'}>Desktop</p>
              <p className={'text-16 text-textHeadline font-semibold'}>
                66.62%
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
