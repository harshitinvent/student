import { useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  GridViewIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import CatalogCard from '../../components/shared/CatalogCard';
import Filter from '../../components/shared/Filter';
import { StatusType } from '../../components/shared/StatusTag';
import { useUserContext } from '../../providers/user';
import CreateAssignmentModal from '../../components/shared/modals/CreateAssignmentModal';
import Tabs from '../../components/shared/Tabs';
import ToggleCatalogType from '../../components/shared/ToggleCatalogType';

const catalog = [
  {
    id: '1',
    imgUrl: '/pic/course-1.jpg',
    title: 'Introduction to Psychology',
    subtitle: '12 weeks',
    info: '(24 classes)',
    status: 'success',
  },
  {
    id: '2',
    imgUrl: '',
    previewColor: 'green',
    title: 'Camistry',
    subtitle: '12 weeks',
    info: '(24 classes)',
    status: 'pending',
  },
  {
    id: '3',
    imgUrl: '',
    previewColor: 'blue',
    title: 'Fundamentals of Marketing',
    subtitle: '10 weeks',
    info: '(20 classes)',
    status: 'error',
  },
  {
    id: '4',
    imgUrl: '',
    previewColor: 'orange',
    title: 'Fundamentals of Marketing',
    subtitle: '10 weeks',
    info: '(20 classes)',
    status: 'pending',
  },
  {
    id: '5',
    imgUrl: '',
    previewColor: 'red',
    title: 'Environmental Science & Sustainability ',
    subtitle: '12 weeks',
    info: '(24 classes)',
    status: 'pending',
  },
];

export default function AssignmentsPage() {
  const { type, catalogListType } = useUserContext();

  const [modalOpened, setModalOpened] = useState(false);

  const isTeacher = type === 'Teacher';

  return (
    <div>
      <PageTitleArea title={'Assignments'}>
        <div className={'flex items-center gap-16'}>
          {isTeacher && <Filter />}

          <ToggleCatalogType />
        </div>
      </PageTitleArea>

      <div
        className={`grid gap-12 px-24 py-16 max-md:px-16 ${
          catalogListType === 'Grid' ? 'md:grid-cols-4' : ''
        }`}
      >
        {catalog.map(
          ({ id, imgUrl, previewColor, title, subtitle, info, status }) => (
            <CatalogCard
              key={'assignment-card-' + id}
              to={isTeacher ? `/assignment/edit/${id}` : `/assignment/${id}`}
              imgUrl={imgUrl}
              previewColor={
                previewColor as
                  | 'gray'
                  | 'green'
                  | 'blue'
                  | 'orange'
                  | 'red'
                  | undefined
              }
              title={title}
              subtitle={subtitle}
              info={info}
              status={status as StatusType | undefined}
              isListType={catalogListType === 'List'}
            />
          )
        )}

        {isTeacher && (
          <>
            <div
              className={
                'bg-bgSec rounded-24 border-linePr grid cursor-pointer gap-8 border p-8 transition-shadow duration-300 hover:shadow-[0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_9.5625rem_3.8125rem_rgba(0,0,0,0.01)] max-md:min-h-180'
              }
              onClick={() => setModalOpened(true)}
            >
              <div
                className={
                  'rounded-16 bg-bgNavigate flex size-full items-center justify-center gap-16'
                }
              >
                <div
                  className={
                    'bg-bgInput rounded-10 text-iconSec flex size-36 items-center justify-center'
                  }
                >
                  <HugeiconsIcon className={'size-20'} icon={PlusSignIcon} />
                </div>
                <p className={'text-14 text-textHeadline font-medium'}>
                  Upload assignment
                </p>
              </div>
            </div>

            {modalOpened && (
              <CreateAssignmentModal onClose={() => setModalOpened(false)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
