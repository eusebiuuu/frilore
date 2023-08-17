
type Props = {
  text: string,
}

export default function LoadingButton(props: Props) {
  return (
    <button className='mx-2 px-4 py-2 bg-gray-300 cursor-not-allowed rounded-md font-bold text-gray-500'>
      {props.text}
    </button>
  )
}