import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useUserContext } from "../context/user";
import SidebarContent from "./SidebarContent";

export default function FixedSidebar() {
  const { isSidebarOpen, onSidebarToggle } = useUserContext();
  return (<>
      <aside className={`bg-white w-fit h-[calc(100vh-5rem)] shadow-inner sticky top-20 hidden
        ${isSidebarOpen && 'md:block'} relative`}>
        <SidebarContent />
      </aside>
      <button className={`fixed bottom-10 left-10 rounded-full z-30 hover:bg-blue-400 bg-gray-100 shadow-lg p-4`} 
        onClick={() => onSidebarToggle(!isSidebarOpen)}>
        {isSidebarOpen
          ? <AiOutlineArrowLeft size='30' />
          : <AiOutlineArrowRight size='30' />
        }
      </button>
    </>
  )
}