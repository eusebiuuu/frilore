import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import LoadingButton from "./LoadingButton";

export type GeneralModalProps = {
  question: string,
  leftContent?: string,
  rightContent: string,
  onModalClose: () => void,
  rightAction: () => Promise<unknown>,
}

export default function Modal(props: GeneralModalProps) {
  const [loading, setLoading] = useState(false);

  function handleLeftClick() {
    props.onModalClose();
  }

  async function handleRightClick() {
    setLoading(true);
    try {
      await props.rightAction();
    } finally {
      setLoading(false);
      props.onModalClose();
    }
  }

  return (
    <ModalWrapper>
      <div className='bg-white rounded-lg p-6 w-1/2'>
        <div className="w-full text-center mb-6 font-bold text-lg">{props.question}</div>
        <div className='flex justify-around'>
          <button
            onClick={() => handleLeftClick()}
            className='border-black border-solid border-2 font-bold px-4 py-2 rounded-lg'
          >
            {props.leftContent || 'Cancel'}
          </button>
          {
            loading
            ? <LoadingButton text="Leaving..." />
            : (
              <button 
                onClick={() => handleRightClick()}
                className='bg-red-500 px-4 py-2 font-bold rounded-lg'
              >
                {props.rightContent}
              </button>
            )
          }
        </div>
      </div>
    </ModalWrapper>
  )
}