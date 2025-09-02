import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  NotebookIcon,
  NoteAddIcon,
  CertificateIcon,
  BookOpenIcon,
  SecurityValidationIcon,
  CancelIcon,
  PlusSignIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../components/shared/PageTitleArea';
import TagCard from '../components/shared/TagCard';
import ActivityPanel from '../components/widgets/ActivityPanel';
import RecentPanel from '../components/widgets/RecentPanel';
import Button from '../components/shared/Button';
import CalendarAppointmentsWidget from '../components/widgets/CalendarAppointmentsWidget';
import { useUserContext } from '../providers/user';
import MessageTextarea from '../components/features/MessageTextarea';
import IconCard from '../components/shared/icons/IconCard';
import StatusTag, { StatusType } from '../components/shared/StatusTag';
import CatalogCard from '../components/shared/CatalogCard';
import MemberAvatars from '../components/shared/MemberAvatars';
import { Link } from 'react-router';

const tabs = [
  'Summary',
  'Board',
  'Reports',
  'Timeline',
  'Docs',
  'Projects',
  'Issues / Conflicts',
  'Directory',
];

export default function HomePage() {
  const { type } = useUserContext();

  return (
    <div className={'flex flex-col pb-24'}>
      {type !== 'Student' ? (
        <div className={'pb-24'}>
          <PageTitleArea
            title={
              <div>
                <p className={'text-h5 text-textHeadline font-medium'}>
                  Hello, {type} 👋
                </p>
                <p className={'text-body-l text-textDescription font-medium'}>
                  Head of {type === 'Admin' ? 'Finance' : 'Teacher'}
                </p>
              </div>
            }
          />

          <div className={'px-24 py-16 max-md:px-16 max-md:pb-0'}>
            <div className={'group/ai relative'}>
              <MessageTextarea
                placeholder={'Search or ask about your workspace...'}
              />

              <div
                className={
                  'rounded-24 border-linePr bg-bgSec group-has-focus/ai:pointer-event-auto pointer-events-none absolute inset-x-0 top-[calc(100%+0.25rem)] overflow-hidden border opacity-0 shadow-[0_1rem_1rem_rgba(0,0,0,0.1)] duration-300 group-has-focus/ai:opacity-100'
                }
              >
                <ul className={'max-h-190 overflow-y-auto p-12'}>
                  {Array(5)
                    .fill('')
                    .map((_, i) => (
                      <li
                        key={i}
                        className={
                          'hover:bg-bgPr hover:border-linePr rounded-10 text-body-l cursor-pointer border border-transparent p-12 duration-300'
                        }
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      </li>
                    ))}
                </ul>

                <div
                  className={
                    'bg-bgNavigate border-linePr flex flex-wrap gap-6 border-t p-12'
                  }
                >
                  <Button>
                    Surprise me{' '}
                    <HugeiconsIcon className={'size-16'} icon={RefreshIcon} />
                  </Button>
                  <Button style={'gray-border'}>
                    How many users signed up this week?
                  </Button>
                  <Button style={'gray-border'}>
                    Show me recent activity logs
                  </Button>
                  <Button style={'gray-border'}>
                    Which users are inactive?
                  </Button>
                  <Button style={'gray-border'}>Add a new user</Button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              'mt-24 flex min-h-60 items-center px-48 py-10 max-md:mt-16 max-md:px-16'
            }
          >
            <p>Your’e events for the day AI POWERED</p>{' '}
          </div>

          <div
            className={
              'grid gap-16 px-24 max-md:px-16 md:grid-cols-[1fr_18.125rem]'
            }
          >
            <div
              className={
                'rounded-24 bg-bgSec border-linePr grid gap-8 border p-24 max-md:p-12'
              }
            >
              <EventItem status={'draft'} />
              <EventItem status={'success'} />
              <EventItem status={'pending'} />
              <EventItem status={'draft'} />
            </div>
            <CalendarAppointmentsWidget size={'lg'} />
          </div>

          <div
            className={
              'mt-24 flex min-h-60 items-center justify-between gap-24 px-48 py-10 max-md:mt-16 max-md:px-16'
            }
          >
            <p>Active documents</p>
          </div>

          <div
            className={
              'grid grid-cols-4 gap-12 px-24 max-md:flex max-md:overflow-x-auto max-md:px-16 [&>*]:shrink-0'
            }
          >
            {Array(3)
              .fill('')
              .map((_, i) => (
                <CatalogCard
                  key={'item-' + i}
                  forSaving={false}
                  previewColor={'green'}
                  to={`/canvas/${i}`}
                  title={'Q1 report'}
                  subtitle={'Short description'}
                  className={'max-md:w-200'}
                >
                  <div
                    className={'mt-12 flex items-center justify-between gap-12'}
                  >
                    <MemberAvatars size={'sm'} />
                    <p className={'text-textHeadline text-body-l font-medium'}>
                      05/07/25
                    </p>
                  </div>
                </CatalogCard>
              ))}

            <Link
              to={'/canvas/12'}
              className={
                'bg-bgSec rounded-24 border-linePr grid cursor-pointer gap-8 border p-8 transition-shadow duration-300 hover:shadow-[0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_9.5625rem_3.8125rem_rgba(0,0,0,0.01)]'
              }
            >
              <div
                className={
                  'rounded-16 bg-bgNavigate flex size-full items-center justify-center gap-16 px-16'
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
                  Create document
                </p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <PageTitleArea title={'Hello, Zayn 👋'} />

          <div
            className={
              'grid grid-cols-4 items-stretch gap-16 px-24 pt-16 max-md:flex max-md:overflow-x-auto max-md:px-16 md:mt-16'
            }
          >
            <TagCard
              title={'Notes'}
              description={'Create or edit your study notes'}
              icon={NotebookIcon}
            />
            <TagCard
              to={'/assignments'}
              title={'Assigments'}
              description={'Check your pending assignments'}
              icon={NoteAddIcon}
            />
            <TagCard
              title={'AI Tutor'}
              description={'Schedule a session with your AI tutor'}
              icon={CertificateIcon}
            />
            <TagCard
              title={'Quiz'}
              description={'Test your knowledge with Ai -generated quizzes'}
              icon={BookOpenIcon}
            />
          </div>

          <div
            className={
              'mt-24 grid gap-16 px-24 max-md:px-16 md:grid-cols-[1fr_0.6fr]'
            }
          >
            <ActivityPanel />
            <RecentPanel />
          </div>

          {/*<div className={'mt-24 grid grid-cols-[9.6875rem_1fr] px-10'}>*/}
          {/*  <CalendarAppointmentsWidget />*/}
          {/*</div>*/}
        </>
      )}
    </div>
  );
}

export function InvitedUserItem({ owner }: { owner?: boolean }) {
  return (
    <div className={'flex items-center justify-between gap-12 py-10'}>
      <div className={'flex items-center gap-12'}>
        <div className={'size-32 overflow-hidden rounded-full'}>
          <img
            className={'block size-full object-cover'}
            src="/pic/user-avatar.jpg"
            alt="avatar"
          />
        </div>

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

export function EventItem({ status }: { status: StatusType }) {
  return (
    <div
      className={
        'rounded-16 border-linePr flex items-center justify-between gap-16 border p-8'
      }
    >
      <div className={'flex items-center gap-16'}>
        <IconCard icon={BookOpenIcon} size={'sm'} color={'green'} />
        <div>
          <p className={'text-textHeadline text-14 font-medium'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing
          </p>
          <p className={'text-textDescription text-body-l mt-4 font-medium'}>
            05/07/25
          </p>
        </div>
      </div>

      <StatusTag status={status} icon />
    </div>
  );
}
