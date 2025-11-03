import { useState, useEffect, useRef } from 'react';
import './Canvas.css';

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
import { useComputeElementHeight } from '../../utils/hooks/useComputeElementHeight';
import { useCheckMobileMatchMedia } from '../../utils/hooks/useCheckMobileMatchMedia';
import Tiptap from '../../components/canvas/Tiptap';

const textType = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Paragraph'];
const fonts = ['Roboto', 'Helvetica', 'Arial'];

// const tabs = ['AI Citations', 'Password'];

export default function Canvas() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Missing state declarations
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async () => {
    // --- 1. Check empty message ---
    const isEmptyRichText = (html: any) => {
      if (!html) return true;
      const text = String(html)
        .replace(/<[^>]*>/g, "")
        .trim();
      return text.length === 0;
    };

    if (isEmptyRichText(inputText) && !selectedFile) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputText,
      file: selectedFile?.name || null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", inputText);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // const response = await fetch(
      //   "https://1xhxtpj7-8000.inc1.devtunnels.ms/chat/",
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      const response = await fetch(
        "http://localhost:8080/api/v1/admin/upload/document/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Check if response has steps for step-by-step functionality
        if (data.steps && data.steps.length > 0) {
          setCurrentSteps(data.steps);
          setCurrentStepIndex(0);
          setShowSteps(true);

          // Add initial step message
          const stepMessage = {
            id: Date.now() + 1,
            type: "bot",
            content: "I'll guide you through this step by step!",
            isStepGuide: true,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, stepMessage]);
        } else {
          // Regular response
          const botMessage = {
            id: Date.now() + 1,
            type: "bot",
            content: data.response,
            queryType: data.query_type,
            fileProcessed: data.file_processed || null,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      //   message.error('Error: ' + error.message);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputText("");
      setSelectedFile(null);
    }
  };

  const { type } = useUserContext();
  const params = useParams();
  const { isMobile } = useCheckMobileMatchMedia();

  const [openShareModal, setOpenShareModal] = useState<boolean>(false);

  const [openLeftSidebar, setOpenLeftSidebar] = useState<boolean>(false);

  const rightSidebarRef = useRef<HTMLDivElement | null>(null);
  const rightSidebarContentRef = useRef<HTMLDivElement | null>(null);
  const [openRightSidebar, setOpenRightSidebar] = useState<boolean>(false);

  // const [activeTab, setActiveTab] = useState(tabs[0]);

  const [scale, setScale] = useState(1);

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
    function handleKeydown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      if (!ctrl) return;

      if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(s + 0.1, 2));
        e.preventDefault();
      } else if (e.key === '-') {
        setScale((s) => Math.max(s - 0.1, 0.5));
        e.preventDefault();
      } else if (e.key === '0') {
        setScale(1);
        e.preventDefault();
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setOpenRightSidebar(true);
    } else {
      setOpenRightSidebar(false);
    }
  }, [isMobile]);

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
                  title={'Camistry.pdf'}
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
        {params?.id == '1' && (
          <div
            className={
              'rounded-8 shadow-s1 reach-content with-context-menu w-full max-w-555 flex-1 shrink-0 bg-white p-24'
            }
            style={{
              zoom: scale,
              transition: 'zoom 1.2s ease-in-out',
            }}
          >
            <h1>
              Foundational Concepts in Chemistry: Matter, Atoms, and the Forces
              That Bind Them
            </h1>
            <p>
              A comprehensive exploration of chemistry begins with an
              understanding of the fundamental principles that govern matter and
              its transformations. This document outlines core concepts, from
              the nature of chemical changes and the structure of atoms to the
              classification of elements and the interactions between them.
            </p>
            <h2>The Nature of Chemical and Physical Changes</h2>
            <p>
              In the study of matter, it is crucial to distinguish between
              physical and chemical changes. A physical change alters the form
              of a substance, but not its chemical identity.[1][2] Examples
              include boiling water (changing from liquid to gas), melting ice
              (changing from solid to liquid), and dissolving salt in water.[3]
              These changes are often reversible.[2]
            </p>
            <p>
              In contrast, a chemical change, also known as a chemical reaction,
              results in the formation of new substances with different
              properties.[1][4] A classic example is the burning of wood, where
              wood reacts with oxygen to produce ash, smoke, and gases.[3][4]
              Other examples are cooking, rusting, and rotting.[1] Chemical
              changes are typically irreversible.[4]
            </p>
            <h2>
              The Building Blocks of Matter: Atoms and Subatomic Particles
            </h2>
            <p>
              All matter is composed of tiny particles called atoms. Atoms
              themselves are comprised of even smaller, or subatomic, particles:
              protons, neutrons, and electrons.[5][6]
            </p>
          </div>
        )}

        {params?.id == '1' && (
          <div
            className={
              'rounded-8 shadow-s1 reach-content with-context-menu w-full max-w-555 flex-1 shrink-0 bg-white p-24'
            }
            style={{
              zoom: scale,
              transition: 'zoom 1.2s ease-in-out',
            }}
          >
            <p>
              Protons are positively charged particles found in the nucleus, or
              center, of the atom.[7]
            </p>
            <p>
              Neutrons are neutral particles, also located in the nucleus.[7]
            </p>
            <p>
              Electrons are negatively charged particles that orbit the
              nucleus.[7]
            </p>
            <p>
              An atom in its neutral state has an equal number of protons and
              electrons.[5] The number of protons in an atom's nucleus is its
              atomic number, which is a unique identifier for each element.[5]
            </p>
            <p>
              It is important to note that an ion is not a subatomic particle.
              An ion is an atom or molecule that has gained or lost one or more
              electrons, resulting in a net electrical charge.[5][8]
            </p>
            <h2>Organizing the Elements: The Periodic Table</h2>
            <p>
              The periodic table is a cornerstone of chemistry, providing a
              systematic arrangement of the chemical elements.[9][10] The
              elements are organized in order of increasing atomic number, which
              corresponds to the number of protons in the nucleus.[11][12] The
              table's structure, with its rows (periods) and columns (groups),
              reflects the electron configurations of the elements and their
              recurring chemical properties.[11][13] This organization allows
              chemists to predict an element's characteristics and its
              reactivity with other elements.[10]
            </p>
            <h2>The Forces That Bind: Ionic and Covalent Bonds</h2>
            <p>
              Atoms can connect with other atoms to form molecules through
              chemical bonds. The two primary types of bonds are ionic and
              covalent.
            </p>
          </div>
        )}

        {params?.id == '1' && (
          <div
            className={
              'rounded-8 shadow-s1 reach-content with-context-menu w-full max-w-555 flex-1 shrink-0 bg-white p-24'
            }
            style={{
              zoom: scale,
              transition: 'zoom 1.2s ease-in-out',
            }}
          >
            <p>
              Ionic bonds are formed when there is a transfer of electrons from
              one atom to another.[14][15] This transfer results in the
              formation of ions: a positively charged ion (cation) and a
              negatively charged ion (anion). The electrostatic attraction
              between these oppositely charged ions creates the bond.[14][16]
              This type of bond typically occurs between a metal and a
              non-metal.[17]
            </p>
            <p>
              Covalent bonds involve the sharing of electrons between
              atoms.[14][18] This sharing allows atoms to achieve a more stable
              electron configuration. Covalent bonds typically form between two
              non-metal atoms.[17]
            </p>
            <h2>Chemical Reactions and Energy</h2>
            <p>
              Chemical reactions involve the breaking and forming of chemical
              bonds, leading to the transformation of substances. These
              reactions are often accompanied by changes in energy.
            </p>
            <h2>Exothermic and Endothermic Reactions</h2>
            <p>
              An exothermic reaction is a chemical process that releases energy
              into the surroundings, usually in the form of heat.[19][20] This
              release of energy causes the temperature of the surroundings to
              increase.[21] Burning wood is an example of an exothermic
              reaction.
            </p>
            <h2>The Law of Conservation of Mass</h2>
            <p>
              A fundamental principle governing all chemical reactions is the
              law of conservation of mass. This law states that in an isolated
              system, mass is neither created nor destroyed.[22][23] In a
              chemical reaction, the total mass of the reactants (the starting
              materials) must equal the total mass of the products (the
              substances formed).[24][25]
            </p>
          </div>
        )}

        <div
          className={
            'rounded-8 shadow-s1 reach-content with-context-menu w-full max-w-555 flex-1 shrink-0 bg-white p-24'
          }
          style={{
            zoom: scale,
            transition: 'zoom 1.2s ease-in-out',
          }}
        >
          {params?.id == '1' && (
            <>
              <p>
                Atoms are simply rearranged during a reaction; they are not lost
                or gained.[26]
              </p>
              <h2>The Language of Chemistry: Moles, Acids, and Bases</h2>
              <p>
                To quantify and describe chemical reactions and substances,
                chemists use a specific set of terms and units.
              </p>
              <h2>The Mole: A Chemist's Dozen</h2>
              <p>
                In chemistry, the mole is a unit used to measure the amount of a
                substance.[27][28] One mole is defined as containing Avogadro's
                number of particles, which is approximately 6.022 x
                10^23.[29][30] These particles can be atoms, molecules, or other
                entities.[31] The mole is a convenient way to work with the vast
                numbers of atoms and molecules involved in chemical
                reactions.[28][29]
              </p>
              <h2>Acids and Bases: The pH Scale</h2>
              <p>
                Acids and bases are two important classes of substances with
                distinct properties. According to the Arrhenius theory, acids
                are substances that produce hydrogen ions (H+) when dissolved in
                water, while bases produce hydroxide ions (OH-).[32][33] The
                Brønsted-Lowry theory provides a broader definition, stating
                that acids are proton donors and bases are proton
                acceptors.[34][35]
              </p>
              <p>
                The acidity or basicity of a substance is measured using the pH
                scale, which ranges from 0 to 14.[36]
              </p>
              <p>A pH of 7 is considered neutral.</p>
              <p>A pH less than 7 indicates an acidic solution.[36]</p>
              <p>
                A pH greater than 7 indicates a basic or alkaline solution.
              </p>{' '}
            </>
          )}

          {params?.id == '2' && (
            <>
              <h1 contentEditable suppressContentEditableWarning>
                Executive Summary
              </h1>
              <p contentEditable suppressContentEditableWarning>
                AURON is a comprehensive university management system designed
                specifically for modern African universities. We transform how
                universities operate by automating administrative tasks,
                enhancing learning through AI-powered collaboration, and
                providing real-time insights into academic performance. Unlike
                traditional systems that simply store and display data, we
                create an active ecosystem where technology serves education,
                not the other way around.
              </p>
              <p contentEditable suppressContentEditableWarning>
                AURON is a comprehensive university management system designed
                specifically for modern African universities. We transform how
                universities operate by automating administrative tasks,
                enhancing learning through.
              </p>
            </>
          )}

          {(params?.id == '3' || params?.id == '4') && (
            <>
              <h2 contentEditable suppressContentEditableWarning>
                Executive Summary
              </h2>
              <p contentEditable suppressContentEditableWarning>
                Unlike traditional systems that simply store and display data,
                we create an active ecosystem where technology serves education,
                not the other way around.
              </p>
              <p contentEditable suppressContentEditableWarning>
                Unlike traditional systems that simply store and display data,
                we create an active ecosystem where technology serves education,
                not the other way around.
              </p>
            </>
          )}

          {params?.id == '5' && (
            <>
              <h1 contentEditable suppressContentEditableWarning>
                Executive Summary
              </h1>
              <p contentEditable suppressContentEditableWarning>
                AURON is a comprehensive university management system designed
                specifically for modern African universities. We transform how
                universities operate by automating administrative tasks,
                enhancing learning through AI-powered collaboration, and
                providing real-time insights into academic performance. Unlike
                traditional systems that simply store and display data, we
                create an active ecosystem where technology serves education,
                not the other way around.
              </p>
              <p contentEditable suppressContentEditableWarning>
                AURON is a comprehensive university management system designed
                specifically for modern African universities. We transform how
                universities operate by automating administrative tasks,
                enhancing learning through.
              </p>
            </>
          )}

          {(params?.id == '2' || params?.id == '4') && (
            <>
              <h2 contentEditable suppressContentEditableWarning>
                Executive Summary
              </h2>
              <p contentEditable suppressContentEditableWarning>
                Unlike traditional systems that simply store and display data,
                we create an active ecosystem where technology serves education,
                not the other way around.
              </p>
              <p contentEditable suppressContentEditableWarning>
                Unlike traditional systems that simply store and display data,
                we create an active ecosystem where technology serves education,
                not the other way around.
              </p>
            </>
          )}
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
            <div className={`flex items-center justify-start`}>
              <MemberAvatars />
            </div>
            <Button
              style={'gray'}
              onClick={(e) => {
                e.stopPropagation();
                setOpenShareModal(true);
              }}
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

          <div
            className={`border-linePr border-t px-16 py-12 ${openRightSidebar ? '' : 'opacity-0'}`}
          >
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

      {/* <div
        className={
          'pointer-events-none fixed inset-0 flex items-end overflow-x-auto px-16 pb-16 md:justify-center'
        }
      >
        <div
          className={
            'border-linePr rounded-20 pointer-events-auto flex h-56 w-min shrink-0 items-center gap-8 border bg-white px-8 [&>*]:shrink-0'
          }
        >
          <IconButton active icon={TextBoldIcon} />
          <IconButton icon={TextItalicIcon} />
          <IconButton icon={TextUnderlineIcon} />
          <IconButton icon={TextStrikethroughIcon} />
          <IconButton icon={TextColorIcon} />
          <hr className={'bg-linePr h-full w-1 border-none'} />
          <IconButton icon={TextAlignLeftIcon} />
          <IconButton icon={TextAlignCenterIcon} />
          <IconButton icon={TextAlignRightIcon} />
          <IconButton icon={TextAlignJustifyCenterIcon} />
          <IconButton icon={MoreVerticalIcon} />
          <hr className={'bg-linePr h-full w-1 border-none'} />
          <Dropdown list={textType} className={'min-w-150'} />
          <NumberCounterInput />
          <Dropdown list={fonts} directionX={'right'} className={'w-90'} />
        </div>
      </div> */}

      {/* Input Area */}
      <div className="input-area">
            {selectedFile && (
              <div className="file-preview">
                <span>📎 {selectedFile.name}</span>
                <button
                  className="remove-file-btn"
                  onClick={() => setSelectedFile(null)}
                >
                  ×
                </button>
              </div>
            )}

            <div className="input-container">
              {/* <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                className="message-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              /> */}

              <Tiptap
                value={inputText}
                onChange={setInputText}
                onEnterPress={handleSendMessage}
              />

              <div className="input-buttons">
                <label className="file-upload-btn">
                  📎 Upload
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e)}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.csv,.txt,.zip,.docx,.doc,.xlsx,.xls"
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={(inputText.trim() === '' || inputText === '<p></p>') && !selectedFile}
                >
                  ➤ Send
                </button>
              </div>
            </div>

            <div className="file-info-text">
              Supported files: PDF, Images (JPG, PNG, GIF, WebP), Excel, CSV,
              Word, ZIP (Max 20MB)
            </div>
          </div>


      

      {openShareModal && (
        <ShareModal onClose={() => setOpenShareModal(false)} />
      )}
    </div>
  );
}
