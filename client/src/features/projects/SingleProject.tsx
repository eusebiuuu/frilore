import { useEffect, useState } from "react";
import { CompleteProject, ModalData, Task } from "./utils.project";
import { GrClose } from "react-icons/gr";
import { BsThreeDotsVertical } from 'react-icons/bs'
import logo from '../../assets/logo.svg'
import { Link, useNavigate, useParams } from "react-router-dom";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";
import { nanoid } from "nanoid";
import ButtonsDropdown from "../../components/ButtonsDropdown";
import Lists from "./Lists";
import Modal from "../../components/Modal";
import ListModal from "./ListModal";
import { getProjectDropdown } from "./dropdown-logic";
import CreateTaskModal from "../tasks/CreateTaskModal";

/*
- drag and drops (https://github.com/atlassian/react-beautiful-dnd) (this could make the difference)
*/

const initialState = {
  content: '',
  text: '',
  action: async () => {},
  open: false,
}

export interface ITaskData extends Task {
  action: 'update' | 'create',
  listID: string,
}

const initialStateTask: ITaskData = {
  task_id: '',
  name: '',
  status: 'to do',
  deadline: '2023-05-23',
  description: '',
  priority: 'high',
  assignments: [],
  action: 'create',
  listID: '',
}

export default function SingleProject() {
  const [showUpdates, setShowUpdates] = useState(false);
  const [members, setMembers] = useState(false);
  const { id: projectID } = useParams();
  const [project, setProject] = useState<CompleteProject>();
  const [changed, setChanged] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectDropdown, setProjectDropdown] = useState(false);
  const [modalData, setModalData] = useState<ModalData>(initialState);
  const [listModal, setListModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState<ITaskData>(initialStateTask);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get(`/project/${projectID}`);
        setProject(result.data.project);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [changed]);

  function handleModalDataChange(data: ModalData) {
    setModalData(data);
  }

  async function handleProjectDelete() {
    try {
      await customFetch.delete(`/project/${projectID}`);
    } catch (err) {
      catchAxiosError(err);
    }
    navigate('/projects');
  }

  async function handleListCreate(title: string) {
    try {
      await customFetch.post(`/list`, {
        title,
        projectID,
      });
    } catch (err) {
      catchAxiosError(err);
    }
    setChanged(oldVal => oldVal + 1);
  }

  function handleModalChange(val: boolean) {
    setModalData(oldVal => {
      return {
        ...oldVal,
        open: val,
      }
    })
  }

  function handleListModalChange(val: boolean) {
    setListModal(val);
    setChanged(oldVal => oldVal + Number(!val));
  }

  function handleTaskModalClose() {
    setTaskModalData(oldVal => {
      return {
        ...oldVal,
        open: false,
      }
    })
    setChanged(oldVal => oldVal + 1);
  }

  async function handleProjectLeave() {
    try {
      const result = await customFetch.get(`/registration/single/${projectID}`);
      await customFetch.delete(`/registration/${result.data.registration.registration_id}`);
    } catch (err) {
      catchAxiosError(err);
    }
  }

  return (
    <div className='md:w-[calc(100%-16rem)] sm:w-full p-8'>
      {
        loading
        ? <Loader size='big' />
        : <>
          { modalData.open && <Modal question={modalData.content} leftContent="Cancel"
            onModalClose={() => handleModalChange(false)} 
            rightContent={modalData.text} rightAction={modalData.action} /> }
          { listModal && <ListModal action={handleListCreate} onModalClose={() => handleListModalChange(false)} />}
          {taskModalData.open && <CreateTaskModal onModalClose={handleTaskModalClose}
            type={taskModalData.action} task={taskModalData} members={project?.members || []}
            listID={taskModalData.listID}
          />}
          <div className='flex justify-between'>
            <div className='relative'>
              <button className='bg-primary px-4 py-2 relative' onClick={() => setMembers(true)}>
                View all members
              </button>
              <div className={`absolute z-20 w-72 shadow-lg top-10 bg-white 
                left-0 ${members ? 'block' : 'hidden'} h-80 overflow-auto`}>
                <div className='w-full flex justify-between sticky top-0 p-2 bg-white shadow-md'>
                  <h3>Members</h3>
                  <button onClick={() => setMembers(false)}>
                    <GrClose size={25} />
                  </button>
                </div>
                {
                  project?.members.map(elem => {
                    return (
                      <div key={elem.member_id} className='w-full p-2'>
                        <Link to={`/profile/${elem.member_id}`} className="flex w-fit">
                          <img src={logo} className='h-8 w-8 rounded-full' />
                          <div className='pl-3 grid place-items-center'>
                            {elem.username}
                          </div>
                        </Link>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <button className={`bg-primary py-2 px-4`} onClick={() => setShowUpdates(true)}>Last updates</button>
            <div className={`fixed bg-black opacity-50 top-0 z-40 left-0 
              w-screen h-screen ${!showUpdates ? 'hidden' : 'block'}`}></div>
            <div className={`w-80 bg-white fixed transition-all z-40 top-0 h-full overflow-auto
              right-0 ${showUpdates ? 'translate-x-0' : 'translate-x-full'}`}>
              <ul className='py-4 px-2 list-disc marker:text-red-800 list-inside'>
                <div className="flex justify-between mb-4">
                  <h3 className=''>Last updates</h3>
                  <button onClick={() => setShowUpdates(false)}>
                    <GrClose size={25} className='hover:scale-125 transition-all' />
                  </button>
                </div>
                {
                  project?.last_updates.map(elem => {
                    return <li key={nanoid()} className='my-3 text-sm'>{elem}</li>
                  })
                }
              </ul>
            </div>
          </div>
          <div className='my-6'>
            💡Tip! Hold <code className='font-bold'>Shift</code> while scrolling to scroll horizontally! ;)
          </div>
          <div className='bg-white rounded-md p-4 my-6 w-full'>
            <div className='flex justify-between pb-4 w-full'>
              <h2>Project overview</h2>
              <div className='relative'>
                <button onClick={() => setProjectDropdown(true)}>
                  <BsThreeDotsVertical size={40} />
                </button>
                { projectDropdown && (
                  <ButtonsDropdown lines={getProjectDropdown(
                    handleModalDataChange, projectID,
                    () => handleListModalChange(true),
                    async () => await handleProjectDelete(),
                    async () => await handleProjectLeave()
                    )} onDropdownClose={() => setProjectDropdown(false)}
                  />
                )}
              </div>
              
            </div>
            <hr className='mb-3' />
            <Lists project={project} onModalDataChange={handleModalDataChange} setTaskModalData={setTaskModalData}
              taskModalData={taskModalData} setChanged={setChanged} />
          </div>
        </>
      }
    </div>
  )
}