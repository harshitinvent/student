import { FormEvent, useEffect, useRef, useState } from 'react';

import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  TextColorIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyCenterIcon,
  MoreVerticalIcon,
  LayoutRightIcon,
  SearchIcon,
  CursorTextIcon,
  PlayIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';

import { useNavigate, useParams } from 'react-router';

import IconButton from '../../components/shared/IconButton';
import Dropdown from '../../components/shared/Dropdown';
import NumberCounterInput from '../../components/shared/NumberCounterInput';
import { Link } from 'react-router';
import CustomIcon from '../../components/shared/icons/CustomIcon';
import { HugeiconsIcon } from '@hugeicons/react';
import DocumentCardItem from '../../components/shared/DocumentCardItem';
import Button from '../../components/shared/Button';
// import Tabs from '../../components/shared/Tabs';
import SpotifyWidget from '../../components/widgets/SpotifyWidget';
import MemberAvatars from '../../components/shared/MemberAvatars';
import ShareModal from '../../components/shared/modals/ShareModal';
import { useUserContext } from '../../providers/user';
import AIGenerationModal from '../../components/shared/modals/AIGenerationModal';
import { useComputeElementHeight } from '../../utils/hooks/useComputeElementHeight';
import { useCheckMobileMatchMedia } from '../../utils/hooks/useCheckMobileMatchMedia';

const textType = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Paragraph'];
const fonts = ['Roboto', 'Helvetica', 'Arial'];

const tabs = ['AI Citations', 'Password'];

type DocType = {
  id: number | string;
  title: string;
  subtitle?: string;
  color: 'green' | 'blue' | 'orange' | 'red';
};

const docs: DocType[] = [
  {
    id: 1,
    title: 'Camistry.pdf',
    color: 'green',
  },
  {
    id: 2,
    title: 'Course_Handbook.pdf',
    color: 'red',
  },
  {
    id: 3,
    title: 'Learning_Plan_Sem1.pdf',
    color: 'orange',
  },
  {
    id: 4,
    title: 'Learning_Plan_Sem1.pdf',
    color: 'green',
  },
  {
    id: 5,
    title: 'Intro_to_Study_Skills.pdf',
    color: 'blue',
  },
];

type MultipleChoiceQuestion = {
  title: string;
  options: string[];
  answer: string; // цей тип ми уточнимо нижче
};

type WrittenQuestion = {
  title: string;
  options: 'written';
  answer: string;
};

export type QuestionType =
  | (MultipleChoiceQuestion & {
      answer: MultipleChoiceQuestion['options'][number];
    })
  | WrittenQuestion;

const QUESTIONS: QuestionType[] = [
  {
    title: 'Which of the following is a chemical change?',
    options: [
      'Boiling water',
      'Dissolving salt in water',
      'Burning wood',
      'Melting ice',
    ],
    answer: 'Burning wood',
  },
  {
    title: 'What is the pH of a neutral substance?',
    options: ['0', '7', '14', '-7'],
    answer: '7',
  },
  {
    title: 'Which of the following is NOT a subatomic particle?',
    options: ['Proton', 'Neutron', 'Electron', 'Ion'],
    answer: 'Ion',
  },
  {
    title: 'What does the atomic number of an element represent?',
    options: [
      'The number of neutrons in the nucleus',
      'The total number of protons and neutrons',
      'The number of protons in the nucleus',
      'The number of electrons in the outermost shell',
    ],
    answer: 'The number of protons in the nucleus',
  },
  {
    title: 'What is the difference between an ionic and a covalent bond?',
    options: 'written',
    answer:
      'An ionic bond involves the transfer of electrons from one atom to another, creating ions that are electrostatically attracted to each other. A covalent bond involves the sharing of electrons between atoms.',
  },
  {
    title: 'What is a mole in chemistry?',
    options: 'written',
    answer:
      "A mole is a unit of measurement that represents Avogadro's number (6.022 x 10^23) of particles (atoms, molecules, etc.).",
  },
  {
    title: 'What is an exothermic reaction?',
    options: 'written',
    answer:
      'An exothermic reaction is a chemical reaction that releases energy in the form of heat.',
  },
  {
    title: 'What are acids and bases?',
    options: 'written',
    answer:
      'Acids are substances that produce hydrogen ions (H+) in a solution, while bases produce hydroxide ions (OH-).',
  },
  {
    title: 'What is the law of conservation of mass?',
    options: 'written',
    answer:
      'The law of conservation of mass states that in a chemical reaction, mass is neither created nor destroyed.',
  },
  {
    title: 'What is the periodic table?',
    options: 'written',
    answer:
      'The periodic table is a tabular arrangement of the chemical elements, organized by their atomic number, electron configuration, and recurring chemical properties.',
  },
];

export default function AssignmentCanvas() {
  const { type } = useUserContext();
  const params = useParams();
  const { isMobile } = useCheckMobileMatchMedia();
  // const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState(tabs[0]);

  const [activePage, setActivePage] = useState(0);

  const [openLeftSidebar, setOpenLeftSidebar] = useState<boolean>(false);

  const rightSidebarRef = useRef<HTMLDivElement | null>(null);
  const rightSidebarContentRef = useRef<HTMLDivElement | null>(null);
  const [openRightSidebar, setOpenRightSidebar] = useState<boolean>(false);

  const [openShareModal, setOpenShareModal] = useState<boolean>(false);

  const [aiTextareaValue, setAiTextareaValue] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<DocType['id'] | null>(
    null
  );

  const [questions, setQuestions] = useState<QuestionType[]>(QUESTIONS);
  const [requestStatus, setRequestStatus] = useState<
    'pending' | 'success' | null
  >(params?.id == '12' ? null : 'success');

  useComputeElementHeight(
    rightSidebarRef,
    rightSidebarContentRef,
    () => {
      if (rightSidebarRef.current) {
        rightSidebarRef.current.style.height = `4rem`;
      }
    },
    openRightSidebar
  );

  useEffect(() => {
    if (!isMobile) {
      setOpenRightSidebar(true);
    } else {
      setOpenRightSidebar(false);
    }
  }, [isMobile]);

  function updateQuestionAnswer(index: number, value: string) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, answer: value } : item))
    );
  }

  function handleSubmitRequest(e: FormEvent) {
    e.preventDefault();

    setRequestStatus('pending');

    setTimeout(() => {
      setRequestStatus('success');
      setAiTextareaValue('');
    }, 7000);
  }

  return (
    <div
      className={
        'grid h-full gap-24 overflow-x-hidden overflow-y-auto pt-20 max-md:px-16 max-md:pt-96 max-md:pb-88 md:grid-cols-[15rem_1fr_15rem]'
      }
    >
      <div
        className={`bg-bgPr rounded-20 border-linePr sticky top-0 flex max-h-[calc(100vh-2.5rem)] flex-col justify-between self-start overflow-hidden border duration-300 max-md:fixed max-md:top-16 max-md:left-16 max-md:max-h-[calc(100dvh-6.5rem)] max-md:w-2/3 ${
          openLeftSidebar ? 'h-full' : 'h-64'
        }`}
      >
        <div>
          <div className={'px-10 py-12'}>
            <div className={'flex items-center gap-4 px-6 py-4'}>
              <Link
                to={'/canvases'}
                className={
                  'flex w-full cursor-pointer items-center gap-4 overflow-hidden'
                }
              >
                <CustomIcon
                  className={`text-textPr [&_*]:stroke-1.5 size-16 shrink-0 rotate-90`}
                  icon={'chevron'}
                />

                <p
                  className={
                    'text-textPr text-14 flex-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap'
                  }
                >
                  Student_Guide_2025.pdf
                </p>
              </Link>

              <IconButton
                onClick={() => {
                  if (isMobile) {
                    setOpenRightSidebar(false);
                  }
                  setOpenLeftSidebar(!openLeftSidebar);
                }}
                className={'text-textSecondary !size-32'}
                icon={LayoutRightIcon}
              />
            </div>
          </div>

          <div className={'border-linePr border-t px-16 py-12'}>
            <div className={'flex h-38 items-center justify-between'}>
              <p
                className={
                  'text-14 text-textPr flex-1 overflow-hidden font-medium text-ellipsis'
                }
              >
                Student_Guide_2025.pdf
              </p>
              <CustomIcon
                className={`text-textPr [&_*]:stroke-1.5 size-16 shrink-0`}
                icon={'chevron'}
              />
            </div>
          </div>

          <div className={'border-linePr border-t px-16 py-12'}>
            <div className={'flex h-38 items-center justify-between'}>
              <p
                className={
                  'text-body-m text-textHeadline flex-1 overflow-hidden font-semibold text-ellipsis'
                }
              >
                Documents
              </p>
              <CustomIcon
                className={`text-textPr [&_*]:stroke-1.5 size-16 shrink-0`}
                icon={'chevron'}
              />
            </div>

            <div className={'mt-12 grid gap-12'}>
              <Link
                to={'/canvas/1'}
                className={
                  'rounded-12 bg-bgSec hover:shadow-s1 cursor-pointer p-8 pr-16 duration-300'
                }
              >
                <DocumentCardItem
                  title={'Student_Guide_2025.pdf'}
                  subtitle={'Create or edit your study notes'}
                />
              </Link>

              <Link
                to={'/canvas/2'}
                className={
                  'rounded-12 bg-bgSec hover:shadow-s1 cursor-pointer p-8 pr-16 duration-300'
                }
              >
                <DocumentCardItem
                  title={'Course_Handbook.pdf'}
                  subtitle={'Create or edit your study notes'}
                  iconColor={'blue'}
                />
              </Link>

              <Link
                to={'/canvas/3'}
                className={
                  'rounded-12 bg-bgSec hover:shadow-s1 cursor-pointer p-8 pr-16 duration-300'
                }
              >
                <DocumentCardItem
                  title={'Learning_Plan_Sem1.pdf'}
                  subtitle={'Create or edit your study notes'}
                  iconColor={'orange'}
                />
              </Link>

              <Link
                to={'/canvas/4'}
                className={
                  'rounded-12 bg-bgSec hover:shadow-s1 cursor-pointer p-8 pr-16 duration-300'
                }
              >
                <DocumentCardItem
                  title={'Learning_Plan_Sem1.pdf'}
                  subtitle={'Create or edit your study notes'}
                  iconColor={'red'}
                />
              </Link>

              <Link
                to={'/canvas/5'}
                className={
                  'rounded-12 bg-bgSec hover:shadow-s1 cursor-pointer p-8 pr-16 duration-300'
                }
              >
                <DocumentCardItem
                  title={'Intro_to_Study_Skills.pdf'}
                  subtitle={'Create or edit your study notes'}
                />
              </Link>
            </div>
          </div>
        </div>

        <div className={'border-linePr flex items-center gap-12 border-t p-12'}>
          <div className={'flex size-32 shrink-0 items-center justify-center'}>
            <HugeiconsIcon
              className={'text-textSecondary size-16'}
              icon={SearchIcon}
            />
          </div>
          <input
            type="text"
            className={
              'text-textHeadline text-body-m flex-1 border-none bg-transparent outline-none'
            }
            placeholder={'Search...'}
          />
        </div>
      </div>

      <div className={'flex flex-col items-center gap-20 pb-96 max-md:py-0'}>
        <div
          className={
            'border-linePr w-full flex-1 shrink-0 border-b pb-20 max-md:pb-16'
          }
        >
          <div
            className={
              'border-linePr flex items-center justify-between gap-24 border-b py-20'
            }
          >
            <h1
              className={
                'text-h5 text-textHeadline max-md:text-h6 p-4 font-medium'
              }
              contentEditable
              suppressContentEditableWarning
            >
              Assignments Name
            </h1>

            {requestStatus === 'success' && (
              <Link to={'/assignment/1'}>
                <Button style={'gray'}>Publish</Button>
              </Link>
            )}
          </div>

          <div className={'mt-32 flex w-full flex-col gap-32'}>
            {!requestStatus && (
              <>
                <div className={'grid w-full gap-16'}>
                  <p
                    className={
                      'text-h6 text-textHeadline max-md:text-18 font-medium'
                    }
                  >
                    Describe the main purpose of the function
                  </p>
                  <form
                    onSubmit={handleSubmitRequest}
                    className={'relative w-full'}
                  >
                    <textarea
                      value={aiTextareaValue}
                      onChange={(e) => {
                        setAiTextareaValue(e.target.value);
                      }}
                      className={
                        'rounded-24 bg-bgPr border-linePr h-120 w-full resize-none border p-20 outline-none'
                      }
                      placeholder={'Please inquire about anything...'}
                    />

                    <button
                      type={'submit'}
                      disabled={aiTextareaValue.length <= 0}
                      className={
                        'rounded-12 bg-buttonPr border-linePr shadow-s1 absolute top-12 right-12 flex size-40 cursor-pointer items-center justify-center border text-white duration-300 hover:bg-[#323232] disabled:pointer-events-none disabled:opacity-50'
                      }
                    >
                      <HugeiconsIcon
                        className={'size-20 rotate-90'}
                        icon={ArrowLeft02Icon}
                      />
                    </button>
                  </form>
                </div>

                <div>
                  <p
                    className={
                      'text-h6 text-textHeadline max-md:text-18 font-medium'
                    }
                  >
                    Select the document for which you want to create an
                    assignment
                  </p>

                  <div
                    className={
                      'mt-20 grid grid-cols-3 gap-16 max-md:grid-cols-2 max-md:gap-8'
                    }
                  >
                    {docs.map(({ id, title, subtitle, color }) => (
                      <ChooseDocumentCard
                        key={id}
                        title={title}
                        subtitle={subtitle}
                        color={color}
                        selected={id === selectedDocId}
                        onClick={() => {
                          setSelectedDocId(id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {requestStatus === 'pending' && <AIGenerationModal />}

            {/*  */}
            {requestStatus === 'success' && (
              <div className={'grid gap-48'}>
                {questions.map(({ title, options, answer }, i) =>
                  i >= 4 * activePage && i < 4 + 4 * activePage ? (
                    <div key={`question-${i}`} className={'grid w-full gap-16'}>
                      <p
                        className={
                          'text-h6 text-textHeadline max-md:text-18 flex items-center justify-start gap-12 font-medium'
                        }
                      >
                        <span
                          className={
                            'text-body-l bg-bgInput border-linePr flex size-32 shrink-0 items-center justify-center rounded-full border'
                          }
                        >
                          {i + 1}
                        </span>
                        <span> {title}</span>
                      </p>
                      <div className={'grid w-full grid-cols-2 gap-12'}>
                        {options === 'written' ? (
                          <textarea
                            className={
                              'rounded-24 with-context-menu bg-bgPr border-linePr col-span-2 h-120 w-full resize-none border p-20 outline-none max-md:p-16'
                            }
                            placeholder={'Please,  write an answer...'}
                            value={answer}
                            onChange={(e) => {
                              updateQuestionAnswer(i, e.target.value);
                            }}
                          />
                        ) : (
                          options.map((option, index) => (
                            <AnswerChoiceItem
                              key={`answer-${index}`}
                              title={option}
                              isChosen={answer === option}
                              onClick={() => {
                                updateQuestionAnswer(i, option);
                              }}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
            {/*  */}
          </div>
        </div>
      </div>

      <div
        ref={rightSidebarRef}
        className={`rounded-20 border-linePr sticky top-0 self-start overflow-hidden border bg-[#FCFCFC] max-md:fixed max-md:top-16 max-md:right-16 max-md:duration-300 ${
          openRightSidebar ? 'max-md:w-1/2' : 'max-md:w-88'
        }`}
      >
        <div ref={rightSidebarContentRef}>
          <div
            className={'flex items-center justify-between gap-4 p-12 pl-16'}
            onClick={() => {
              if (isMobile) {
                setOpenLeftSidebar(false);
                setOpenRightSidebar(!openRightSidebar);
              }
            }}
          >
            <div className={'flex items-center justify-start'}>
              <MemberAvatars />
            </div>
            <Button
              style={'gray'}
              onClick={() => setOpenShareModal(true)}
              className={`${openRightSidebar ? '' : 'opacity-0'}`}
            >
              Share
            </Button>
          </div>

          {/*<div className={'border-linePr border-t px-16 py-12'}>*/}
          {/*  <Tabs*/}
          {/*    activeTab={activeTab}*/}
          {/*    onTabChange={(value) => setActiveTab(value)}*/}
          {/*    tabsList={tabs}*/}
          {/*    className={'w-full'}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className={'border-linePr border-t px-16 py-12'}>
            <div className={'flex items-center justify-between gap-4'}>
              <p className={'text-body-m font-semibold'}>AI Citations</p>
              <div
                className={'flex size-24 shrink-0 items-center justify-center'}
              >
                <CustomIcon
                  className={`text-textPr [&_*]:stroke-1.5 size-16 rotate-180`}
                  icon={'chevron'}
                />
              </div>
            </div>

            <ul className={'mt-12 grid gap-4'}>
              <li
                className={
                  'rounded-12 hover:bg-bgSec hover:shadow-s1 flex cursor-pointer items-center gap-12 overflow-hidden bg-transparent p-4 duration-300'
                }
              >
                <div
                  className={
                    'rounded-8 text-iconSec bg-bgNavigate flex size-32 shrink-0 items-center justify-center'
                  }
                >
                  <HugeiconsIcon className={'size-20'} icon={CursorTextIcon} />
                </div>
                <p
                  className={
                    'text-textHeadline text-body-m overflow-hidden font-medium text-ellipsis whitespace-nowrap'
                  }
                >
                  Executive Summary
                </p>
              </li>

              <li
                className={
                  'rounded-12 hover:bg-bgSec hover:shadow-s1 flex cursor-pointer items-center gap-12 overflow-hidden bg-transparent p-4 duration-300'
                }
              >
                <div
                  className={
                    'rounded-8 text-iconSec bg-bgNavigate flex size-32 shrink-0 items-center justify-center'
                  }
                >
                  <HugeiconsIcon className={'size-20'} icon={CursorTextIcon} />
                </div>
                <p
                  className={
                    'text-textHeadline text-body-m overflow-hidden font-medium text-ellipsis whitespace-nowrap'
                  }
                >
                  We transform
                </p>
              </li>

              <li
                className={
                  'rounded-12 hover:bg-bgSec hover:shadow-s1 flex cursor-pointer items-center gap-12 overflow-hidden bg-transparent p-4 duration-300'
                }
              >
                <div
                  className={
                    'rounded-8 text-iconSec bg-bgNavigate flex size-32 shrink-0 items-center justify-center'
                  }
                >
                  <HugeiconsIcon className={'size-20'} icon={CursorTextIcon} />
                </div>
                <p
                  className={
                    'text-textHeadline text-body-m overflow-hidden font-medium text-ellipsis whitespace-nowrap'
                  }
                >
                  Unlike traditional systems
                </p>
              </li>
            </ul>
          </div>

          {/*<div className={'border-linePr border-t px-16 py-12'}>*/}
          {/*  <div className={'flex items-center justify-between gap-4'}>*/}
          {/*    <p className={'text-body-m font-semibold'}>Timer</p>*/}
          {/*    <div*/}
          {/*      className={'flex size-24 shrink-0 items-center justify-center'}*/}
          {/*    >*/}
          {/*      <CustomIcon*/}
          {/*        className={`text-textPr [&_*]:stroke-1.5 size-16 rotate-180`}*/}
          {/*        icon={'chevron'}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div className={'mt-12'}>*/}
          {/*    <div*/}
          {/*      className={*/}
          {/*        'rounded-16 bg-bgNavigate text-h1 text-textHeadline flex h-80 items-center justify-center gap-8 text-center'*/}
          {/*      }*/}
          {/*    >*/}
          {/*      <span>03</span>*/}
          {/*      <span className={'text-h3'}>:</span>*/}
          {/*      <span>00</span>*/}
          {/*    </div>*/}

          {/*    <div className={'mt-13 flex items-center gap-16 pb-14'}>*/}
          {/*      <button className={'size-16 shrink-0 cursor-pointer'}>*/}
          {/*        <HugeiconsIcon*/}
          {/*          className={'fill-textHeadline size-full'}*/}
          {/*          icon={PlayIcon}*/}
          {/*        />*/}
          {/*      </button>*/}
          {/*      <div*/}
          {/*        className={*/}
          {/*          'bg-buttonPrDisabled/20 flex h-3 flex-1 items-center rounded border-none'*/}
          {/*        }*/}
          {/*      >*/}
          {/*        <hr*/}
          {/*          className={'bg-iconBlue h-10 w-10 rounded-full border-none'}*/}
          {/*        />*/}
          {/*      </div>*/}
          {/*      <div*/}
          {/*        className={*/}
          {/*          'text-textDescription text-body-m shrink-0 font-medium'*/}
          {/*        }*/}
          {/*      >*/}
          {/*        02:45s*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {type === 'Student' && (
            <div className={'border-linePr border-t px-16 py-12'}>
              <div className={'flex items-center justify-between gap-4'}>
                <p className={'text-body-m font-semibold'}>Music</p>
                <div
                  className={
                    'flex size-24 shrink-0 items-center justify-center'
                  }
                >
                  <CustomIcon
                    className={`text-textPr [&_*]:stroke-1.5 size-16 rotate-180`}
                    icon={'chevron'}
                  />
                </div>
              </div>

              <div className={'mt-12'}>
                <SpotifyWidget />
              </div>
            </div>
          )}
        </div>
      </div>

      {requestStatus === 'success' && (
        <div
          className={
            'pointer-events-none fixed inset-0 flex items-end justify-center overflow-x-auto px-16 pb-16'
          }
        >
          <div
            className={
              'border-linePr rounded-20 pointer-events-auto flex h-56 w-min shrink-0 items-center gap-8 border bg-white px-8 [&>*]:shrink-0'
            }
          >
            <IconButton
              disabled={activePage <= 0}
              className={
                'bg-[#F1F1F1] inset-shadow-[0_-1px_3px_rgba(18,18,18,0.15),0_1.25px_1px_#ffffff] hover:!bg-[#D4D4D4]'
              }
              icon={ArrowLeft02Icon}
              onClick={() => {
                setActivePage(activePage - 1);
              }}
            />
            <IconButton
              disabled={activePage >= questions.length / 5}
              className={
                'bg-[#F1F1F1] inset-shadow-[0_-1px_3px_rgba(18,18,18,0.15),0_1.25px_1px_#ffffff] hover:!bg-[#D4D4D4]'
              }
              icon={ArrowRight02Icon}
              onClick={() => {
                setActivePage(activePage + 1);
              }}
            />
          </div>
        </div>
      )}

      {openShareModal && (
        <ShareModal onClose={() => setOpenShareModal(false)} />
      )}
    </div>
  );
}

export function ChooseDocumentCard({
  title,
  subtitle,
  color,
  selected,
  onClick,
}: {
  title: string;
  subtitle?: string;
  color: 'green' | 'blue' | 'orange' | 'red';
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        'rounded-12 border-linePr bg-bgSec hover:shadow-s1 flex cursor-pointer items-center gap-16 border p-16 duration-300'
      }
      onClick={() => {
        onClick?.();
      }}
    >
      <div
        className={`rounded-6 flex size-22 shrink-0 items-center justify-center text-white inset-shadow-[0_0_1px_0.5px_rgba(18,18,18,0.1)] duration-300 ${
          selected ? 'bg-textHeadline border-transparent' : 'bg-bgNavigate'
        }`}
      >
        <HugeiconsIcon
          className={`size-18 duration-300 ${selected ? '' : 'opacity-0'}`}
          icon={Tick02Icon}
        />
      </div>

      <DocumentCardItem title={title} subtitle={subtitle} iconColor={color} />
    </div>
  );
}

export function AnswerChoiceItem({
  title,
  isChosen,
  onClick,
}: {
  title: string;
  isChosen: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-bgSec rounded-12 border-linePr hover:shadow-s1 flex cursor-pointer items-center gap-17 border p-10 duration-300 max-md:gap-8 max-md:p-8`}
      onClick={() => {
        onClick?.();
      }}
    >
      <div
        className={`rounded-6 flex size-22 shrink-0 items-center justify-center text-white duration-300 ${
          isChosen
            ? 'bg-textHeadline border-transparent'
            : 'bg-bgNavigate inset-shadow-[0_0_1px_0.5px_rgba(18,18,18,0.1)]'
        }`}
      >
        <HugeiconsIcon
          className={`size-16 ${isChosen ? '' : 'opacity-0'}`}
          icon={Tick02Icon}
        />
      </div>
      <p className={'text-body-m text-textHeadline font-medium'}>{title}</p>
    </div>
  );
}
