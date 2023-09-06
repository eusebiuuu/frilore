import { useEffect, useState } from "react";
import { CompleteProject } from "./utils.project";
import { GrClose } from "react-icons/gr";
import { BsThreeDotsVertical } from 'react-icons/bs'
import logo from '../../assets/logo.svg'
import { Link, useNavigate, useParams } from "react-router-dom";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";
import ButtonsDropdown from "../../components/ButtonsDropdown";
import Lists from "./Lists";
import Modal from "../../components/Modal";
import ListModal from "./ListModal";
import { getProjectDropdown } from "./dropdownActions";
import CreateTaskModal from "../tasks/CreateTaskModal";
import { notificationsSocket } from "../../socket";
import { useUserContext } from "../../context/user";
import TaskModal from "../tasks/TaskModal";
import { useModalContext } from "../../context/modals";

export default function SingleProject() {
  const { modalInfo, onGeneralModalChange, onModalToggle } = useModalContext();
  const [members, setMembers] = useState(false);
  const { id: projectID } = useParams();
  const { user, isSidebarOpen } = useUserContext();
  const [project, setProject] = useState<CompleteProject>();
  const [loading, setLoading] = useState(true);
  const [projectDropdown, setProjectDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await customFetch.get(`/project/${projectID}`);
        setProject(result.data.project);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleProjectChange(newProject: CompleteProject) {
    setProject(newProject);
  }

  async function handleProjectLeave() {
    try {
      await customFetch.delete(`/registration/${projectID}/${user?.user_id}`);
      notificationsSocket.emit('delete-registration', project?.name, true, user?.user_id);
      navigate('/projects');
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function handleLeaveProjectModalOpen() {
    onGeneralModalChange(true, {
      onModalClose: () => onModalToggle('general', false),
      rightAction: handleProjectLeave,
      rightContent: 'Leave',
      question: 'Are you sure you want to leave the project?',
    });
  }

  return (
    <div className={`${isSidebarOpen && 'md:w-[calc(100%-16rem)]'} w-full p-8`}>
      {
        loading
        ? <Loader size='big' />
        : <>
          { modalInfo.general.open && <Modal {...modalInfo.general.content} /> }
          { modalInfo.list.open && <ListModal {...modalInfo.list.content} /> }
          { modalInfo.actionTask.open && <CreateTaskModal {...modalInfo.actionTask.content} /> }
          { modalInfo.singleTask.open && <TaskModal {...modalInfo.singleTask.content} /> }
          <div className="w-full flex justify-between">
            <div className='relative'>
              <button className='bg-primary px-4 py-2 relative' onClick={() => setMembers(true)}>
                View all members
              </button>
              <div className={`absolute z-10 w-72 shadow-lg top-10 bg-white 
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
            <div>
              <button className='bg-primary px-4 py-2 relative' onClick={handleLeaveProjectModalOpen}>
                Leave project
              </button>
            </div>
          </div>
          <div className='my-6'>
            💡Tip! Hold <code className='font-bold'>Shift</code> while scrolling to scroll horizontally! 😉
          </div>
          <div className='bg-white rounded-md p-4 my-6 w-full'>
            <div className='flex justify-between pb-4 w-full'>
              <h2>Project overview</h2>
              <div className='relative'>
                <button onClick={() => setProjectDropdown(true)}>
                  <BsThreeDotsVertical size={40} />
                </button>
                { projectDropdown && project && (
                  <ButtonsDropdown 
                    lines={() => getProjectDropdown(project, handleProjectChange)}
                    onDropdownClose={() => setProjectDropdown(false)}
                  />
                )}
              </div>
            </div>
            <hr className='mb-3' />
            <div className='w-full shadow-[inset_0px_-12px_12px_rgba(0,0,0,0.8)] p-2 bg-transparent'>
              {project && <Lists project={project} onProjectChange={handleProjectChange} />}
            </div>
          </div>
        </>
      }
    </div>
  )
}