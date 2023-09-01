import { useState } from "react"
import ModalWrapper from "../../components/ModalWrapper";
import LoadingButton from "../../components/LoadingButton";

export type ListModalProps = {
  action: (title: string) => Promise<unknown>,
  onModalClose: () => void
}

export default function ListModal(props: ListModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleListCreate() {
    setLoading(true);
    try {
      await props.action(title);
    } finally {
      setLoading(false);
      props.onModalClose();
    }
  }

  return (
    <ModalWrapper>
      <div className='bg-white rounded-lg p-6 w-1/2'>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        {
          loading
          ? <LoadingButton text={'Creating...'} />
          : <button onClick={handleListCreate}>
            Create
          </button>
        }
        <button onClick={props.onModalClose}>
          Cancel
        </button>
      </div>
    </ModalWrapper>
  )
}