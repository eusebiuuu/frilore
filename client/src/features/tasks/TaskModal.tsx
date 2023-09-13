import { GrClose, GrStatusGood } from "react-icons/gr";
import Tag from "../../components/Tag";
import Members from "../../components/Members";
import { Colour, getFullDate, priorityColour, statusColour } from "./utils.tasks";
import { MdPriorityHigh } from 'react-icons/md'
import { BsFillPeopleFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from "react-icons/ai";
import { Task } from "../projects/utils.project";

export type TaskModalProps = {
  onModalClose: () => void,
  task: Task
}

export default function TaskModal(props: TaskModalProps) {
  return (
    <div className={''}>
      <div className='fixed z-40 top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='fixed top-0 z-50 left-0 w-full h-full grid place-items-center'>
        <div className='bg-white rounded-lg p-6 w-1/2'>
          <div className='flex justify-between mb-5'>
            <div className='grid place-items-center'>
              <div className='text-sm text-gray-500'>TaskID: {props.task.task_id}</div>
            </div>
            <button onClick={() => props.onModalClose()}>
              <GrClose size={27} />
            </button>
          </div>
          <h3>{props.task.name}</h3>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <MdPriorityHigh size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-2'>Priority</div>
            <Tag color={priorityColour.get(props.task.priority) as Colour}
              classNames='ml-5'>{props.task.priority}</Tag>
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <GrStatusGood size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4'>Status</div>
            <Tag color={statusColour.get(props.task.status) as Colour} classNames='ml-5'>{props.task.status}</Tag>
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <BsFillPeopleFill size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4 mr-6'>Workers</div>
            <Members members={props.task.assignments.map(elem => {
              return {
                member_id: elem.user_id,
                username: elem.username,
                image_url: elem.image_url
              }
            })} />
          </div>
          <div className='flex mt-6'>
            <div className='grid place-items-center'>
              <AiOutlineClockCircle size={25} />
            </div>
            <div className='font-bold text-lg grid place-items-center ml-4 mr-6'>Deadline</div>
            <Tag color='red'>{getFullDate(props.task.deadline)}</Tag>
          </div>
          <hr className="my-4" />
          <h3 className='mb-2'>Description</h3>
          <p>{props.task.description}</p>
        </div>
      </div>
    </div>
  )
}