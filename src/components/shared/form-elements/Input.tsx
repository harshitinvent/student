export default function Input({
  label,
  size = 'sm',
  placeholder,
  isPassword,
  className = '',
}: {
  isPassword?: boolean;
  label?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
  className?: string;
}) {
  const sizeClasses = {
    md: 'rounded-12 h-48 px-16',
    sm: 'rounded-10 h-36 pr-10 pl-16',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {(label || isPassword) && (
        <p className={`mb-8 flex items-center justify-between gap-12`}>
          <span className={'text-body-m text-textHeadline font-medium'}>
            {label}
          </span>
          {isPassword && (
            <span
              className={
                'text-body-s text-textDescription hover:text-iconBlue cursor-pointer font-medium duration-300'
              }
            >
              Forgot password?
            </span>
          )}
        </p>
      )}
      <input
        type={isPassword ? 'password' : 'text'}
        placeholder={placeholder}
        className={`bg-bgNavigate border-linePr text-body-m group-hover/search:bg-neutral-5 transitions-colors text-textPr placeholder:text-textSecondary w-full border font-medium duration-300 outline-none group-hover/search:border-[#ECECEC] focus:border-[#E2E2E2] focus:bg-[#F1F1F1] focus:inset-shadow-[0_var(--spacing)_calc(var(--spacing)*3)_rgba(18,18,18,0.1)] ${sizeClasses}`}
      />
    </div>
  );
}
