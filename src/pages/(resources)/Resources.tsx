import { useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashedLineCircleIcon,
  FileAttachmentIcon,
  SearchIcon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import Filter from '../../components/shared/Filter';
import Tabs from '../../components/shared/Tabs';
import Table from '../../components/features/Table';
import Button from '../../components/shared/Button';
import { Link } from 'react-router';
import IconCard from '../../components/shared/icons/IconCard';
import StatusTag from '../../components/shared/StatusTag';
import { useUserContext } from '../../providers/user';

const titles = [
  {
    title: 'Name',
  },
  {
    title: 'Text',
  },
  {
    title: 'Text',
  },
  {
    title: 'Text',
  },
];
const tableContent = [
  {
    doc: {
      title: 'Student_Guide_2025.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'green',
    },
    status: 'success',
    date: '08/12/2025',
  },

  {
    doc: {
      title: 'Course_Handbook.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'blue',
    },
    status: 'success',
    date: '08/12/2025',
  },
  {
    doc: {
      title: 'Learning_Plan_Sem1.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'orange',
    },
    status: 'success',
    date: '08/12/2025',
  },
  {
    doc: {
      title: 'Learning_Plan_Sem1.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'red',
    },
    status: 'success',
    date: '08/12/2025',
  },
  {
    doc: {
      title: 'Course_Handbook.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'blue',
    },
    status: 'success',
    date: '08/12/2025',
  },
  {
    doc: {
      title: 'Learning_Plan_Sem1.pdf',
      subtitle: 'Create or edit your study notes',
      iconColor: 'orange',
    },
    status: 'success',
    date: '08/12/2025',
  },
];

export default function ResourcesPage() {
  const { type } = useUserContext();

  const [activeTab, setActiveTab] = useState<'Daily' | 'Monthly'>('Daily');

  return (
    <div>
      <PageTitleArea title={'Resources'}>
        <div className={'flex items-center justify-end gap-16 max-md:gap-8'}>
          <Filter />
          <div
            className={
              'rounded-12 bg-bgNavigate border-linePr flex size-40 cursor-pointer items-center justify-center border'
            }
          >
            <div
              className={
                'hover:border-linePr shadow-s1 rounded-8 bg-bgSec flex size-32 items-center justify-center border border-transparent duration-300'
              }
            >
              <HugeiconsIcon
                className={'text-textDescription size-16'}
                icon={SearchIcon}
              />
            </div>
          </div>

          {/*<Tabs*/}
          {/*  tabsList={['Daily', 'Monthly']}*/}
          {/*  activeTab={activeTab}*/}
          {/*  onTabChange={(tab) => {*/}
          {/*    setActiveTab(tab as 'Daily' | 'Monthly');*/}
          {/*  }}*/}
          {/*/>*/}
          {type !== 'Student' && (
            <Link to={'/canvas/12'}>
              <Button style={'gray'}>Upload document</Button>
            </Link>
          )}
        </div>
      </PageTitleArea>

      <div className={'px-24 pb-24 max-md:px-16'}>
        <Table titles={titles}>
          {tableContent.map(({ doc, status, date }, index) => (
            <div key={'table-row-' + index}>
              <div className={'flex items-center gap-12'}>
                <Link to={'/course/1'}>
                  <IconCard
                    size={'sm'}
                    color={
                      doc.iconColor as
                        | 'green'
                        | 'blue'
                        | 'orange'
                        | 'red'
                        | undefined
                    }
                    icon={FileAttachmentIcon}
                  />
                </Link>
                <div className={'flex-1 overflow-hidden'}>
                  <Link
                    className={
                      'text-14 text-textPr w-full overflow-hidden font-medium text-ellipsis transition-opacity duration-300 hover:opacity-80'
                    }
                    to={'/course/1'}
                  >
                    {doc.title}
                  </Link>

                  <p
                    className={
                      'text-body-m text-textDescription mt-2 font-medium'
                    }
                  >
                    {doc.subtitle}
                  </p>
                </div>
              </div>
              <div
                className={
                  'max-md:mt-24 max-md:flex max-md:min-h-32 max-md:items-center max-md:justify-between'
                }
              >
                <p
                  className={
                    'text-14 text-textDescription font-medium md:hidden'
                  }
                >
                  {titles[1].title}
                </p>

                <div
                  className={
                    'rounded-10 bg-bgInput text-textDescription flex size-32 items-center justify-center'
                  }
                >
                  <HugeiconsIcon
                    className={'size-20'}
                    icon={DashedLineCircleIcon}
                  />
                </div>
              </div>
              <div
                className={
                  'max-md:mt-16 max-md:flex max-md:min-h-32 max-md:items-center max-md:justify-between'
                }
              >
                <p
                  className={
                    'text-14 text-textDescription font-medium md:hidden'
                  }
                >
                  {titles[2].title}
                </p>
                <StatusTag icon>Done</StatusTag>
              </div>
              <div
                className={
                  'max-md:mt-16 max-md:flex max-md:min-h-32 max-md:items-center max-md:justify-between'
                }
              >
                <p
                  className={
                    'text-14 text-textDescription font-medium md:hidden'
                  }
                >
                  {titles[3].title}
                </p>
                <p className={'text-textSecondary text-14 font-medium'}>
                  08/12/2025
                </p>
              </div>
            </div>
          ))}
        </Table>
      </div>
    </div>
  );
}
