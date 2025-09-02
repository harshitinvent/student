import { createPortal } from 'react-dom';
import ModalWrapper from '../wrappers/ModalWrapper';

export default function AIGenerationModal() {
  return createPortal(
    <ModalWrapper className={'backdrop-blur-sm'}>
      <div
        className={
          'rounded-24 bg-bgSec border-linePr w-full max-w-800 p-40 max-md:p-16'
        }
      >
        <p className={'text-h5 max-md:text-18 mb-24 px-24 max-md:px-8'}>
          AI Generation{' '}
          <span className="inline-flex items-center gap-1 text-2xl font-medium">
            <span className="dot-loader [animation-delay:0s]">.</span>
            <span className="dot-loader [animation-delay:0.2s]">.</span>
            <span className="dot-loader [animation-delay:0.4s]">.</span>
          </span>
        </p>

        <div>
          <p
            className={
              'rounded-8 bg-textHeadline/5 mt-32 h-28 w-1/3 animate-pulse'
            }
          ></p>

          <div className={'mt-16 grid grid-cols-2 gap-12 max-md:mt-8'}>
            {Array(4)
              .fill('')
              .map((_, i) => (
                <div
                  key={`sceleton-item-${i}`}
                  className={
                    'rounded-12 bg-textHeadline/5 h-44 w-full animate-pulse'
                  }
                ></div>
              ))}
          </div>
        </div>

        <div className={'mt-32'}>
          <p
            className={'rounded-8 bg-textHeadline/5 h-28 w-2/3 animate-pulse'}
          ></p>

          <div
            className={
              'rounded-12 bg-textHeadline/5 mt-16 h-120 w-full animate-pulse'
            }
          ></div>
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById('root')!
  );
}
