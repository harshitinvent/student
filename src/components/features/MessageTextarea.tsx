import {
  PlusSignIcon,
  MicIcon,
  ArrowUp02Icon,
} from '@hugeicons/core-free-icons';

import IconButton from '../shared/IconButton';

export default function MessageTextarea({
  buttonColor = 'light',
  size = 'md',
  placeholder,
  className = '',
  hideSubmitButton,
}: {
  hideSubmitButton?: boolean;
  buttonColor?: 'dark' | 'light';
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-24 relative z-1 w-full ${
        size === 'sm' ? 'h-64' : 'h-120'
      } ${className}`}
    >
      <textarea
        className={`border-linePr bg-bgSec rounded-24 block h-full w-full resize-none border outline-none ${
          size === 'sm' ? 'py-18 pr-100 pl-64' : 'p-20 pb-64'
        }`}
        placeholder={placeholder}
      ></textarea>
      <div
        className={
          'pointer-events-none absolute inset-x-12 bottom-12 z-1 flex items-center justify-between gap-24'
        }
      >
        <IconButton
          className={'!border-linePr pointer-events-auto bg-white'}
          icon={PlusSignIcon}
        />

        <div className={'pointer-events-auto flex gap-8'}>
          <IconButton icon={MicIcon} />
          {!hideSubmitButton && (
            <IconButton
              className={`shadow-s1 ${
                buttonColor === 'dark'
                  ? 'bg-buttonPr hover:bg-buttonPrHover text-white'
                  : 'bg-bgNavigate !border-[#D4D4D4]'
              }`}
              icon={ArrowUp02Icon}
            />
          )}
        </div>
      </div>
    </div>
  );
}
