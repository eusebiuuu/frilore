import { ChangeEvent, useEffect, useState } from "react"
import { AiFillMinusCircle } from "react-icons/ai";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";
import { useUserContext } from "../../context/user";
import { addMemberToProject, handleRegistrationsChange } from "./utils.project";
import Loader from "../../components/Loader";
import { getNonEmptyContent } from "../../utils/emptyValue";

export type DetailedMember = {
  member_id: string,
  username: string,
  role: string,
  is_leader: boolean,
  image_url: string,
}

export type Project = {
  name: string,
  description: string,
  members: DetailedMember[],
}

export default function CreateProject() {
  const { user } = useUserContext();
  const initialState: Project = {
    name: '',
    description: '',
    members: [{
      member_id: user?.user_id || '',
      username: user?.username || '',
      role: !user || !user.role || user.role === '' ? 'no role specified' : user.role,
      is_leader: true,
      image_url: user?.image_url || ''
    }],
  }
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>(initialState);
  const [memberID, setMemberID] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);
  const [initialRegistrations, setInitialRegistrations] = useState<DetailedMember[]>([]);
  const { id: projectID } = useParams();
  const edit = Boolean(projectID);

  useEffect(() => {
    (async () => {
      try {
          if (edit) {
            const result = await customFetch.get(`/project/members/${projectID}`);
            setProject(result.data.project);
            setInitialRegistrations(result.data.project.members);
          }
        } catch (err) {
          catchAxiosError(err);
        } finally {
          setProjectLoading(false);
        }
    })();
  }, []);

  function handleProjectChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.target.name === 'members') {
      return;
    }
    setProject(oldVal => {
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    });
  }

  async function addMember() {
    await addMemberToProject(project, memberID, setMemberLoading, setProject);
  }

  async function handleProjectAction() {
    setProjectLoading(true);
    try {
      const newProject = await handleRegistrationsChange(edit, project, projectID || '', 
        initialRegistrations, user?.user_id || '');
      navigate(`/projects/${newProject.data.project.project_id}`);
    } catch (err) {
      catchAxiosError(err);
    } finally {
      setProjectLoading(false);
    }
  }

  function removeMember(memberID: string) {
    setProject(oldProject => {
      return {
        ...oldProject,
        members: oldProject.members.filter(elem => {
          if (elem.member_id !== memberID) {
            return elem;
          }
        })
      }
    })
  }

  function handleLeaderStateChange(idx: number) {
    setProject(oldVal => {
      return {
        ...oldVal,
        members: oldVal.members.map((elem, currIdx) => {
          if (currIdx === idx) {
            return {
              ...elem,
              is_leader: !elem.is_leader,
            }
          }
          return elem;
        })
      }
    })
  }

  return (
    <div className='p-6 w-full'>
      {
        !project
        ? <Loader size='big' />
        : (
          <div className='bg-white p-6 rounded-lg w-full'>
            <div className='w-full'>
              <label htmlFor='title' className='font-bold text-lg block mb-3'>Project title</label>
              <input value={project.name} name='name' id='title' onChange={handleProjectChange}
                className='rounded-md border-solid border-gray-200 border-2 mb-5 focus:border-black' />
            </div>
            <div className='w-full'>
              <label htmlFor="description" className='font-bold text-lg block mb-3'>Project description</label>
              <textarea name='description' rows={7} id='description' value={project.description}
                onChange={handleProjectChange}
                className='rounded-md border-solid border-gray-200 border-2 w-full focus:border-black mb-5' />
            </div>
            <div>
              <label htmlFor='addMem' className='font-bold text-lg block mb-3'>Add more members to the project</label>
              <input value={memberID} id='addMem' onChange={(e) => setMemberID(e.target.value)}
                className='rounded-md border-solid border-gray-200 border-2 mb-5 focus:border-black' />
              {
                memberLoading
                ? <LoadingButton text="Loading..." />
                : (
                  <button onClick={addMember} disabled={memberLoading}
                    className='ml-4 border-blue-500 px-3 py-2 rounded-md border-solid text-center'>
                    {!memberLoading ? 'Add member' : 'Loading...'}
                  </button>
                )
              }
            </div>
            <div>
              <div className='font-bold text-lg block mb-3'>Members</div>
              <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 max-h-80 overflow-auto'>
                <div className='mb-4 border-b-2 border-b-gray-200 grid grid-cols-4 [&>div]:text-center 
                  [&>div]:font-bold'>
                  <div>Username</div>
                  <div>Role</div>
                  <div>Leader</div>
                  <div>Delete</div>
                </div>
                {
                  project.members.map((elem, idx) => {
                    return (
                      <div key={elem.member_id} className='mb-4 pb-2 border-b-2 border-b-gray-200 grid grid-cols-4 
                        [&>div]:place-content-center [&>div]:flex'>
                        <div>{elem.username}</div>
                        <div className='text-gray-400 mx-4'>{getNonEmptyContent(elem.role, 'no role')}</div>
                        <div>
                          <input type='checkbox' checked={elem.is_leader} 
                            className='disabled:cursor-not-allowed cursor-pointer scale-150'
                            onChange={() => handleLeaderStateChange(idx)} disabled={elem.member_id === user?.user_id} />
                        </div>
                        <div>
                          <button onClick={() => removeMember(elem.member_id)} 
                            disabled={elem.member_id === user?.user_id}
                            className='disabled:cursor-not-allowed flex place-content-center w-fit'>
                            <AiFillMinusCircle size={25} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='mt-8'>
              {
                projectLoading
                ? <LoadingButton text={edit ? 'Saving...' : 'Creating...'} />
                : (
                  <button className='mx-2 px-4 py-2 text-white bg-blue-500
                    rounded-xl font-bold border-blue-500 border-solid'
                    onClick={handleProjectAction}>
                    { edit ? 'Edit' : 'Create' }
                  </button>
                )
              }
              <button className='px-4 py-2 text-blue-500 bg-white border-blue-500 
                border-solid rounded-xl font-bold' onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}