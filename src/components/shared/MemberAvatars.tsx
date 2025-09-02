import Avatar from './Avatar';

export default function MemberAvatars({
  size = 'md',
  className = '',
}: {
  size?: 'md' | 'sm';
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-start ${className}`}>
      <Avatar
        className={`relative z-1 shrink-0 border-2 border-[#FCFCFC] ${
          size == 'sm' ? 'size-24' : 'size-32'
        }`}
      />
      <Avatar
        className={`relative -ml-8 shrink-0 border-2 border-[#FCFCFC] ${
          size == 'sm' ? 'size-24' : 'size-32'
        }`}
      />
    </div>
  );
}
