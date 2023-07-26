import logo from '../../assets/logo.svg'
import { MdOutlineWorkOutline } from 'react-icons/md'
import { AiOutlineCalendar, AiOutlineFundProjectionScreen, AiOutlineMail } from 'react-icons/ai'
import Field from './Field'
import userProfile from '../../assets/user-profile.svg'
import { projects } from './utils.profile'
import { Link } from 'react-router-dom'
import project from '../../assets/project.png'

const formData = {
  firstName: '',
  lastName: '',
  email: 'yghori@asite.com',
  mainRole: 'Web designer',
  country: 'Afghanistan',
  description: 'Lorem Ipsum is the best sentence in the world of dummy text'
}

export default function ForeignProfile() {

  return (
    <div className='w-full p-6'>
      <div className='w-full grid grid-cols-1 lg:grid-cols-profile
        gap-4 place-items-center lg:place-items-stretch'>
        <div className='w-72 text-center rounded-lg shadow-lg bg-white grid place-content-center p-4'>
          <img src={logo} alt='profile' className='h-40 w-40 m-auto border-2 border-transparent
            outline-2 outline outline-red-500 rounded-full my-2' />
          <div className='font-bold'>Vladimir Korotkevitch</div>
          <p>{formData.country}</p>
          <hr />
          <Field icon={MdOutlineWorkOutline} text={formData.mainRole} />
          <Field icon={AiOutlineCalendar} text='25 years' />
          <Field icon={AiOutlineMail} text={formData.email} />
          <Field icon={AiOutlineFundProjectionScreen} text='29 tasks in 7 projects' />
        </div>
        <div className='rounded-md bg-white shadow-md p-4'>
          <div className='relative mb-20'>
            <h3>{formData.mainRole}</h3>
            <div className='absolute top-8 left-0 bg-gray-200 p-2 rounded-md'>
              {formData.description}
            </div>
            <div className='absolute border-transparent border-b-8 border-l-8 border-r-8 border-b-gray-200
              w-0 h-0 top-6 left-6'></div>
          </div>
          <div className='w-full'>
            <div className='font-bold'>
              Recent teammates
            </div>
            <div className='w-full grid grid-cols-3 gap-3'>
              {
                [1, 2, 3, 4, 5, 6, 7, 8].map(elem => {
                  return (
                    <div key={elem} className=''>
                      <img src={userProfile} alt='profile' className='w-32 h-32 rounded-full' />
                      <div className='font-bold w-full text-center'>User name {elem}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <div className='w-full rounded-lg p-4 grid grid-cols-2 gap-5 bg-white shadow-md mt-6'>
        {
          projects.map(elem => {
            return (
              <Link to={`/projects/${elem.id}`} key={elem.id} 
                className='flex place-items-center hover:bg-gray-200 transition-all rounded-md'>
                <img src={project} className='w-24 h-24' />
                <div className='ml-2'>
                  <h3>{elem.title}</h3>
                  <p>{elem.tasks} tasks</p>
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}