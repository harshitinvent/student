import { useState } from 'react';

import RevenueChart from '../features/RevenueChart';
import CardWrapper from '../shared/wrappers/CardWrapper';
import Tabs from '../shared/Tabs';

export default function RevenuePanel() {
  const [activeTab, setActiveTab] = useState<string>('Daily');

  return (
    <CardWrapper className={'p-12 pb-32 max-md:pb-16'}>
      <CardWrapper.TitleArea
        title={
          <div>
            <p className={'text-textHeadline text-h6 font-medium'}>
              $40,206.20
            </p>
            <p className={'text-body-xs text-textDescription'}>
              Total Revenue{' '}
            </p>
          </div>
        }
        className={'pl-20 max-md:px-8'}
      >
        <Tabs
          tabsList={[
            {
              id: 'Daily',
            },
            {
              id: 'Monthly',
            },
          ]}
          activeTabId={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          className={'mt-12 w-full'}
        />
      </CardWrapper.TitleArea>

      <div className={'mt-40 h-300 px-20 max-md:pr-8 max-md:pl-0'}>
        {activeTab === 'Daily' && (
          <RevenueChart
            data={[
              {
                name: 'Apr',
                revenue: 0,
              },
              {
                name: 'May',
                revenue: 52480,
              },
              {
                name: 'Jun',
                revenue: 100,
              },
              {
                name: 'Jul',
                revenue: 30000,
              },
              {
                name: 'Aug',
                revenue: 100000,
              },
              {
                name: 'Sep',
                revenue: 10000,
              },
            ]}
          />
        )}

        {activeTab === 'Monthly' && (
          <RevenueChart
            data={[
              {
                name: 'Apr',
                revenue: 100000,
              },
              {
                name: 'May',
                revenue: 52480,
              },
              {
                name: 'Jun',
                revenue: 25000,
              },
              {
                name: 'Jul',
                revenue: 30000,
              },
              {
                name: 'Aug',
                revenue: 100000,
              },
              {
                name: 'Sep',
                revenue: 10000,
              },
            ]}
          />
        )}
      </div>
    </CardWrapper>
  );
}
