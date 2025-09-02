import NotificationItem from '../shared/NotificationItem';

export default function NotificationList({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <NotificationItem />
      <NotificationItem />
      <NotificationItem />
      <NotificationItem />
      <NotificationItem />
      <NotificationItem />
    </div>
  );
}
