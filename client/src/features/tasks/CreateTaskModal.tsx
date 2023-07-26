import { ChangeEvent, useState } from "react"
import { people } from "./utils.tasks";

type CreateTaskModalProps = {
  isOpen: boolean,
  onModalClose: () => void,
}

const initialState = {
  title: '',
  status: 'to do',
  deadline: '2023-05-23',
  description: '',
  reporters: [],
  asignees: [],
  priority: 'high',
}

export default function CreateTaskModal(props: CreateTaskModalProps) {
  // handle null reporters or assignees cases
  const [task, setTask] = useState(initialState);
  const [reporters, setReporters] = useState(Array.from(people, () => false));
  const [assignees, setAssignees] = useState(Array.from(people, () => false));

  function handleReportersChange(idx: number) {
    setReporters(oldVal => {
      return oldVal.map((elem, curIdx) => {
        return curIdx === idx ? !elem : elem;
      })
    })
  }

  function handleAssigneesChange(idx: number) {
    setAssignees(oldVal => {
      return oldVal.map((elem, curIdx) => {
        return curIdx === idx ? !elem : elem;
      })
    })
  }

  function handleTaskChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setTask(oldVal => {
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    })
  }

  return (
    <div className={`${props.isOpen ? '' : 'hidden'}`}>
      <div className='fixed z-40 top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='fixed top-0 z-50 left-0 w-full h-full grid place-items-center overflow-auto'>
        <div className='bg-white rounded-lg p-6 w-5/6'>
          <div className='mb-5 w-full'>
            <div className='text-sm text-gray-500'>Create task</div>
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            <div>
              <label htmlFor='taskTitle'>
                <h3 className='mb-2'>Title</h3>
              </label>
              <input name='title' id='taskTitle' value={task.title} onChange={handleTaskChange}
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
            <div className="mt-3">
              <h3>Reporter(s)</h3>
              <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 h-40 overflow-auto'>
                {
                  people.map((elem, idx) => {
                    return (
                      <div key={elem.id} className='mb-4 border-b-2 border-b-gray-200 flex'>
                        <div>{elem.name}</div>
                        <div className='text-gray-400 mx-4'>{elem.role}</div>
                        <input type='checkbox' checked={reporters[idx]} 
                          onChange={() => handleReportersChange(idx)} className='scale-125' />
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="mt-3">
              <h3>Assignee(s)</h3>
              <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 h-40 overflow-auto'>
                {
                  people.map((elem, idx) => {
                    return (
                      <div key={elem.id} className='mb-4 border-b-2 border-b-gray-200 flex'>
                        <div>{elem.name}</div>
                        <div className='text-gray-400 mx-4'>{elem.role}</div>
                        <input type='checkbox' checked={assignees[idx]} 
                          onChange={() => handleAssigneesChange(idx)} className='scale-125' />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='float-right mt-4'>
            <button onClick={props.onModalClose} className='mx-2 px-4 py-2 text-white bg-blue-500
              rounded-xl font-bold border-blue-500 border-solid'>
              Create
            </button>
            <button onClick={props.onModalClose} className='px-4 py-2 text-blue-500 bg-white border-blue-500 
              border-solid rounded-xl font-bold'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}