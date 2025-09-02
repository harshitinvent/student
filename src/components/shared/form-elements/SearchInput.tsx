import { HugeiconsIcon } from '@hugeicons/react';
import { SearchIcon } from '@hugeicons/core-free-icons';
import CustomIcon from '../icons/CustomIcon';

export default function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  className = '',
}: {
  placeholder?: string;

  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;

  className?: string;
}) {
  return (
    <div
      className={`rounded-12 group/search relative h-40 overflow-hidden ${className}`}
    >
      <form
        className={'flex size-full items-center'}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <button
          type={'button'}
          className={`rounded-8 text-textSecondary group-has-focus/search:bg-neutral-5 group-has-focus/search:shadow-s1 absolute left-4 flex size-32 cursor-pointer items-center justify-center duration-300 hover:bg-[#F1F1F1] ${
            value.length > 0 ? `bg-neutral-5 shadow-s1` : ''
          }`}
          onClick={() => onChange('')}
        >
          {value.length > 0 ? (
            <CustomIcon icon={'chevron'} className={'size-16 rotate-90'} />
          ) : (
            <HugeiconsIcon icon={SearchIcon} className={'size-16'} />
          )}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={
            'bg-bgNavigate border-linePr group-hover/search:bg-neutral-5 transitions-colors rounded-12 text-body-m text-textPr placeholder:text-textSecondary size-full border pr-10 pl-48 font-medium duration-300 outline-none group-hover/search:border-[#ECECEC] focus:border-[#E2E2E2] focus:bg-[#F1F1F1] focus:inset-shadow-[0_var(--spacing)_calc(var(--spacing)*3)_rgba(18,18,18,0.1)]'
          }
        />
      </form>
    </div>
  );
}
