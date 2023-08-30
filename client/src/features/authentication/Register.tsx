import { AiFillEye, AiFillEyeInvisible, AiFillGithub, AiOutlineGoogle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { tailwindClasses, thirdPartySignUp } from "./utils.auth";
import { ChangeEvent, useState } from "react";
import { useUserContext } from "../../context/user";

type Form = {
  username: string,
  password: string,
  visible: boolean,
}

export default function Register() {
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
    await register(formData.password, formData.username);
  }

  return (
    <div className='text-center grid place-content-center m-auto py-16 w-[500px]'>
        <h2 className='my-3'>Welcome to our platform!</h2>
        <p>
          To access our services, please sign up with your favourite platform or choose your credentials.
        </p>
        <form onSubmit={handleFormSubmit} className='flex flex-col w-full place-items-center'>
          <div className='flex w-3/4 place-content-center border-b-2 border-solid border-b-black mb-4'>
            <input name='username' className='pl-0 w-full' value={formData.username} 
              placeholder='Write your username' onChange={handleFormDataChange} />
          </div>
          <div className='flex justify-between w-3/4 place-content-center border-b-2 border-solid border-b-black mb-4'>
            <input name='password' type={`${formData.visible ? 'text' : 'password'}`} className='pl-0 w-full' 
              value={formData.password} placeholder='Write your password' onChange={handleFormDataChange} />
            <button onClick={handleVisibilityChange}>
              {
                formData.visible
                ? <AiFillEyeInvisible size='25' />
                : <AiFillEye size='25' />
              }
            </button>
          </div>
        </form>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full cursor-pointer'
            onClick={async () => await thirdPartySignUp('google')}>
            <div className='pr-1'>Sign up with</div>
            <div><AiOutlineGoogle size={25} /></div>
          </div>
        </button>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full cursor-pointer'
            onClick={async () => await thirdPartySignUp('github')}>
            <div className='pr-1'>Sign up with</div>
            <div><AiFillGithub size={25} /></div>
          </div>
        </button>
        <div className='mt-4'>
          <div className='inline pr-1'>Already have an account?</div>
          <Link to='/register' className='underline'>Go to the sign in page</Link>
        </div>
      </div>
  )
}