import { Link } from "react-router-dom";
import { projects } from "./utils.dashboard";
import Members from "../../components/Members";

export default function Dashboard() {
  return (
    <div className='w-full'>
      <div className='w-full flex justify-between px-8 py-6'>
        <h2 className=''>Dashboard</h2>
        <button className='bg-primary px-4 py-2 rounded hover:shadow-md'>New project</button>
      </div>
      <div className='grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 gap-4 px-8'>
        <div className='bg-white rounded-md shadow-md'>
          <div className='text-center'>
            <h3 className='py-4 m-auto border-b-2'>Recent visited projects</h3>
          </div>
          {
            projects.map(elem => {
              return (
                <div key={elem.id} className='hover:bg-gray-200 p-4 text-sm'>
                  <Link to={`/projects/${elem.id}`} className='w-full'>
                    <h4 className='underline'>{elem.title}</h4>
                    <p>{elem.description}</p>
                    <div className='flex w-full justify-between'>
                      <Members members={[{id: 1, member: ''}, {id: 2, member: ''}, 
                        {id: 3, member: ''}, {id: 4, member: ''}, {id: 5, member: ''}, {id: 6, member: ''}]} />
                      <div className='grid place-items-center'>{elem.assignedTasks} tasks assigned</div>
                    </div>
                  </Link>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}