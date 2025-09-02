import { useState } from 'react';

import SearchInput from '../shared/form-elements/SearchInput';
import NotificationWidget from '../widgets/NotificationWidget';

export default function Header() {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <div
      className={
        'border-linePr z-50 flex items-center justify-between border-b px-20 max-md:hidden'
      }
    >
      <SearchInput
        value={searchValue}
        onChange={(value) => {
          setSearchValue(value);
        }}
        onSubmit={() => {
          // console.log('Submit', searchValue);
        }}
        className={'w-216'}
      />

      <div className={'flex items-center gap-12'}>
        <NotificationWidget />
      </div>
    </div>
  );
}
