import { ChangeEvent } from "react"

type InputProps = {
  name: string,
  value: string,
  inputName: string,
  type?: string,
  disabled?: boolean,
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Input(props: InputProps) {
  return (
    <div className='border-2 border-gray-300 rounded-xl px-4 py-2'>
      <label htmlFor={props.name} className='m-0 text-sm'>{props.name}</label>
      <input type={props.type || 'text'} value={props.value} id={props.name} disabled={props.disabled}
        name={props.inputName} onChange={props.onInputChange} placeholder={props.name}
        className={`w-full p-0 pt-1 text-gray-500 ${props.disabled ? 'cursor-not-allowed' : ''}`} />
    </div>
  )
}