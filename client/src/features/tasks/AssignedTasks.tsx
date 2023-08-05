import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi";
import { StatusTypes, getDaysAgo, getFullDate, tasks } from "./utils.tasks";
import Tag from "../../components/Tag";
import { AiOutlineClockCircle } from "react-icons/ai";
import Members from "../../components/Members";
import TaskModal from "./TaskModal";
import CreateTaskModal from "./CreateTaskModal";

/*
- Tasks board for single project similar with this one
- Add assigned to filters
*/

export default function AssignedTasks() {
  const [criteria, setCriteria] = useState('closest deadline');
  const [status, setStatus] = useState(Array.from(StatusTypes, () => true));
  const [showStat, setShowStat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tasksOpen, setTasksOpen] = useState(Array.from(tasks, () => false));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowStat(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }; 
  }, [containerRef]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name;
    const fieldIdx = StatusTypes.indexOf(fieldName);
    setStatus(oldStatus => {
      return oldStatus.map((elem, idx) => {
        if (idx === fieldIdx) {
          return !elem;
        }
        return elem;
      })
    })
  }

  function swapTaskModalState(idx: number) {
    setTasksOpen(oldVal => {
      return oldVal.map((elem, curIdx) => {
        return idx === curIdx ? !elem : elem;
      })
    })
  }

  return (
    <div className='w-full py-4 px-6'>
      <div className='w-full mb-12'>
        <div className='mb-4 flex justify-between'>
          <div className='relative w-fit' ref={containerRef}>
            <button className='bg-primary py-2 px-4' onClick={() => setShowStat(true)}>Status</button>
            <div className={`grid grid-cols-1 bg-white shadow-md text-md absolute
              top-10 left-0 w-36 text-center p-2 ${showStat ? 'block' : 'hidden'}`}>
              {
                StatusTypes.map((elem, idx) => {
                  return (
                    <div className='flex' key={elem}>
                      <input type='checkbox' name={elem} id={elem} checked={status[idx]}
                        onChange={handleCheckboxChange} className='py-2' />
                      <label htmlFor={elem} className='pl-2'>{elem}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <select value={criteria} onChange={e => setCriteria(e.target.value)}
            className='bg-green-200 text-green-800 focus:border-none outline-none'>
            <option value='closest deadline'>Closest deadline</option>
            <option value='highest priority'>Highest priority</option>
            <option value='lowest priority'>Lowest priority</option>
          </select>
        </div>
        <div className='text-center m-auto border-2 flex place-content-center rounded-md w-fit bg-white'>
          <FiSearch size={30} className='pt-2 pl-2' />
          <input placeholder='Search task' className='md:w-80 w-52' />
        </div>
      </div>
      <div className='w-full'>
        {
          tasks.map((elem, idx) => {
            return (
              <div key={elem.id}>
                <div onClick={() => swapTaskModalState(idx)}
                  className='w-full flex my-6 bg-white rounded-lg p-4 cursor-pointer'>
                  <div className='w-full'>
                    <div className='font-bold mb-2'>{elem.title}</div>
                    <div className='text-gray-500 mb-2'>
                      Created {getDaysAgo(elem.createdDate)} days ago by {elem.author}
                    </div>
                    <div className='flex'>
                      <Tag color="orange" classNames='grid place-items-center mx-2'>
                        {elem.status}
                      </Tag>
                      <Tag color="red" classNames='grid place-items-center mx-2'>
                        {elem.priority}
                      </Tag>
                    </div>
                  </div>
                  <div className='grid place-items-center w-full'>
                    <Tag color="red">
                      <div className='flex'>
                        <AiOutlineClockCircle size={23} />
                        <div className='pl-2'>{getFullDate(elem.deadline)}</div>
                      </div>
                    </Tag>
                    <div>
                      <Members members={[{id: 1, member: ''}, {id: 2, member: ''}, 
                    {id: 3, member: ''}, {id: 4, member: ''}, {id: 5, member: ''}, {id: 6, member: ''}]} />
                    </div>
                  </div>
                </div>
                {/* <TaskModal isOpen={tasksOpen[idx]} 
                  onModalClose={() => swapTaskModalState(idx)} task={elem} /> */}
                <CreateTaskModal isOpen={tasksOpen[idx]} onModalClose={() => swapTaskModalState(idx)} />
              </div>
            )
          })
        }
      </div>
      <div className="w-full text-center">
        Pagination
      </div>
    </div>
  )
}