import { type ReactNode } from 'react';

export default function PageTitleArea({
  title,
  subtitle,
  action,
  className = '',
  children,
}: {
  title?: string | ReactNode;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex min-h-72 items-center justify-between px-48 py-16 max-md:min-h-60 max-md:px-16 ${className}`}
    >
      <div>
      {title &&
        (typeof title === 'string' ? (
          <h1
            className={'text-h5 text-textHeadline max-md:text-h6 font-medium'}
          >
            {title}
          </h1>
        ) : (
          title
        ))}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-4">{subtitle}</p>
        )}
      </div>

      {action && <div>{action}</div>}

      {children}
    </div>
  );
}
