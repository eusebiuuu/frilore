import { Link } from "react-router-dom";

export default function NotFound() {
  return (<div className='grid place-items-center w-full h-[calc(100vh-10em)] text-center'>
    <div>
      <h1>Page not found</h1>
      <h1>404</h1>
      <Link to='/' className='flex justify-around border-2 border-solid border-black px-6 py-4 m-4 uppercase'>
        <h2>Go home</h2>
      </Link>
    </div>
  </div>)
}