import SidebarContent from "./SidebarContent";

export default function FixedSidebar() {
  return (
    <aside className='bg-white w-fit h-[calc(100vh-5rem)] shadow-inner sticky top-20 hidden md:block'>
      <SidebarContent />
    </aside>
  )
}