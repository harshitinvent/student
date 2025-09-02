import Dropdown from '../../shared/Dropdown';
import { UserIcon } from '@hugeicons/core-free-icons';
import ActionRequestCard from '../../widgets/ActionRequestCard';
import DepartmentsSection from './DepartmentsSection';

const filter1 = ['All post', 'Post 1', 'Post 2', 'Post 3'];
const filter2 = ['My department', 'Post 1', 'Post 2', 'Post 3'];
const filter3 = ['Urgent', 'Post 1', 'Post 2', 'Post 3'];

export default function BoardSection() {
  return (
    <div className={'max-md:px-16'}>
      <div
        className={
          'flex items-center justify-start gap-16 max-md:grid max-md:grid-cols-3 max-md:gap-8'
        }
      >
        <Dropdown
          direction={'down'}
          icon={UserIcon}
          list={filter1}
          className={'min-w-131'}
        />

        <Dropdown
          direction={'down'}
          icon={UserIcon}
          list={filter2}
          className={'min-w-131'}
        />

        <Dropdown
          direction={'down'}
          icon={UserIcon}
          list={filter3}
          className={'min-w-131'}
        />
      </div>

      <div className={'mt-16 grid gap-16'}>
        <ActionRequestCard />
        <ActionRequestCard />
        <DepartmentsSection />
      </div>
    </div>
  );
}
