import SidebarContent from "./SidebarContent";
import logo from '../assets/logo.svg'
import { GrClose } from 'react-icons/gr'
import { useUserContext } from "../context/user";

export default function MobileSidebar() {
  const { isSidebarOpen, onSidebarToggle } = useUserContext();
  return (
    <div className={`md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
      <div className={`w-screen h-screen fixed top-0 left-0 transition-all duration-300 
        z-40 bg-black opacity-50`} />
      <div className={`fixed top-0 left-0 w-64 h-screen transition-all duration-300 z-40 bg-white
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex justify-between px-5 py-4 border-b-2'>
          <img src={logo} alt='Company logo' className='w-12 h-12' />
          <button onClick={() => onSidebarToggle(false)}>
            <GrClose size={40} />
          </button>
        </div>
        <SidebarContent />
      </div>
    </div>
  )
}