
type LoaderProps = {
  size: 'big' | 'small'
}

export default function Loader({ size }: LoaderProps) {
  return (
    <div className='w-full flex justify-center'>
      {
        size === 'big'
        ? <div className='big-loader'></div>
        : <div className='small-loader'></div>
      }
    </div>
  )
}