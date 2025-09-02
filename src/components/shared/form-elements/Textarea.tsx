import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';

export default function Textarea({
  withAttachment,
  className = ' ',
}: {
  withAttachment?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative h-120 w-full ${className}`}>
      {withAttachment && (
        <button
          className={
            'rounded-12 border-linePr hover:shadow-s1 text-iconPr absolute top-12 left-12 flex size-40 cursor-pointer items-center justify-center border duration-300'
          }
        >
          <HugeiconsIcon className={'size-20'} icon={PlusSignIcon} />
        </button>
      )}

      <textarea
        className={`rounded-24 bg-bgPr border-linePr h-full w-full resize-none border p-20 outline-none ${withAttachment ? 'pl-60' : ''}`}
        placeholder={'Please inquire about anything...'}
      />

      <button
        className={
          'rounded-12 bg-buttonPr border-linePr shadow-s1 absolute top-12 right-12 flex size-40 cursor-pointer items-center justify-center border text-white duration-300 hover:bg-[#323232]'
        }
      >
        <HugeiconsIcon className={'size-20 rotate-90'} icon={ArrowLeft02Icon} />
      </button>
    </div>
  );
}
