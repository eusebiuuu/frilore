import { nanoid } from "nanoid"
import { GrClose } from "react-icons/gr"
import { Link } from "react-router-dom"

export type Line = {
  name: string,
  action: string | (() => void),
  type?: 'link' | 'button',
}

type Props = {
  lines: () => Line[],
  className?: string,
  onDropdownClose: () => void
}

export default function ButtonsDropdown(props: Props) {

  async function handleButtonClick(elem: Line) {
    if (typeof elem.action === 'string') {
      return;
    }
    props.onDropdownClose();
    elem.action();
  }
  return (
    <div className={`bg-white shadow-lg border-black border-solid border-2
      ${props.className} pt-2 absolute -left-36 z-20 w-40`}>
      <button onClick={props.onDropdownClose} className='pl-2'>
        <GrClose size="25" />
      </button>
      <hr className='bg-black' />
      {
        props.lines().map(elem => {
          return (<div key={nanoid()}>
            {
              elem.type === 'link'
              ? (
                <Link to={typeof elem.action === 'string' ? elem.action : '/'} className='py-2 w-full'>
                  <div className='hover:bg-gray-200 w-full py-2 text-left pl-2'>
                    {elem.name}
                  </div>
                </Link>
              ) : (
                <button onClick={async () => handleButtonClick(elem)}
                  className='py-2 hover:bg-gray-200 w-full text-left pl-2'>
                  {elem.name}
                </button>
              )
            }
          </div>)
        })
      }
    </div>
  )
}