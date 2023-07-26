import { useState } from 'react';
import { details, messages, numbers } from './utils'
import image3 from '../../assets/home3.svg'
import image1 from '../../assets/home1.svg'

export default function Home() {
  const [idx, setIdx] = useState(0);
  return (
    <div>
      <div className='bg-gray-100'>
        <div className='grid grid-cols-1 gap-4 
          grid-rows-2 md:grid-cols-2 md:grid-rows-1 px-8 py-10'>
          <div className='place-items-center text-center'>
            <div className='mb-4'>
              <h2>{messages[idx].title}</h2>
            </div>
            <div className='text-sm'>
              {messages[idx].subtitle}
            </div>
            <button className='bg-primary rounded mt-6 px-4 py-2 hover:shadow-md'>Register for free</button>
          </div>
          <div className='flex place-content-center'>
            <img src={messages[idx].image} className='h-72 mr-0 object-contain' />
          </div>
        </div>
        <div className='w-full text-center py-3'>
          {
            messages.map((elem, curIdx) => {
              return <button key={elem.id} onClick={() => setIdx(curIdx)}
                className={`rounded-full ${idx === curIdx ? 'bg-gray-500' : 'bg-gray-300'} w-4 h-4 mx-2`}></button>
            })
          }
        </div>
      </div>
      <div className='bg-white py-6'>
        <div className='w-full text-center'>
          <h2 className='m-auto w-96'>Manage entire projects in a single system</h2>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-6 py-4 mx-3'>
            {
              details.map(elem => {
                return <div key={elem.id} className='text-center 
                  lg:w-80 md:w-60 shadow-md border-gray-300 p-6 rounded-md'>
                  <div className='bg-red-200 p-3 my-3 w-fit m-auto'>
                    <elem.icon size={40} />
                  </div>
                  <div>
                    <h3 className='mb-2'>{elem.title}</h3>
                    <p>{elem.description}</p>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
      <div className='grid md:grid-cols-2 grid-cols-1 p-8 place-items-center gap-5'>
        <img src={image3} className='h-64' alt='Project' />
        <div>
          <h2 className='w-80'>About Us</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.</p>
          <button className='bg-primary rounded mt-6 px-4 py-2 hover:shadow-md'>Contact Us</button>
        </div>
      </div>
      <div className='bg-white grid md:grid-cols-2 grid-cols-1 p-8 place-items-center gap-5'>
        <div>
          <h2>Some numbers to convince you we are the right choice</h2>
          <p>We reached here with our hard work and dedication.</p>
        </div>
        <div className='grid grid-cols-2 grid-rows-2'>
          {
            numbers.map(elem => {
              return <div key={elem.id} className='flex'>
                <div className='m-3'>
                  <elem.icon size={40} />
                </div>
                <div className='p-4'>
                  <h4>{elem.num}</h4>
                  <p>{elem.name}</p>
                </div>
              </div>
            })
          }
        </div>
      </div>
      <div className='bg-gray-200 grid md:grid-cols-2 grid-cols-1 p-8 place-items-center gap-5'>
        <img src={image1} className='h-64' alt='Project' />
        <div>
          <h2 className='w-80'>What have we built exactly?</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.</p>
          <button className='bg-primary rounded mt-6 px-4 py-2 hover:shadow-md'>Try it for free</button>
        </div>
      </div>
    </div>
  )
}