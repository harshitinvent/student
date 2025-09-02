import PageTitleArea from '../../components/shared/PageTitleArea';
import { Link } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { useState } from 'react';

import { type QuestionType, AnswerChoiceItem } from './AssignmentCanvas';
import IconButton from '../../components/shared/IconButton';

const QUESTIONS: QuestionType[] = [
  {
    title: 'Which of the following is a chemical change?',
    options: [
      'Boiling water',
      'Dissolving salt in water',
      'Burning wood',
      'Melting ice',
    ],
    answer: '',
  },
  {
    title: 'What is the pH of a neutral substance?',
    options: ['0', '7', '14', '-7'],
    answer: '',
  },
  {
    title: 'Which of the following is NOT a subatomic particle?',
    options: ['Proton', 'Neutron', 'Electron', 'Ion'],
    answer: '',
  },
  {
    title: 'What does the atomic number of an element represent?',
    options: [
      'The number of neutrons in the nucleus',
      'The total number of protons and neutrons',
      'The number of protons in the nucleus',
      'The number of electrons in the outermost shell',
    ],
    answer: '',
  },
  {
    title: 'What is the difference between an ionic and a covalent bond?',
    options: 'written',
    answer: '',
  },
  {
    title: 'What is a mole in chemistry?',
    options: 'written',
    answer: '',
  },
  {
    title: 'What is an exothermic reaction?',
    options: 'written',
    answer: '',
  },
  {
    title: 'What are acids and bases?',
    options: 'written',
    answer: '',
  },
  {
    title: 'What is the law of conservation of mass?',
    options: 'written',
    answer: '',
  },
  {
    title: 'What is the periodic table?',
    options: 'written',
    answer: '',
  },
];

export default function AssignmentPage() {
  const [activePage, setActivePage] = useState(0);

  const [questions, setQuestions] = useState<QuestionType[]>(QUESTIONS);

  function updateQuestionAnswer(index: number, value: string) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, answer: value } : item))
    );
  }

  return (
    <div>
      <PageTitleArea>
        <div className={'flex items-center gap-6'}>
          <Link
            to={'/assignments'}
            className={
              'rounded-10 bg-bgNavigate text-iconSec hover:bg-bgSec hover:shadow-s1 flex size-40 cursor-pointer items-center justify-center duration-300'
            }
          >
            <HugeiconsIcon className={'size-20'} icon={ArrowLeft02Icon} />
          </Link>
          <p className={'text-textHeadline text-h5 font-medium'}>
            Assignment Name
          </p>
        </div>
      </PageTitleArea>

      <div className={'mt-24 flex flex-col items-center pb-32'}>
        <div className={'flex w-full max-w-800 flex-col gap-48 max-md:px-16'}>
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
                        'rounded-24 with-context-menu bg-bgPr border-linePr col-span-2 h-120 w-full resize-none border p-20 outline-none'
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

        <div className={'mt-48 flex items-center justify-center gap-12'}>
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
    </div>
  );
}
