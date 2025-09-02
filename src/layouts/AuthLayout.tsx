import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className={'h-screen overflow-y-auto bg-[#FCFCFC]'}>
      <div
        className={
          'grid min-h-screen grid-cols-[1fr_1.1fr] gap-20 p-20 max-md:grid-cols-1'
        }
      >
        <div className={'h-full p-20 max-md:p-0'}>
          <Outlet />
        </div>

        <div
          className={
            'rounded-10 sticky top-20 h-[calc(100vh-2.5rem)] overflow-hidden max-md:hidden'
          }
        >
          <img
            className={'block size-full object-cover'}
            src="/pic/auth-pic.jpg"
            alt="auron"
          />
        </div>
      </div>
    </div>
  );
}
