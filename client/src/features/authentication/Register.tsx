import { AiFillGithub, AiOutlineGoogle } from "react-icons/ai";
import { Link } from "react-router-dom";

/*
- Add a more detailed form after email validation
*/

export default function Register() {
  const tailwindClasses = 'w-96 block px-4 py-3 my-4 bg-white rounded-2xl m-auto font-semibold text-lg hover:shadow-md';
  return (
    <div className='text-center grid place-content-center m-auto py-16'>
        <h2 className='my-3'>Welcome to our platform!</h2>
        <p>To access our services, please sign up with your favourite platform.</p>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full'>
            <div className='pr-1'>Sign up with</div>
            <div><AiOutlineGoogle size={25} /></div>
          </div>
        </button>
        <button className={`${tailwindClasses}`}>
          <div className=' place-content-center flex w-full'>
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