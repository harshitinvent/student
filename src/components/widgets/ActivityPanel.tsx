import { useState } from 'react';

import ActivityChart from '../features/ActivityChart';
import CardWrapper from '../shared/wrappers/CardWrapper';
import Tabs from '../shared/Tabs';

export default function ActivityPanel() {
  const [activeTab, setActiveTab] = useState<string>('Daily');

  return (
    <CardWrapper className={'p-12 pb-32'}>
      <CardWrapper.TitleArea title={'Activity'} className={''}>
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
          className={'mt-4 w-full'}
        />
      </CardWrapper.TitleArea>

      <div className={'-mx-12 mt-40 h-288'}>
        {activeTab === 'Daily' && (
          <ActivityChart
            data={[
              { name: 'Mon', Mathematics: 80, Physics: 70, Chemistry: 50 },
              { name: 'Tue', Mathematics: 50, Physics: 90, Chemistry: 60 },
              { name: 'Wed', Mathematics: 75, Physics: 90, Chemistry: 45 },
              { name: 'Thu', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Fri', Mathematics: 90, Physics: 60, Chemistry: 55 },
            ]}
          />
        )}

        {activeTab === 'Monthly' && (
          <ActivityChart
            data={[
              { name: 'Jan', Mathematics: 80, Physics: 70, Chemistry: 50 },
              { name: 'Feb', Mathematics: 50, Physics: 90, Chemistry: 60 },
              { name: 'Mar', Mathematics: 75, Physics: 90, Chemistry: 45 },
              { name: 'Apr', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'May', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Jun', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Jul', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Aug', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Sep', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Oct', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Nov', Mathematics: 60, Physics: 80, Chemistry: 70 },
              { name: 'Dec', Mathematics: 60, Physics: 80, Chemistry: 70 },
            ]}
          />
        )}
      </div>
    </CardWrapper>
  );
}
