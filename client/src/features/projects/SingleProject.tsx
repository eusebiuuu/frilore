import { useState } from "react";
import { allMembers, lastUpdates, tasks } from "./utils.project";
import { GrClose } from "react-icons/gr";
import { BsThreeDotsVertical, BsThreeDots } from 'react-icons/bs'
import { AiOutlinePlus, AiOutlineClockCircle } from 'react-icons/ai'
import logo from '../../assets/logo.svg'
import { Link } from "react-router-dom";
import Members from "../../components/Members";

/*
- Single task: draggings, open modal, update task
- Last updates functionalities: DB model??, last 20 updates
- Lists: create, delete, clear all tasks, add task, sections, cloning, 
- General: update members, update project, delete project, chat redirection
- Registration CRUD & the rest of the models CRUD
- Leave project etc.
*/

export default function SingleProject() {
  const [updates, setUpdates] = useState(false);
  const [members, setMembers] = useState(false);
  return (
    <div className='md:w-[calc(100%-16rem)] sm:w-full p-8'>
      <div className='flex justify-between'>
        <div className='relative'>
          <button className='bg-primary px-4 py-2 relative' onClick={() => setMembers(true)}>View all members</button>
          <div className={`absolute z-20 w-72 shadow-lg top-10 bg-white 
            left-0 ${members ? 'block' : 'hidden'} h-80 overflow-auto`}>
            <div className='w-full flex justify-between sticky top-0 p-2 bg-white shadow-md'>
              <h3>Members</h3>
              <button onClick={() => setMembers(false)}>
                <GrClose size={25} />
              </button>
            </div>
            {
              allMembers.map(elem => {
                return (
                  <div key={elem.id} className='w-full p-2'>
                    <Link to={`/profile/${elem.id}`} className="flex w-fit">
                      <img src={logo} className='h-8 w-8 rounded-full' />
                      <div className='pl-3 grid place-items-center'>
                        {elem.name}
                      </div>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </div>
        <button className={`bg-primary py-2 px-4`} onClick={() => setUpdates(true)}>Last updates</button>
        <div className={`fixed bg-black opacity-50 top-0 z-40 left-0 
          w-screen h-screen ${!updates ? 'hidden' : 'block'}`}></div>
        <div className={`w-80 bg-white fixed transition-all z-40 top-0 h-full overflow-auto
          right-0 ${updates ? 'translate-x-0' : 'translate-x-full'}`}>
          <ul className='py-4 px-2 list-disc marker:text-red-800 list-inside'>
            <div className="flex justify-between mb-4">
              <h3 className=''>Last updates</h3>
              <button onClick={() => setUpdates(false)}>
                <GrClose size={25} className='hover:scale-125 transition-all' />
              </button>
            </div>
            {
              lastUpdates.map(elem => {
                return <li key={elem.id} className='my-3 text-sm'>{elem.description}</li>
              })
            }
          </ul>
        </div>
      </div>
      <div className='bg-white rounded-md p-4 my-6 w-full'>
        <div className='flex justify-between pb-4 w-full'>
          <h2>Project overview</h2>
          <button>
            <BsThreeDotsVertical size={40} />
          </button>
        </div>
        <hr className='mb-3' />
        <div className='flex overflow-auto w-full rotate-x'>
          {
            [1, 2, 3].map(elem => {
              return (
                <div key={elem} className='border-gray-200 border-solid 
                  border-2 rounded-lg min-w-96 mb-6 mx-5 rotate-scroll rotate-x'>
                  <div className='flex justify-between bg-gray-200 p-3 rounded-t-md'>
                    <h4 className='grid place-content-center'>List 1</h4>
                    <button>
                      <BsThreeDots size={25} />
                    </button>
                  </div>
                  <div className='p-4'>
                    <button className='w-full rounded-2xl border-dashed border-4 grid place-content-center py-1'>
                      <AiOutlinePlus size={30} />
                    </button>
                    <div className='grid grid-cols-1'>
                      {
                        tasks.map(elem => {
                          return <div key={elem.id} className='p-4 rounded-2xl border-2 shadow-sm mt-4'>
                            <div className='flex justify-between'>
                              <div className='font-bold'>{elem.title}</div>
                              <div className='flex'>
                                <AiOutlineClockCircle size={23} />
                                <div className='pl-1'>{elem.days} days</div>
                              </div>
                              <button>
                                <BsThreeDotsVertical size={23} />
                              </button>
                            </div>
                            <div className='text-gray-500'>{elem.description}</div>
                            <Members members={[{id: 1, member: ''}, {id: 2, member: ''}, 
                              {id: 3, member: ''}, {id: 4, member: ''}, {id: 5, member: ''}, {id: 6, member: ''}]} />
                          </div>
                        })
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}