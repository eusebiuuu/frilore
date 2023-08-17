import { useState } from "react";
import ModalWrapper from "./ModalWrapper";

type ModalProps = {
  question: string,
  leftContent: string,
  rightContent: string,
  onModalClose: () => void,
  rightAction: () => Promise<unknown>,
}

export default function Modal(props: ModalProps) {
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
        <div className="mx-auto my-4">{props.question}</div>
        <div className='flex justify-around'>
          <button onClick={() => handleLeftClick()}>{props.leftContent}</button>
          {
            loading
            ? <button>Loading...</button>
            : <button onClick={() => handleRightClick()}>{props.rightContent}</button>
          }
        </div>
      </div>
    </ModalWrapper>
  )
}