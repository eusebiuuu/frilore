import { IconType } from "react-icons"

type Props = {
  icon: IconType,
  text: string,
}

export default function Field(props: Props) {
  return (
    <div className='flex place-items-center'>
      <props.icon size={20} />
      <div className='my-2 mx-3'>{props.text}</div>
    </div>
  )
}