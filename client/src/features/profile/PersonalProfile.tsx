import logo from '../../assets/logo.svg'
import { MdOutlineWorkOutline } from 'react-icons/md'
import { AiOutlineCalendar, AiOutlineFundProjectionScreen, AiOutlineMail } from 'react-icons/ai'
import Field from './Field'
import Input from './Input'
import { ChangeEvent, useState } from 'react'
import CountrySelector from './CountriesSelector'
import { COUNTRIES, SelectMenuOption, projects } from './utils.profile'
import project from '../../assets/project.png'
import { Link } from 'react-router-dom'

const initialFormData = {
  firstName: '',
  lastName: '',
  email: 'yghori@asite.com',
  mainRole: '',
  country: 'Afghanistan',
}

export default function PersonalProfile() {
  const [formData, setFormData] = useState(initialFormData);
  const [isOpen, setIsOpen] = useState(false);

  function handleFormDataChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData(oldVal => {
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    });
  }

  return (
    <div className='py-6 px-4'>
      <div className='grid grid-cols-1 lg:grid-cols-profile gap-4 place-items-center lg:place-items-stretch'>
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
        <div className=' w-fit rounded-lg shadow-lg bg-white  p-4'>
          <h2 className='mb-2'>Edit profile</h2>
          <div className='grid grid-cols-2 gap-3 place-content-center'>
            <Input inputName='firstName' name='First Name' value={formData.firstName}
              onInputChange={handleFormDataChange} />
            <Input inputName='lastName' name='Last Name' value={formData.lastName}
              onInputChange={handleFormDataChange} />
            <Input inputName='email' name='Email' value={formData.email}
              onInputChange={handleFormDataChange} disabled />
            <Input inputName='mainRole' name='Role' value={formData.mainRole}
              onInputChange={handleFormDataChange} />
            <CountrySelector id='country' open={isOpen} 
              onToggle={() => setIsOpen(val => !val)} onChange={newVal => {
                setFormData((oldVal) => {
                  return { ...oldVal, 'country': newVal }
                })
              }}
              selectedValue={COUNTRIES.find(option => option.title === formData.country) as SelectMenuOption} />
          </div>
          <label className="block mt-3 mb-1 font-medium text-gray-900 dark:text-white" htmlFor="file_input">
            Upload a new profile image
          </label>
          <input className="block w-full text-sm text-gray-900 border
            border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 
            focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"     
            aria-describedby="file_input_help" id="file_input" type="file" accept='.svg, .png, .jpg, .jpeg'
          />
          <div className='text-center'>
            <button className='mt-6 m-auto w-fit rounded-lg text-white bg-blue-400 px-4 py-2'>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className='w-full rounded-lg p-4 grid grid-cols-2 gap-5 bg-white shadow-md mt-6'>
        {
          projects.map(elem => {
            return (
              <Link to={`project/${elem.id}`} key={elem.id} 
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
      <div className='w-full my-8'>
        <button className='float-right bg-red-500 font-bold p-4 rounded-xl'>
          Delete account
        </button>
      </div>
    </div>
  )
}