import { ChangeEvent, useEffect, useState } from "react"
import ModalWrapper from "../../components/ModalWrapper";
import { Member, Task } from "../projects/utils.project";
import { TaskMember, prepareForObjectState } from "./utils.tasks";
import TaskAssignments from "./TaskAssignments";
import Loader from "../../components/Loader";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import LoadingButton from "../../components/LoadingButton";
import { getStates } from "../../utils/getObjectsStates";
import { notificationsSocket } from "../../socket";

export type CreateTaskModalProps = {
  onModalClose: () => void,
  type: 'create' | 'update',
  task?: Task,
  members: Member[],
  listID: string,
  projectTitle: string,
}

const initialState: Task = {
  task_id: '',
  name: '',
  status: 'to do',
  deadline: '2023-05-23',
  description: '',
  assignments: [],
  priority: 'high',
  created_at: new Date()
}

export default function CreateTaskModal(props: CreateTaskModalProps) {
  const [task, setTask] = useState<Task>(props.task || initialState);
  const [loading, setLoading] = useState(false);
  const [taskMembers, setTaskMembers] = useState<TaskMember[] | []>([]);
  const [initialTaskMembers, setInitialTaskMembers] = useState<TaskMember[] | []>([]);

  useEffect(() => {
    const newMembers: TaskMember[] = props.members.map(member => {
      const memberInfo = task.assignments.find(elem => {
        if (elem.user_id === member.member_id) {
          return elem;
        }
      })
      return {
        user_id: member.member_id,
        type: memberInfo?.type || 'none',
        username: member.username,
        role: member.role,
      }
    });
    setTaskMembers(newMembers);
    setInitialTaskMembers(newMembers);
  }, []);

  function handleTaskChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setTask(oldVal => {
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    })
  }

  async function handleButtonClick() {
    setLoading(true);
    try {
      let currTask;
      if (props.type === 'create') {
        currTask = await customFetch.post('/task', {
          listID: props.listID,
          ...task,
        });
      } else {
        currTask = await customFetch.patch(`/task/${task.task_id}`, {
          listID: props.listID,
          ...task,
        });
      }
      const membersState = getStates(prepareForObjectState(initialTaskMembers), prepareForObjectState(taskMembers));
      // console.log(membersState);
      for (const member of membersState.delete as TaskMember[]) {
        notificationsSocket.emit('delete-assignment', task.name, props.projectTitle, member.user_id);
        await customFetch.delete(`/assignment/${member.user_id}/${currTask.data.task.task_id}`);
      }
      for (const member of membersState.create as TaskMember[]) {
        notificationsSocket.emit('create-assignment', task.name, props.projectTitle, member.user_id);
        await customFetch.post(`/assignment`, {
          newUserID: member.user_id,
          taskID: currTask.data.task.task_id,
          assignmentType: member.type,
        });
      }
      for (const member of membersState.update as TaskMember[]) {
        notificationsSocket.emit('update-assignment', task.name, props.projectTitle, member.user_id);
        await customFetch.patch(`/assignment`, {
          currUserID: member.user_id,
          taskID: task.task_id,
          assignmentType: member.type,
        });
      }
    } catch (err) {
      catchAxiosError(err);
    } finally {
      setLoading(false);
    }
    props.onModalClose();
  }

  function handleTaskMembersChange(idx: number, type: 'assignee' | 'reporter' | 'none') {
    setTaskMembers(oldVal => {
      return oldVal.map((elem, currIdx) => {
        if (currIdx !== idx) {
          return elem;
        }
        return {
          ...elem,
          type
        }
      })
    })
  }

  return (
    <ModalWrapper>
      <div className='bg-white rounded-lg p-6 w-5/6'>
        <div className='mb-5 w-full'>
          <div className='text-sm text-gray-500'>
            {props.type === 'update' ? 'Edit task' : 'Create task'}
          </div>
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          <div>
            <label htmlFor='taskTitle'>
              <h3 className='mb-2'>Title</h3>
            </label>
            <input name='name' id='taskTitle' value={task.name} onChange={handleTaskChange}
              className='border-2 border-gray-300 rounded-md w-full' />
          </div>
          <div className="flex">
            <div>
              <label htmlFor='taskStatus' className='block'>
                <h3 className='mb-2'>Status</h3>
              </label>
              <select id='taskStatus' value={task.status} name='status' onChange={handleTaskChange}
                className='border-2 border-gray-300 rounded-md bg-white py-2'>
                <option value='to do'>To do</option>
                <option value='pending'>Pending</option>
                <option value='completed'>Completed</option>
              </select>
            </div>
            <div className='ml-3'>
              <label htmlFor='priority' className='block'>
                <h3 className='mb-2'>Priority</h3>
              </label>
              <select id='priority' value={task.priority} name='priority' onChange={handleTaskChange}
                className='border-2 border-gray-300 rounded-md bg-white py-2'>
                <option value='high'>High</option>
                <option value='low'>Low</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor='deadline' className='block'>
              <h3 className='mb-2'>Deadline</h3>
            </label>
            <input type='date' name='deadline' id='deadline' value={task.deadline} onChange={handleTaskChange}
              className='border-2 border-gray-300 rounded-md w-full' />
          </div>
        </div>
        <textarea rows={10} className='border-4 border-gray-300 bg-white
          w-full p-3 rounded-md mt-3 focus:border-blue-500 focus:outline-none'
          value={task.description} onChange={handleTaskChange} name='description' />
        <div className="grid grid-cols-1 place-items-center lg:flex lg:justify-around">
          {
            taskMembers
            ? (<>
              <div className="mt-3">
                <TaskAssignments title="Assignees" members={taskMembers}
                  onTaskMembersChange={handleTaskMembersChange} type='assignee' />
              </div>
              <div className="mt-3">
                <TaskAssignments title="Reporters" members={taskMembers} 
                  onTaskMembersChange={handleTaskMembersChange} type='reporter' />
              </div>
            </>)
            : <Loader size='big' />
          }
        </div>
        <div className='float-right mt-4'>
          {
            loading
            ? <LoadingButton text='Saving...' />
            : <button onClick={handleButtonClick} className='mx-2 px-4 py-2 text-white bg-blue-500
              rounded-xl font-bold border-blue-500 border-solid'>
              {props.type === 'create' ? 'Create' : 'Edit'}
            </button>
          }
          { !loading && <button onClick={props.onModalClose}
            className='px-4 py-2 text-blue-500 bg-white border-blue-500 border-solid rounded-xl font-bold'>
            Cancel
          </button> }
        </div>
      </div>
    </ModalWrapper>
  )
}