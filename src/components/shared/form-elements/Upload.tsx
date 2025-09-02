import { useRef } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import { Upload04Icon } from '@hugeicons/core-free-icons';

export default function Upload({ className = '' }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div
      className={`text-bgPr rounded-16 border-bgInput flex flex-col items-center border border-dashed p-24 ${className}`}
    >
      <input
        ref={inputRef}
        className={'pointer-events-none absolute opacity-0 select-none'}
        type="file"
      />
      <HugeiconsIcon
        icon={Upload04Icon}
        className={'text-iconSec mb-8 size-20'}
      />
      <p className={'text-body-m text-textDescription text-center font-medium'}>
        Drag files here to upload <br />
        <button
          className={
            'text-textHeadline hover:text-iconBlue cursor-pointer duration-300'
          }
          onClick={() => {
            if (inputRef.current) inputRef.current.click();
          }}
        >
          or browse for files
        </button>
      </p>
    </div>
  );
}
