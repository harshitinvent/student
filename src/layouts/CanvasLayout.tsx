import { Outlet } from 'react-router';

export default function CanvasLayout() {
  return (
    <div className={'h-screen w-screen overflow-hidden bg-[#F8F7F7] md:px-20'}>
      <Outlet />
    </div>
  );
}
