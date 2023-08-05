import { ChangeEvent, useState } from "react"
import { people } from "./utils.project";
import { AiFillMinusCircle } from "react-icons/ai";

const initialState = {
  title: '',
  description: '',
  members: people,
}
/*

Add delete button for members

*/

export default function CreateProject() {
  const [project, setProject] = useState(initialState);
  const [memberID, setMemberID] = useState('');

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

  function addMember() {
    const num: number = Number(memberID);
    setMemberID('');
    if (num > people.length || num < 1) {
      console.log('Invalid memberID');
      return;
    }
    const person = people[num - 1];
    person.id *= 10;
    // check if it already exists
    setProject(oldVal => {
      return {
        ...oldVal,
        members: [...oldVal.members, person],
      }
    })
  }

  function removeMember(memIdx: number) {
    setProject(oldProject => {
      return {
        ...oldProject,
        members: oldProject.members.filter((elem, idx) => {
          if (idx !== memIdx) {
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
            className='ml-4 px-3 py-2 border-blue-500 rounded-md border-solid'>
            Add member
          </button>
        </div>
        <div>
          <div className='font-bold text-lg block mb-3'>Members</div>
          <div>
            {
              project.members.length === 0
              ? <h3>No other members</h3>
              : <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 max-h-80 overflow-auto'>
                {
                  project.members.map((elem, idx) => {
                    return (
                      <div key={elem.id} className='mb-4 border-b-2 border-b-gray-200 flex justify-between'>
                        <div className='flex'>
                          <div>{elem.name}</div>
                          <div className='text-gray-400 mx-4'>{elem.role}</div>
                        </div>
                        <button onClick={() => removeMember(idx)}>
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
          <button className='mx-2 px-4 py-2 text-white bg-blue-500
            rounded-xl font-bold border-blue-500 border-solid'>
            Create
          </button>
          <button className='px-4 py-2 text-blue-500 bg-white border-blue-500 
            border-solid rounded-xl font-bold'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}