import { useState } from "react"
import { projects } from "./utils.project";
import Members from "../../components/Members";
import { Link } from "react-router-dom";
import { FiSearch } from 'react-icons/fi'

export default function Projects() {
  const [criteria, setCriteria] = useState('oldest first');
  return (
    <div className='p-10 w-full'>
      <div className='w-full mb-12'>
        <div className='mb-4 text-right'>
          <select value={criteria} onChange={e => setCriteria(e.target.value)}
            className='bg-green-200 text-green-800 focus:border-none outline-none'>
            <option value='oldest first'>Oldest first</option>
            <option value='newest first'>Newest first</option>
            <option value='most tasks'>Most assigned tasks</option>
            <option value='least tasks'>Least assigned tasks</option>
          </select>
        </div>
        <div className='text-center m-auto border-2 flex place-content-center rounded-md w-fit bg-white'>
          <FiSearch size={30} className='pt-2 pl-2' />
          <input placeholder='Search projects' className='w-80' />
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4'>
        {
          projects.map(elem => {
            return <Link to={`/projects/${elem.id}`} key={elem.id}
              className='p-4 bg-white shadow-md rounded-lg hover:bg-gray-300 transition-all'>
              <h3>{elem.title}</h3>
              <hr />
              <p className='py-4'>{elem.description}</p>
              <div className='flex justify-between'>
                <Members members={[{id: 1, member: ''}, {id: 2, member: ''}, 
                  {id: 3, member: ''}, {id: 4, member: ''}, {id: 5, member: ''}, {id: 6, member: ''}]} />
                <div className='grid place-items-center'>Tasks: {elem.assignedTasks}</div>
              </div>
            </Link>
          })
        }
      </div>
      <div className='text-center py-4'>
        Pagination
      </div>
    </div>
  )
}