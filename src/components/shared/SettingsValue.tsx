import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon, PenIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import Toggle from './Toggle';

type SettingValueProps =
  | {
      type?: 'input';
      value?: string;
      onChange?: (value: string) => void;
      hideValue?: boolean;
      changeable?: boolean;
      disabled?: boolean;
    }
  | { type?: 'toggle'; value?: boolean; onChange?: () => void };

export default function SettingValue({
  label,
  description,
  children,
  className,
  ...props
}: SettingValueProps & {
  label: string;
  description?: string;

  children?: React.ReactNode;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputDisabled, setInputDisabled] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(
    typeof props.value === 'string' ? props.value : ''
  );

  useEffect(() => {
    if (!inputDisabled && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled, inputRef]);

  return (
    <div
      className={`flex w-full items-center justify-between gap-12 md:px-24 ${className}`}
    >
      <div>
        <p className={'text-body-m text-textHeadline font-medium'}>{label}</p>
        {description && (
          <p className={'text-textDescription text-body-m mt-4 font-medium'}>
            {description}
          </p>
        )}
      </div>

      {props.type && (
        <div className={'flex items-center justify-end gap-8'}>
          {props.type === 'input' && props.value !== undefined && (
            <>
              <input
                ref={inputRef}
                disabled={props.disabled || inputDisabled}
                type={props.hideValue ? 'password' : 'text'}
                className={`text-body-m text-textHeadline outline-linePr inline-block w-fit min-w-auto p-0 p-4 text-right font-medium ${
                  props.disabled ? 'opacity-30' : ''
                }`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <div className={'flex items-center gap-8'}>
                {props.changeable && (
                  <>
                    {inputDisabled ? (
                      <button
                        className={
                          'rounded-4 hover:bg-bgInput text-iconSec flex size-32 cursor-pointer items-center justify-center duration-300'
                        }
                        onClick={() => {
                          setInputDisabled(false);
                        }}
                      >
                        <HugeiconsIcon className={'size-20'} icon={PenIcon} />
                      </button>
                    ) : (
                      <>
                        <button
                          className={
                            'rounded-4 hover:bg-bgIcon2 text-iconGreen/80 flex size-32 cursor-pointer items-center justify-center duration-300'
                          }
                          onClick={() => {
                            props.onChange?.(inputValue);
                            setInputDisabled(true);
                          }}
                        >
                          <HugeiconsIcon
                            className={'size-20'}
                            icon={Tick02Icon}
                          />
                        </button>

                        <button
                          className={
                            'rounded-4 hover:bg-bgIcon3 text-iconRed flex size-32 cursor-pointer items-center justify-center duration-300'
                          }
                          onClick={() => {
                            setInputValue(props.value!);
                            setInputDisabled(true);
                          }}
                        >
                          <HugeiconsIcon
                            className={'size-20'}
                            icon={CancelIcon}
                          />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {props.type === 'toggle' && props.value !== undefined && (
            <Toggle
              isActive={props.value}
              onToggle={() => {
                props.onChange?.();
              }}
            />
          )}
        </div>
      )}

      {children}
    </div>
  );
}
