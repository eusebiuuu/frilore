import { AiFillEye, AiFillEyeInvisible, AiFillGithub } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { tailwindClasses } from "./utils.auth";
import { ChangeEvent, useState } from "react";
import { useUserContext } from "../../context/user";
import { toast } from "react-toastify";
import TestUsers from "./TestUsers";

type Form = {
  username: string,
  password: string,
  visible: boolean,
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useUserContext();
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
    if (formData.password.length < 6) {
      toast.error('Password must have at least 6 characters');
      return;
    }
    await register(formData.password, formData.username);
    navigate('/');
  }

  return (
    <div className='text-center grid place-content-center m-auto py-16 w-[500px]'>
        <h2 className='my-3'>Welcome to our platform!</h2>
        <p>
          To access our services, please sign up with your favourite platform or choose your credentials.
        </p>
        <form onSubmit={handleFormSubmit} className='flex flex-col w-full place-items-center mb-8'>
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
              Register
            </button>
          </div>
        </form>
        <TestUsers />
        <a href={`${window.location.origin.toString()}/api/v1/auth/github`} className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full cursor-pointer'>
            <div className='pr-1'>Sign up with</div>
            <div><AiFillGithub size={25} /></div>
          </div>
        </a>
        <div className='mt-4'>
          <div className='inline pr-1'>Already have an account?</div>
          <Link to='/login' className='underline'>Go to the sign in page</Link>
        </div>
      </div>
  )
}