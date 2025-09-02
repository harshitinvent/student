import Dropdown from '../../components/shared/Dropdown';
import Input from '../../components/shared/form-elements/Input';

export default function SignupPage() {
  return (
    <div className={'flex h-full items-center justify-center'}>
      <div className={'w-full max-w-544'}>
        <div>
          <h1 className={'text-h3 text-textPr'}>
            Application form for new students
          </h1>
          <p className={'text-textDescription text-14 mt-16'}>
            You are requesting admission to the following programme: Bachelor of
            Accountancy. Please complete the following form entirely to
            successfully complete your application. Click on the steps below to
            continue.
          </p>
        </div>

        <div
          className={
            'bg-bgSec border-linePr rounded-12 mt-24 flex w-full items-start gap-12 border p-16'
          }
        >
          <div
            className={
              'bg-bgNavigate rounded-8 border-linePr text-textHeadline text-14 flex size-32 shrink-0 items-center justify-center border font-medium'
            }
          >
            1
          </div>
          <div>
            <p className={'text-16 text-textHeadline font-semibold'}>
              General information
            </p>
            <p className={'text-body-l text-textDescription mt-6'}>
              In this section you will provide basic information needed for your
              enrolment.
            </p>
          </div>
        </div>

        <div className={'mt-16'}>
          <div>
            <p className={'text-14 text-textHeadline mb-6 font-semibold'}>
              1.2 - Mode of Study
            </p>
            <p className={'text-textDescription text-body-m mb-8 font-medium'}>
              Select your preferred mode of study
            </p>
            <Dropdown
              size={'md'}
              value={null}
              list={['1', '2', '3']}
              isFullWidthList
              direction={'down'}
            />
          </div>

          <hr className={'bg-linePr my-24 h-1 w-full border-none'} />

          <div className={'grid gap-16'}>
            <div>
              <p className={'text-14 text-textHeadline mb-6 font-semibold'}>
                1.3 - NRC or Passport
              </p>
              <p
                className={'text-textDescription text-body-m mb-8 font-medium'}
              >
                Please enter the ID number provided on your national
                identification card or passport
              </p>
              <Input size={'md'} placeholder={'ID'} />
            </div>
            <div>
              <p className={'text-14 text-textHeadline mb-6 font-semibold'}>
                1.4 - Surname
              </p>
              <p
                className={'text-textDescription text-body-m mb-8 font-medium'}
              >
                Your family name
              </p>
              <Input size={'md'} placeholder={'Surname'} />
            </div>
            <div>
              <p className={'text-14 text-textHeadline mb-6 font-semibold'}>
                1.5 - First Name
              </p>
              <p
                className={'text-textDescription text-body-m mb-8 font-medium'}
              >
                Your given name
              </p>
              <Input size={'md'} placeholder={'First Name'} />
            </div>
            <div>
              <p className={'text-14 text-textHeadline mb-6 font-semibold'}>
                1.6 - Sex (Gender)
              </p>
              <Dropdown
                size={'md'}
                isFullWidthList
                value={null}
                list={['1', '2']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
