import { useState } from 'react';

import { useUserContext } from '../../providers/user';
import SettingValue from '../../components/shared/SettingsValue';
import Button from '../../components/shared/Button';
import SettingsWrapper from '../../components/shared/wrappers/SettingsWrapper';
import Toggle from '../../components/shared/Toggle';

export default function SecuritySettings() {
  const { type } = useUserContext();

  const [password, setPassword] = useState<string>('Password123');
  const [mulityFactor, setMulityFactor] = useState<boolean>(true);

  return type === 'Student' ? (
    <div>
      <div
        className={
          'border-linePr flex h-60 items-center justify-between border-b md:px-24'
        }
      >
        <p className={'text-h6 text-textHeadline font-medium'}>Security</p>
      </div>

      <div className={'w-full overflow-hidden'}>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            type={'input'}
            hideValue
            value={password}
            onChange={(value) => setPassword(value)}
            label={'Password'}
            changeable={true}
          />
        </div>
        <div className={'border-linePr border-b py-16'}>
          <SettingValue
            type={'toggle'}
            value={mulityFactor}
            onChange={() => setMulityFactor(!mulityFactor)}
            label={'Multi-factor authentication'}
          />
        </div>

        <div className={'py-16'}>
          <SettingValue
            label={'Log out of all devices'}
            description={'Sign out from all devices.'}
          >
            <Button style={'gray'}>Log out all</Button>
          </SettingValue>
        </div>
      </div>
    </div>
  ) : (
    <div className={'flex flex-col items-center md:px-24'}>
      <SettingsWrapper
        title={'Security'}
        subtitle={'Manage your account information.'}
      >
        <SocialAccount type={'google'} />
        <SocialAccount type={'gmail'} />
        <SocialAccount type={'apple'} />
      </SettingsWrapper>
    </div>
  );
}

export function SocialAccount({
  type,
}: {
  type: 'google' | 'gmail' | 'apple';
}) {
  const data = {
    google: {
      iconSrc: '/assets/google.svg',
      title: 'Google',
      subtitle: 'Connect your google account',
      href: 'https://www.google.com/',
      isActive: true,
    },
    gmail: {
      iconSrc: '/assets/gmail.svg',
      title: 'Gmail',
      subtitle: 'Connect your gmail account',
      href: 'https://www.google.com/',
      isActive: false,
    },
    apple: {
      iconSrc: '/assets/apple.svg',
      title: 'Apple',
      subtitle: 'Connect your apple account',
      href: 'https://www.google.com',
      isActive: true,
    },
  }[type];

  const [isActive, setIsActive] = useState<boolean>(data.isActive);

  return (
    <div
      className={
        'flex items-center justify-between gap-16 py-16 max-md:px-8 md:px-24'
      }
    >
      <div className={'flex items-start justify-start gap-6'}>
        <img
          className={'block size-24 shrink-0'}
          src={data.iconSrc}
          alt="account"
        />
        <div>
          <p className={'text-16 font-semibold'}>{data.title}</p>
          <p className={'text-body-m text-textDescription mt-4 font-medium'}>
            {data.subtitle}
          </p>
        </div>
      </div>

      <div className={'flex items-center justify-end gap-16'}>
        <a
          className={
            'text-textDescription text-body-l hover:text-textHeadline font-semibold transition-colors duration-300'
          }
          href={data.href}
        >
          Learn more
        </a>
        <Toggle
          isActive={isActive}
          onToggle={() => {
            setIsActive(!isActive);
          }}
        />
      </div>
    </div>
  );
}
