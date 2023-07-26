import { GrClose, GrStatusGood } from "react-icons/gr";
import Tag from "../../components/Tag";
import userProfile from '../../assets/user-profile.svg'
import Members from "../../components/Members";
import { getFullDate } from "./utils.tasks";
import { MdPriorityHigh, MdOutlinePerson } from 'react-icons/md'
import { BsFillPeopleFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from "react-icons/ai";

type TaskModalProps = {
  isOpen: boolean,
  onModalClose: () => void,
  task: {
    id: number,
    title: string,
    deadline: Date,
    createdDate: Date,
    priority: 'low' | 'high',
    status: 'completed' | 'pending' | 'to do',
    author: string,
  }
}

export default function TaskModal(props: TaskModalProps) {
  return (
    <div className={`${props.isOpen ? '' : 'hidden'}`}>
      <div className='fixed z-40 top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='fixed top-0 z-50 left-0 w-full h-full grid place-items-center'>
        <div className='bg-white rounded-lg p-6 w-1/2'>
          <div className='flex justify-between mb-5'>
            <div className='grid place-items-center'>
              <div className='text-sm text-gray-500'>Project name / Task ID</div>
            </div>
            <button onClick={() => props.onModalClose()}>
              <GrClose size={27} />
            </button>
          </div>
          <h3>{props.task.title}</h3>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <MdPriorityHigh size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-2'>Priority</div>
            <Tag color='orange' classNames='ml-5'>{props.task.priority}</Tag>
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <GrStatusGood size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4'>Status</div>
            <Tag color='green' classNames='ml-5'>{props.task.status}</Tag>
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <MdOutlinePerson size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4'>Author</div>
            <img src={userProfile} className='w-8 h-8 rounded-full ml-8 mr-2' />
            <div className='grid place-items-center'>{props.task.author}</div>
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <BsFillPeopleFill size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4 mr-6'>Workers</div>
            <Members members={[{id: 1, member: ''}, {id: 2, member: ''}, 
              {id: 3, member: ''}, {id: 4, member: ''}, {id: 5, member: ''}, {id: 6, member: ''}]} />
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <AiOutlineClockCircle size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4 mr-6'>Deadline</div>
            <Tag color='red'>{getFullDate(new Date())}</Tag>
          </div>
          <hr className="my-4" />
          <h4 className='mb-2'>Description</h4>
          <p>Lörem ipsum salig nen, ip-tv plus labesa. Eurov yk. Funktionell dumhet
sabel som antiras mide. Heteron bionebelt preseling, divis peng. Trer beroren.</p>
        </div>
      </div>
    </div>
  )
}