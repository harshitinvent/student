import { useState } from 'react';

import SettingValue from '../../components/shared/SettingsValue';
import Button from '../../components/shared/Button';

export default function NotificationsSettings() {
  const [notification1, setNotification1] = useState(false);
  const [notification2, setNotification2] = useState(false);
  const [notification3, setNotification3] = useState(false);

  return (
    <div>
      <div
        className={
          'border-linePr flex h-60 items-center justify-between border-b md:px-24'
        }
      >
        <p className={'text-h6 text-textHeadline font-medium'}>Notifications</p>
      </div>

      <div className={'w-full'}>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            label={'Notifications'}
            type={'toggle'}
            value={notification1}
            onChange={() => {
              setNotification1(!notification1);
            }}
          />
        </div>

        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            label={'Notifications'}
            type={'toggle'}
            value={notification2}
            onChange={() => {
              setNotification2(!notification2);
            }}
          />
        </div>

        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            label={'Notifications'}
            type={'toggle'}
            value={notification3}
            onChange={() => {
              setNotification3(!notification3);
            }}
          />
        </div>
      </div>
    </div>
  );
}
