import { Outlet } from 'react-router';

import Sidebar from '../components/global/Sidebar';
import Header from '../components/global/Header';
import MobileHeader from '../components/global/MobileHeader';

export default function DefaultLayout() {
  return (
    <div
      className={
        'bg-bgPr h-screen overflow-hidden max-md:flex max-md:flex-col max-md:pt-64 md:grid md:grid-cols-[auto_1fr] md:grid-rows-[5rem_1fr]'
      }
    >
      <Sidebar />

      <Header />
      <MobileHeader />

      <div
        className={
          'h-full overflow-y-auto max-md:flex max-md:flex-1 max-md:flex-col'
        }
      >
        <Outlet />
      </div>
    </div>
  );
}
