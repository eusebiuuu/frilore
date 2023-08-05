import logo from '../assets/logo.svg'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { BsLayoutSidebar } from 'react-icons/bs'
import { useUserContext } from '../context/user';
import { Link } from 'react-router-dom';


/*
- Login & Register when user us undefined
- Notifications: modal, FB model, types of notifications, last 10 notifications
*/
export default function Navbar() {
  const { onSidebarToggle } = useUserContext();
  return (
    <nav className='w-full h-20 bg-main shadow-lg flex justify-between align-middle text-center p-2 sticky top-0 z-10'>
      <div className='flex justify-around place-items-center text-center'>
        <img src={logo} className='h-14 w-14 inline m-4' />
        <div className='hidden md:inline'>
          <h2 className='font-extrabold'>Frilore</h2>
        </div>
      </div>
      <div className='flex justify-around place-items-center text-center'>
        <button className='relative place-items-center mx-2'>
          <IoMdNotificationsOutline size={35} className='relative align-middle hover:rotate-12 transition-all' />
          <div className='absolute rounded-full bg-red-500 w-auto h-auto top-0 left-0 px-1 font-thin text-xs'>10</div>
        </button>
        <Link to='profile' className='font-bold mx-2'>
          <div className='text-lg text-right'>John Bob Smith</div>
          <div className='text-sm text-gray-400 float-right'>Argentina</div>
        </Link>
        <img src={logo} className='rounded-full w-11 h-11 mx-2' />
        <button className='md:hidden pl-4' onClick={() => onSidebarToggle(true)}>
          <BsLayoutSidebar size={40} />
        </button>
      </div>
    </nav>
  );
}