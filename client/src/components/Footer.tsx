import { FormEvent, useState } from 'react';
import logo from '../assets/logo.svg'
import { footerLinks, footerIcons } from './utils';
import { Link } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai'

export default function Footer() {
  const curDate = new Date();

  const [email, setEmail] = useState('');

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(email);
    setEmail('');
  }

  return (
    <div className='bg-gray-950 grid w-full md:grid-cols-3 gap-4 text-white px-6 py-10'>
      <div>
        <div className='flex'>
          <img src={logo} className='w-12 h-12' />
        </div>
        <div>
          Copyright &#169; {curDate.getFullYear()}. All rights reserved.
        </div>
        <div className='flex mt-3'>
          {
            footerIcons.map((elem) => {
              return <a key={elem.id} href={elem.link} className='scale-125 rounded-full bg-gray-600 mx-3 p-2'>
                <elem.icon />
              </a>
            })
          }
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <ul>
          <h3 className='mb-4'>Contact</h3>
          {
            footerLinks.map((elem) => {
              return <li key={elem.id} className='my-3'>
                <Link to={elem.link}>{elem.name}</Link>
              </li>
            })
          }
        </ul>
        <ul>
          <h3 className='mb-4'>Support</h3>
          {
            footerLinks.map((elem) => {
              return <li key={elem.id + 10} className='my-3'>
                <Link to={elem.link}>{elem.name}</Link>
              </li>
            })
          }
        </ul>
      </div>
      <div>
        <h3 className='mb-6'>Stay up to date</h3>
        <form onSubmit={handleFormSubmit}>
          <div className='flex bg-gray-600 px-2 rounded-md'>
            <input type='email' value={email} className='bg-gray-600 w-full'
              placeholder='Write your email' onChange={e => setEmail(e.target.value)} />
            <button type='submit' className='-rotate-45'>
              <AiOutlineSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}