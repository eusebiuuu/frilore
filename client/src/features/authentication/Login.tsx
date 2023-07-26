import { Link } from 'react-router-dom';
import loginImage from '../../assets/login.svg'
import { AiOutlineGoogle, AiFillGithub } from 'react-icons/ai'

export default function Login() {
  const tailwindClasses = 'w-96 block px-4 py-3 my-4 bg-white rounded-lg m-auto';
  return (
    <div className='grid md:grid-cols-2 grid-cols-1 p-6 gap-4'>
      <img src={loginImage} className='w-fit' />
      <div className='text-center grid place-content-center'>
        <h2 className='my-6'>Please login</h2>
        <p>Welcome back! Please sign in with your favourite platform to enter in your account.</p>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full'>
            <div className='pr-1'>Sign in with</div>
            <div><AiOutlineGoogle size={25} /></div>
          </div>
        </button>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full'>
            <div className='pr-1'>Sign in with</div>
            <div><AiFillGithub size={25} /></div>
          </div>
        </button>
        <div className='mt-4'>
          <div className='inline pr-1'>Don`t have an account?</div>
          <Link to='/register' className='underline'>Sign up for free</Link>
        </div>
      </div>
    </div>
  )
}