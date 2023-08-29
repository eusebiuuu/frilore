import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi";
import { Colour, StatusTypes, getFullDate, priorityColour, statusColour } from "./utils.tasks";
import Tag from "../../components/Tag";
import { AiOutlineClockCircle } from "react-icons/ai";
import Members from "../../components/Members";
import TaskModal from "./TaskModal";
import customFetch from "../../lib/customFetch";
import { Task } from "../projects/utils.project";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";

const initialState: Task[] = [{
  task_id: '',
  name: '',
  status: 'to do',
  deadline: '2023-05-23',
  description: '',
  assignments: [],
  priority: 'high',
  open: false,
}];

export default function AssignedTasks() {
  const [criteria, setCriteria] = useState('closest deadline');
  const [status, setStatus] = useState(Array.from(StatusTypes, () => true));
  const [keywords, setKeywords] = useState('');
  const [showStat, setShowStat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>(initialState);
  const [curTasks, setCurTasks] = useState<Task[]>(initialState);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get('/task');
        setTasks(result.data.tasks);
        setCurTasks(result.data.tasks);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setCurTasks(tasks.filter(task => {
      const statusIdx = StatusTypes.indexOf(task.status);
      if (!status[statusIdx]) {
        return null;
      }
      if (task.name.toLowerCase().includes(keywords)) {
        return task;
      }
      if (task.description.toLowerCase().includes(keywords)) {
        return task;
      }
    }))
  }, [keywords, status]);

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name;
    const fieldIdx = StatusTypes.indexOf(fieldName);
    setStatus(oldStatus => {
      return oldStatus.map((elem, idx) => {
        return idx === fieldIdx ? !elem : elem;
      })
    })
  }

  function changeTaskModalDisplay(idx: number, val: boolean) {
    setTasks(oldVal => {
      return oldVal.map((elem, curIdx) => {
        if (idx === curIdx) {
          return {
            ...elem,
            open: val,
          }
        }
        return elem;
      })
    })
  }

  return (
    <div className='w-full py-4 px-6'>
      {
        loading
        ? <Loader size='big' />
        : <>
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
              <input placeholder='Search task' className='md:w-80 w-52' value={keywords}
                onChange={(e) => setKeywords(e.target.value)} />
            </div>
          </div>
          <div className='w-full'>
            {
              curTasks.map((elem, idx) => {
                return (
                  <div key={elem.task_id}>
                    <div onClick={() => changeTaskModalDisplay(idx, true)}
                      className='w-full flex my-6 bg-white rounded-lg p-4 cursor-pointer'>
                      <div className='w-full'>
                        <div className='font-bold mb-2'>{elem.name}</div>
                        <div className='text-gray-500 mb-2'>
                          {elem.description}
                        </div>
                        <div className='flex'>
                          <Tag
                            color={statusColour.get(elem.status) as Colour}
                            classNames='grid place-items-center mx-2'
                          >
                            {elem.status}
                          </Tag>
                          <Tag 
                            color={priorityColour.get(elem.priority) as Colour}
                            classNames='grid place-items-center mx-2'
                          >
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
                          <Members members={tasks[idx].assignments.map(elem => {
                            return {
                              member_id: elem.user_id,
                              username: elem.username,
                              image_url: elem.image_url
                            }
                          })} />
                        </div>
                      </div>
                    </div>
                    { tasks[idx].open && (
                      <TaskModal onModalClose={() => changeTaskModalDisplay(idx, false)} task={tasks[idx]} />
                    )}
                  </div>
                )
              })
            }
          </div>
          <div className="w-full text-center">
            Pagination
          </div>
        </>
      }
    </div>
  )
}