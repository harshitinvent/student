import { Link } from 'react-router';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft02Icon,
  PencilEditIcon,
  BookOpenIcon,
  FileAttachmentIcon,
  DashedLineCircleIcon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import IconCard from '../../components/shared/icons/IconCard';
import StatusTag from '../../components/shared/StatusTag';
import Table from '../../components/features/Table';
import Button from '../../components/shared/Button';
import { useUserContext } from '../../providers/user';
import { useState } from 'react';
import CreateEventModal from '../../components/shared/modals/CreateEventModal';

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
];

export default function CourseContentPage() {
  const { type } = useUserContext();

  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <PageTitleArea>
        <div
          className={'flex items-center gap-6 max-md:items-start max-md:gap-12'}
        >
          <Link
            to={'/courses'}
            className={
              'rounded-10 bg-bgNavigate text-iconSec hover:bg-bgSec hover:shadow-s1 flex size-40 cursor-pointer items-center justify-center duration-300'
            }
          >
            <HugeiconsIcon className={'size-20'} icon={ArrowLeft02Icon} />
          </Link>
          <div>
            <p className={'text-textHeadline text-h5 font-medium'}>
              Course content
            </p>
            <div
              className={
                'text-body-l text-textDescription mt-6 flex gap-16 font-medium'
              }
            >
              <span>12 weeks</span>
              <span>(24 classes)</span>
            </div>
          </div>
        </div>
      </PageTitleArea>

      <div className={'px-48 py-24 max-md:px-16'}>
        <div className={'grid gap-16 max-md:gap-12'}>
          <div
            className={
              'bg-bgSec border-linePr rounded-16 flex items-center justify-between gap-16 border p-8'
            }
          >
            <div className={'flex items-center gap-16'}>
              <IconCard size={'sm'} icon={PencilEditIcon} />
              <p className={'text-textHeadline text-h6 font-medium'}>
                Course announcments
              </p>
            </div>

            {type === 'Teacher' && (
              <Button
                style={'gray'}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Create announcment
              </Button>
            )}
          </div>

          <div
            className={
              'bg-bgSec border-linePr rounded-16 flex items-center justify-between gap-16 border p-8'
            }
          >
            <div className={'flex items-center gap-16'}>
              <IconCard size={'sm'} icon={BookOpenIcon} />
              <p className={'text-textHeadline text-h6 font-medium'}>Pols</p>
            </div>

            {type === 'Teacher' && (
              <Button
                style={'gray'}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Upload pols
              </Button>
            )}
          </div>
        </div>

        <div className={'mt-32 max-md:mt-24'}>
          <Table
            tableConfig={{
              title: 'Unit 1',
              content:
                type === 'Teacher' ? (
                  <Button
                    style={'gray'}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Upload documents
                  </Button>
                ) : (
                  <p className={'text-16 font-semibold'}>67% Complete</p>
                ),
            }}
            titles={titles}
          >
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

        <div className={'mt-32'}>
          <Table
            tableConfig={{
              title: 'Unit 1',
              content:
                type === 'Teacher' ? (
                  <Button
                    style={'gray'}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    Upload documents
                  </Button>
                ) : (
                  <p className={'text-16 font-semibold'}>67% Complete</p>
                ),
            }}
            titles={titles}
          >
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

      {openModal && (
        <CreateEventModal
          onCancel={() => setOpenModal(false)}
          onSave={() => setOpenModal(false)}
        />
      )}
    </>
  );
}
