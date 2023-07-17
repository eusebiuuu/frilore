import logo from '../assets/logo.svg'
import { IoMdNotificationsOutline } from 'react-icons/io'

export default function Navbar() {
  return (
    <nav className='w-screen h-20 bg-main shadow-lg flex flex-1 justify-between align-middle text-center p-2'>
      <div className='flex justify-around place-items-center text-center'>
        <img src={logo} className='h-14 w-14 inline m-4' />
        <div className='inline'>
          <h2 className='font-extrabold'>Frilore</h2>
        </div>
      </div>
      <div className='flex justify-around place-items-center text-center'>
        <div className='relative'>
          <IoMdNotificationsOutline size={45} className='relative align-middle' />
          <div className='absolute rounded-full bg-red-500 w-auto h-auto top-0 left-0 px-1 font-thin'>10</div>
        </div>
        <div>Name</div>
      </div>
    </nav>
  );
}