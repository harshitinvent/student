import { useState } from 'react';
import {
  ClockIcon,
  SecurityValidationIcon,
  CancelIcon,
  Location01Icon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../components/shared/PageTitleArea';
import SummarySection from '../components/sections/admin-dashboard/SummarySection';
import Tabs from '../components/shared/Tabs';
import BoardSection from '../components/sections/admin-dashboard/BoardSection';
import Button from '../components/shared/Button';
import ReportsSection from '../components/sections/admin-dashboard/ReportsSection';
import ProjectsSection from '../components/sections/admin-dashboard/ProjectsSection';
import DirectorySection from '../components/sections/admin-dashboard/DirectorySection';
import TimelineSection from '../components/sections/admin-dashboard/TimelineSection';
import { HugeiconsIcon } from '@hugeicons/react';
import CreateEventModal from '../components/shared/modals/CreateEventModal';
import CreatePostModal from '../components/shared/modals/CreatePostModal';
import Avatar from '../components/shared/Avatar';

const tabs = [
  {
    id: 'Summary',
  },
  {
    id: 'Board',
  },
  {
    id: 'Reports',
  },
  {
    id: 'Timeline',
  },
  {
    id: 'Projects',
  },
  {
    id: 'Directory',
  },
];

export default function WhiteboardPage() {
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>(
    tabs[0].id
  );
  const [openedCreateTimelineModal, setOpenedCreateTimelineModal] =
    useState(false);
  const [openPostModal, setOpenPostModal] = useState<boolean>(false);

  return (
    <div className={'flex h-full flex-col pb-24'}>
      <PageTitleArea title={'Admin Whiteboard'} />
      <div className={'flex flex-1 flex-col px-24 py-16 max-md:px-0'}>
        <div
          className={
            'flex w-full justify-between gap-12 max-md:flex-col md:items-center'
          }
        >
          <div className={'max-md:overflow-x-auto max-md:px-16'}>
            <Tabs
              activeTabId={activeDashboardTab}
              onTabChange={(value) => setActiveDashboardTab(value)}
              tabsList={tabs}
              className={'w-fit'}
            />
          </div>

          <div className={'max-md:ml-auto max-md:px-16'}>
            {activeDashboardTab === 'Board' && (
              <Button
                onClick={() => {
                  setOpenPostModal(true);
                }}
              >
                Create Post
              </Button>
            )}
            {activeDashboardTab === 'Reports' && (
              <Button
                onClick={() => {
                  setOpenPostModal(true);
                }}
              >
                Create Reports
              </Button>
            )}
            {activeDashboardTab === 'Timeline' && (
              <Button onClick={() => setOpenedCreateTimelineModal(true)}>
                Create Timeline
              </Button>
            )}
            {activeDashboardTab === 'Projects' && (
              <Button
                onClick={() => {
                  setOpenPostModal(true);
                }}
              >
                Create Projects
              </Button>
            )}
          </div>
        </div>

        <div className={'mt-24 flex-1'}>
          {activeDashboardTab === 'Summary' && <SummarySection />}
          {activeDashboardTab === 'Board' && <BoardSection />}
          {activeDashboardTab === 'Reports' && <ReportsSection />}
          {activeDashboardTab === 'Timeline' && <TimelineSection />}
          {activeDashboardTab === 'Projects' && <ProjectsSection />}
          {activeDashboardTab === 'Directory' && <DirectorySection />}
        </div>

        {openPostModal && (
          <CreatePostModal
            onCancel={() => {
              setOpenPostModal(false);
            }}
            onSave={() => {
              setOpenPostModal(false);
            }}
          />
        )}

        {openedCreateTimelineModal && (
          <CreateEventModal
            onCancel={() => {
              setOpenedCreateTimelineModal(false);
            }}
            onSave={() => {
              setOpenedCreateTimelineModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function InvitedUserItem({ owner }: { owner?: boolean }) {
  return (
    <div className={'flex items-center justify-between gap-12 py-10'}>
      <div className={'flex items-center gap-12'}>
        <Avatar className={'size-32'} />

        <div className={'text-body-m font-medium'}>
          <p className={'text-textPr'}>Sam Dy</p>
          <p className={'text-textDescription'}>Organizer</p>
        </div>
      </div>

      <div className={'flex items-center gap-12'}>
        {owner ? (
          <>
            <p className={'text-body-xs text-textHeadline font-medium'}>
              Owner
            </p>
            <HugeiconsIcon
              className={'text-iconGreen size-12'}
              icon={SecurityValidationIcon}
            />
          </>
        ) : (
          <button className={'cursor-pointer border-none outline-none'}>
            <HugeiconsIcon
              className={'text-iconSec size-20'}
              icon={CancelIcon}
            />
          </button>
        )}
      </div>
    </div>
  );
}
