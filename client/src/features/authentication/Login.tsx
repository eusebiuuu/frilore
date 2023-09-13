import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login.svg'
import { AiOutlineGoogle, AiFillGithub, AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { tailwindClasses } from './utils.auth';
import { ChangeEvent, useState } from 'react';
import { useUserContext } from '../../context/user';
import { toast } from 'react-toastify';
import TestUsers from './TestUsers';

type Form = {
  username: string,
  password: string,
  visible: boolean,
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [formData, setFormData] = useState<Form>({ username: '', password: '', visible: false });

  function handleFormDataChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData(oldVal => {
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    })
  }

  function handleVisibilityChange() {
    setFormData(oldVal => {
      return {
        ...oldVal,
        visible: !oldVal.visible,
      }
    })
  }

  async function handleFormSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formData.username === '' || formData.password === '') {
      toast.error('Empty values not allowed as input');
      return;
    }
    await login(formData.password, formData.username);
    navigate('/');
  }

  return (
    <div className='grid md:grid-cols-2 grid-cols-1 p-6 gap-4'>
      <img src={loginImage} className='w-fit' />
      <div className='text-center grid place-content-center'>
        <h2 className='my-6'>Please login</h2>
        <p>
          Welcome back! Please sign in with your favourite platform or write
          your credentials to enter in your account.
        </p>
        <form onSubmit={handleFormSubmit} className='flex flex-col w-full place-items-center'>
          <div className='flex w-3/4 place-content-center border-b-2 border-solid border-b-black mb-4'>
            <input name='username' className='pl-0 w-full' value={formData.username} 
              placeholder='Write your username' onChange={handleFormDataChange} />
          </div>
          <div className='flex justify-between w-3/4 place-content-center border-b-2 border-solid border-b-black mb-4'>
            <input name='password' type={`${formData.visible ? 'text' : 'password'}`} className='pl-0 w-full' 
              value={formData.password} placeholder='Write your password' onChange={handleFormDataChange} />
            <button type='button' onClick={handleVisibilityChange}>
              {
                formData.visible
                ? <AiFillEyeInvisible size='25' />
                : <AiFillEye size='25' />
              }
            </button>
          </div>
          <div className='w-full flex justify-center'>
            <button type='submit' className='bg-white rounded-lg shadow-md px-4 py-2 font-bold'>
              Login
            </button>
          </div>
        </form>
        <TestUsers />
        <a href={`${window.location.origin.toString()}/api/v1/auth/google`} className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full cursor-pointer'>
            <div className='pr-1'>Sign in with</div>
            <div><AiOutlineGoogle size={25} /></div>
          </div>
        </a>
        <a href={`${window.location.origin.toString()}/api/v1/auth/github`} className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full cursor-pointer'>
            <div className='pr-1'>Sign in with</div>
            <div><AiFillGithub size={25} /></div>
          </div>
        </a>
        <div className='mt-4'>
          <div className='inline pr-1'>Don`t have an account?</div>
          <Link to='/register' className='underline'>Sign up for free</Link>
        </div>
      </div>
    </div>
  )
}