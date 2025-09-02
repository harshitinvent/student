import { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  UserIcon,
  MortarboardIcon,
  CalendarIcon,
  CoinsIcon,
  LeftToRightListBulletIcon,
  SearchIcon,
  CancelIcon,
} from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import Button from '../../components/shared/Button';
import Filter from '../../components/shared/Filter';
import Table from '../../components/features/Table';
import { HugeiconsIcon } from '@hugeicons/react';
import ModalWrapper from '../../components/shared/wrappers/ModalWrapper';
import Dropdown from '../../components/shared/Dropdown';
import Textarea from '../../components/shared/form-elements/Textarea';
import Avatar from '../../components/shared/Avatar';
import { Card } from 'antd'; 
import ViewIcon from "../../assets/view-icon.svg";
export default function FinancialManagementPage() {
  const [modalOpened, setModalOpened] = useState(false);

  return (
   <div className="venue-management-page">
    <Card
          className="vanue-management-card mb-6"
          title={
            <div className="card-header-main">
              <div className="card-header">
                <h3 className="card-title">Financial Management</h3>
                {/* <p className="card-subtitle">
                          Manage semesters for each year level (1st Semester, 2nd
                          Semester)
                        </p> */}
              </div>
              <Filter />
            </div>
          }
        >
    

      <div className="table-responsive">
        <Table
          titles={[
            {
              icon: UserIcon,
              title: 'Name',
            },
            {
              icon: MortarboardIcon,
              title: 'Student ID Number',
            },
            {
              icon: CalendarIcon,
              title: 'Year / Semester',
              sortable: true,
            },
            {
              icon: CoinsIcon,
              title: 'Balance',
            },
            {
              icon: LeftToRightListBulletIcon,
              title: 'History',
            },
          ]}
          className="vanue-table"
        >
          {Array(7)
            .fill('')
            .map((_, i) => (
              <div
                key={'row-' + i}
                className={
                  'max-md:grid max-md:gap-16 max-md:[&>*]:flex max-md:[&>*]:min-h-32 max-md:[&>*]:items-center max-md:[&>*]:justify-between max-md:[&>*]:gap-12'
                }
              >
                <div>
                  <p
                    className={
                      'text-14 text-textHeadline font-medium md:hidden'
                    }
                  >
                    Name
                  </p>

                  <div className={'flex items-center gap-12'}>
                    <Avatar className={'size-32'} />
                    <p className={'text-textHeadline/80 text-14 font-medium'}>
                      John Doe
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    className={
                      'text-14 text-textHeadline font-medium md:hidden'
                    }
                  >
                    Student ID Number
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
                    className={
                      'text-14 text-textHeadline font-medium md:hidden'
                    }
                  >
                    Year / Semester
                  </p>

                  <p className={'text-textHeadline/80 text-14 font-medium'}>
                    2024 / Fall
                  </p>
                </div>

                <div>
                  <p
                    className={
                      'text-14 text-textHeadline font-medium md:hidden'
                    }
                  >
                    Balance
                  </p>

                  <p className={'text-textHeadline/80 text-14 font-medium'}>
                    $1,200.00
                  </p>
                </div>

                <div>
                  <p
                    className={
                      'text-14 text-textHeadline font-medium md:hidden'
                    }
                  >
                    History
                  </p>

                  <Button
                    className="table-action-button"
                    style={'transparent'}
                    onClick={() => setModalOpened(true)}
                  >
                  <img src={ViewIcon} alt="Edit" />
                  </Button>
                </div>
              </div>
            ))}
        </Table>
        
      </div>
      </Card>

      {modalOpened &&
        createPortal(
          <ModalWrapper>
            <div
              className={`rounded-32 max-md:rounded-24 bg-bgSec relative flex max-h-full w-full max-w-1000 flex-col overflow-hidden`}
            >
              <button
                className={
                  'bg-bgPr hover:shadow-s1 border-linePr rounded-12 text-textHeadline absolute top-24 right-24 flex size-40 cursor-pointer items-center justify-center border duration-300 max-md:right-16'
                }
                onClick={() => setModalOpened(false)}
              >
                <HugeiconsIcon className={'size-16'} icon={CancelIcon} />
              </button>

              <div
                className={
                  'border-linePr flex items-start justify-start gap-32 border-b p-24 pr-88 max-md:pr-72 max-md:pl-16'
                }
              >
                <div className={'grid gap-6'}>
                  <p className={'text-h6 text-textHeadline font-medium'}>
                    John Doe
                  </p>
                  <p className={'text-16 text-textHeadline/80'}>202501001</p>
                </div>

                <div className={'text-16 text-textHeadline/80 mt-4 grid gap-6'}>
                  <p>Year / Semester</p>
                  <p>2024 / Fall</p>
                </div>
              </div>

              <div className={'flex-1 overflow-y-auto p-24 pb-32 max-md:px-16'}>
                <Table
                  titles={[
                    {
                      title: 'Transaction',
                    },
                    {
                      icon: CalendarIcon,
                      title: 'Date',
                      sortable: true,
                    },
                    {
                      title: 'Type',
                    },
                    {
                      title: 'Description',
                    },
                    {
                      title: 'Debit',
                    },
                    {
                      title: 'Credit',
                    },
                    {
                      title: 'Balance',
                    },
                  ]}
                  gridClassName={
                    'md:grid-cols-[1fr_0.5fr_0.5fr_0.75fr_0.35fr_0.35fr_0.35fr]'
                  }
                >
                  {Array(5)
                    .fill('')
                    .map(() => (
                      <div
                        className={
                          'max-md:grid max-md:gap-16 max-md:[&>*]:flex max-md:[&>*]:min-h-32 max-md:[&>*]:items-center max-md:[&>*]:justify-between max-md:[&>*]:gap-12'
                        }
                      >
                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Transaction
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
                            <p
                              className={
                                'text-iconGreen/80 text-14 font-medium'
                              }
                            >
                              202501001
                            </p>
                          </div>
                        </div>

                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Date
                          </p>

                          <p
                            className={
                              'text-textHeadline/80 text-14 font-medium'
                            }
                          >
                            2023-12-31
                          </p>
                        </div>

                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Type
                          </p>

                          <p
                            className={
                              'text-14 text-textDescription/80 font-medium'
                            }
                          >
                            Payment
                          </p>
                        </div>

                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Description
                          </p>

                          <p
                            className={
                              'text-14 text-textDescription/80 font-medium'
                            }
                          >
                            Registration
                          </p>
                        </div>

                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Debit
                          </p>

                          <p className={'text-14 text-iconBlue/80 font-medium'}>
                            500.00
                          </p>
                        </div>
                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Credit
                          </p>

                          <p className={'text-14 text-iconBlue/80 font-medium'}>
                            40.00
                          </p>
                        </div>
                        <div>
                          <p
                            className={
                              'text-14 text-textHeadline font-medium md:hidden'
                            }
                          >
                            Balance
                          </p>

                          <p className={'text-14 text-iconBlue/80 font-medium'}>
                            -40.00
                          </p>
                        </div>
                      </div>
                    ))}
                </Table>

                <div className={'mt-32'}>
                  <div>
                    <p className={'text-textHeadline text-h6 font-medium'}>
                      Payment Plan{' '}
                    </p>
                    <p className={'text-16 text-textHeadline/80 mt-16'}>
                      Notify (send a payment reminder on x date)
                    </p>
                    <p
                      className={
                        'text-textHeadline/80 text-14 mt-6 font-semibold'
                      }
                    >
                      John Doe
                    </p>
                  </div>

                  <div className={'mt-24 grid gap-16 md:grid-cols-3'}>
                    <div>
                      <p className={'text-body-m text-textHeadline mb-8'}>
                        Telephone
                      </p>
                      <Dropdown list={['+1 000 000 000', '+2 000 000 000']} />
                    </div>
                    <div>
                      <p className={'text-body-m text-textHeadline mb-8'}>
                        Email
                      </p>
                      <Dropdown
                        list={['Info@gmail.com', 'no-reply@gmail.com']}
                      />
                    </div>
                    <div>
                      <p className={'text-body-m text-textHeadline mb-8'}>
                        Date
                      </p>
                      <Dropdown list={['2023-12-31', '2023-12-31']} />
                    </div>

                    <div className={'md:col-span-3'}>
                      <p className={'text-body-m text-textHeadline mb-8'}>
                        Message
                      </p>
                      <Textarea />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalWrapper>,
          document.querySelector('#root')!
        )}
    </div>
  );
}
