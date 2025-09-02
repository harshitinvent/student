import {
  UserIcon,
  PassportIcon,
  LayersIcon,
  Call02Icon,
  InformationCircleIcon,
  SearchIcon,
} from '@hugeicons/core-free-icons';

import Table from '../../features/Table';
import { HugeiconsIcon } from '@hugeicons/react';
import Avatar from '../../shared/Avatar';

export default function DirectorySection() {
  return (
    <div className={'max-md:px-16'}>
      <Table
        titles={[
          {
            icon: UserIcon,
            title: 'Name',
          },
          {
            icon: PassportIcon,
            title: 'Staff ID',
          },
          {
            icon: LayersIcon,
            title: 'Department',
          },
          {
            icon: UserIcon,
            title: 'Role',
          },
          { icon: Call02Icon, title: 'Contact' },
        ]}
      >
        {Array(6)
          .fill('null')
          .map((_, i) => (
            <div
              className={
                'max-md:grid max-md:gap-16 max-md:[&>*]:flex max-md:[&>*]:min-h-32 max-md:[&>*]:items-center max-md:[&>*]:justify-between max-md:[&>*]:gap-12'
              }
            >
              <div>
                <p
                  className={'text-14 text-textHeadline font-medium md:hidden'}
                >
                  Name
                </p>

                <div className={'flex items-center justify-start gap-12'}>
                  <Avatar className={'size-32'} />

                  <p className={'text-14 text-textHeadline/80 font-medium'}>
                    John Doe
                  </p>
                </div>
              </div>

              <div>
                <p
                  className={'text-14 text-textHeadline font-medium md:hidden'}
                >
                  Staff ID
                </p>

                <div
                  className={
                    'bg-bgIcon2 rounded-10 flex h-32 w-fit items-center gap-8 px-8'
                  }
                >
                  <HugeiconsIcon
                    className={'text-iconBlue size-20'}
                    icon={SearchIcon}
                  />
                  <p className={'text-iconGreen/80 text-14 font-medium'}>
                    202501001
                  </p>
                </div>
              </div>

              <div>
                <p
                  className={'text-14 text-textHeadline font-medium md:hidden'}
                >
                  Department
                </p>

                <p className={'text-14 text-textHeadline/80 font-medium'}>
                  Design
                </p>
              </div>

              <div>
                <p
                  className={'text-14 text-textHeadline font-medium md:hidden'}
                >
                  Role
                </p>

                <p className={'text-14 text-textHeadline/80 font-medium'}>
                  Teacher
                </p>
              </div>

              <div>
                <p
                  className={'text-14 text-textHeadline font-medium md:hidden'}
                >
                  Contact
                </p>

                <button
                  className={
                    'rounded-8 hover:bg-bgNavigate text-iconSec hover:shadow-s1 flex size-32 cursor-pointer items-center justify-center bg-transparent duration-300'
                  }
                >
                  <HugeiconsIcon
                    className={'size-20'}
                    icon={InformationCircleIcon}
                  />
                </button>
              </div>
            </div>
          ))}
      </Table>
    </div>
  );
}
