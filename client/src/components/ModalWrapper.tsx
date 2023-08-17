import { ReactNode } from "react";

export default function ModalWrapper(props: { children: ReactNode}) {
  return (
    <div>
      <div className='fixed z-40 top-0 left-0 w-full h-full bg-black opacity-70'></div>
      <div className='fixed top-0 z-50 left-0 w-full h-full grid place-items-center'>
        {props.children}
      </div>
    </div>
  )
}