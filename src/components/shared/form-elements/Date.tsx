export default function Date({
  label,
  value,
}: {
  label?: string;
  value: string;
}) {
  return (
    <div className={'rounded-12 border-linePr border px-12 py-10'}>
      {label && (
        <p className={'text-body-l text-textHeadline/80 mb-6 font-semibold'}>
          {label}
        </p>
      )}
      <p className={'text-16 text-textHeadline/80'}>{value}</p>
    </div>
  );
}
