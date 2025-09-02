import { useState } from 'react';

import SettingValue from '../../components/shared/SettingsValue';

export default function GeneralSettings() {
  const [fNameValue, setFNameValue] = useState<string>('FirstName');
  const [lNameValue, setLNameValue] = useState<string>('LastName');

  return (
    <div>
      <div
        className={
          'border-linePr flex h-60 items-center justify-between border-b md:px-24'
        }
      >
        <p className={'text-h6 text-textHeadline font-medium'}>General</p>
      </div>

      <div className={'w-full'}>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            type={'input'}
            value={fNameValue}
            onChange={(value) => setFNameValue(value)}
            label={'First name'}
            changeable={true}
          />
        </div>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            type={'input'}
            value={lNameValue}
            onChange={(value) => setLNameValue(value)}
            label={'Last name'}
            changeable={true}
          />
        </div>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            type={'input'}
            value={'email@email.email'}
            label={'Email'}
            disabled
          />
        </div>
        <div className={'py-16'}>
          <SettingValue
            type={'input'}
            value={'+1 000 000 000 '}
            label={'Phone number'}
          />
        </div>
      </div>
    </div>
  );
}
