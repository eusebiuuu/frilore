import { useState } from "react"
import ModalWrapper from "../../components/ModalWrapper";
import LoadingButton from "../../components/LoadingButton";
import { CompleteProject } from "./utils.project";

export type ListModalProps = {
  action: (title: string) => Promise<unknown>,
  onModalClose: () => void,
  project: CompleteProject,
  onProjectChange: (project: CompleteProject) => void,
}

export default function ListModal(props: ListModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleListCreate() {
    setLoading(true);
    await props.action(title);
    setLoading(false);
    props.onModalClose();
  }

  return (
    <ModalWrapper>
      <div className='bg-white rounded-lg p-6 w-1/2'>
        <label htmlFor='title' className='font-bold block my-3 text-lg'>List title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} id='title' placeholder="Title"
          className='bg-gray-100 px-4 py-2 rounded-md w-full'
        />
        <div className='w-full mt-5 flex justify-between'>
          <button onClick={props.onModalClose}  className='rounded-lg bg-red-500 text-white font-bold py-2 px-4'>
            Cancel
          </button>
          {
            loading
            ? <LoadingButton text={'Creating...'} />
            : <button onClick={handleListCreate} className='rounded-lg bg-blue-500 text-white font-bold py-2 px-4'>
              Create
            </button>
          }
        </div>
      </div>
    </ModalWrapper>
  )
}