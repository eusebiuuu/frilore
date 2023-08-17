import { ChangeEvent, useState } from "react"
import { AiFillMinusCircle } from "react-icons/ai";
import customFetch from "../../lib/customFetch";
import { toast } from "react-toastify";
import { catchAxiosError } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton";

/*
- Optimise the update functionality
*/

type Member = {
  id: string,
  name: string,
  role: string,
}

type Project = {
  title: string,
  description: string,
  members: Member[],
}

const initialState = {
  title: '',
  description: '',
  members: [],
}

/*
- Check if the author is in the list on member addition using userContext
- is_leader update functionality
*/

export default function CreateProject() {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>(initialState);
  const [memberID, setMemberID] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const { id: projectID } = useParams();
  const edit = Boolean(projectID);

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
    const exists = project.members.find(elem => {
      return elem.id === memberID ? elem : null;
    });
    if (exists) {
      toast.error('The user already exists');
      return;
    }
    setMemberLoading(true);
    try {
      const result = await customFetch.get(`user/${memberID}`);
      setProject(oldVal => {
        return {
          ...oldVal,
          members: [...oldVal.members, {
            name: result.data.user.username,
            role: result.data.user.role,
            id: result.data.user.user_id,
          }]
        }
      });
    } catch (err) {
      catchAxiosError(err);
    } finally {
      setMemberLoading(false);
    }
  }

  async function handleProjectAction() {
    setProjectLoading(true);
    try {
      let newProject;
      if (edit) {
        newProject = await customFetch.patch(`/project/${projectID}`);
      } else {
        newProject = await customFetch.post('/project', project);
      }
      for (const member of project.members) {
        await customFetch.post('registration', {
          candidateID: member.id,
          projectID: newProject.data.project.project_id,
          // is_leader
        });
      }
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
          if (elem.id !== memberID) {
            return elem;
          }
        })
      }
    })
  }

  return (
    <div className='p-6 w-full'>
      <div className='bg-white p-6 rounded-lg w-full'>
        <div className='w-full'>
          <label htmlFor='title' className='font-bold text-lg block mb-3'>Project title</label>
          <input value={project.title} name='title' id='title' onChange={handleProjectChange}
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
          <button onClick={addMember}
            className='ml-4 border-blue-500 px-3 py-2 rounded-md border-solid'
            disabled={memberLoading}>
            {!memberLoading ? 'Add member' : 'Loading...'}
          </button>
        </div>
        <div>
          <div className='font-bold text-lg block mb-3'>Members</div>
          <div>
            {
              project.members.length === 0
              ? <h3>No members yet</h3>
              : <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 max-h-80 overflow-auto'>
                {
                  project.members.map(elem => {
                    return (
                      <div key={elem.id} className='mb-4 border-b-2 border-b-gray-200 flex justify-between'>
                        <div className='flex'>
                          <div>{elem.name}</div>
                          <div className='text-gray-400 mx-4'>{elem.role}</div>
                        </div>
                        <button onClick={() => removeMember(elem.id)}>
                          <AiFillMinusCircle size={25} />
                        </button>
                      </div>
                    )
                  })
                }
              </div>
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
    </div>
  )
}