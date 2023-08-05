import { Link } from "react-router-dom";
import { projects } from "./utils.stats";
import { getDaysAgo, tasks } from "../tasks/utils.tasks";
import Tag from "../../components/Tag";

export default function PersonalStats() {
  return (
    <div className='w-full'>
      <div className='w-full flex justify-between px-8 py-6'>
        <h2 className=''>Dashboard</h2>
        <button className='bg-primary px-4 py-2 rounded hover:shadow-md'>New project</button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 px-8 mb-10'>
        <div className='bg-white rounded-md shadow-md'>
          <h3 className='m-3'>Recent projects</h3>
          <hr />
          {
            projects.map(elem => {
              return (
                <div key={elem.id} className='hover:bg-gray-200 p-4 text-sm'>
                  <Link to={`/projects/${elem.id}`} className='w-full'>
                    <div className='underline font-bold text-lg'>{elem.title}</div>
                    <p>{elem.description}</p>
                    <div className='flex w-full justify-between'>
                      <div className='grid place-items-center'>{elem.assignedTasks} tasks assigned</div>
                    </div>
                  </Link>
                </div>
              )
            })
          }
        </div>
        <div className='bg-white rounded-md shadow-md'>
          <h3 className='m-3'>Recent assigned tasks</h3>
          <hr />
          <div>
            {
              tasks.slice(0, 3).map(elem => {
                return (
                  <div key={elem.id} className='hover:bg-gray-200'>
                    <div className='w-full flex p-4'>
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
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}