import { SidebarLink, sidebarLinks } from "./utils"
import { Link as NavLink } from "react-router-dom"

export default function SidebarContent() {
  return (
    <div className='w-64'>
      {
        sidebarLinks.map((elem: SidebarLink) => {
          return <div key={elem.id} className='w-full transition-all pl-2 hover:bg-gray-200 hover:pl-4'>
            <NavLink to={elem.link}>
              <div className='flex w-full px-4 py-6'>
                <div className='align-baseline scale-150 place-items-center pt-1 mr-5'><elem.icon /></div>
                <div className='align-baseline w-full'>{elem.text}</div>
              </div>
            </NavLink>
          </div>
        })
      }
    </div>
  )
}