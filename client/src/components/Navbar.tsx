import logo from '../assets/logo.svg'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { BsLayoutSidebar } from 'react-icons/bs'
import { useUserContext } from '../context/user';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationsSocket } from '../socket';
import customFetch from '../lib/customFetch';
import { catchAxiosError } from '../utils/utils';
import { GrClose } from 'react-icons/gr';

type Notification = {
  notification_id: string
  user_id: string
  content: string,
  created_at: Date,
  seen: boolean,
}

export default function Navbar() {
  const { onSidebarToggle, user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get('/notification');
        setNotifications(result.data.notifications);
      } catch (err) {
        catchAxiosError(err);
      }
    })();
    notificationsSocket.on('add-notification', (notification) => {
      setNotifications(oldVal => {
        return [
          notification,
          ...oldVal
        ]
      })
    });
    notificationsSocket.on('read-notifications', () => {
      console.log('Seen');
      setNotifications(oldVal => {
        return oldVal.map(elem => {
          return {
            ...elem,
            seen: true,
          }
        })
      })
    });
    return () => {
      notificationsSocket.off('add-notification');
      notificationsSocket.off('read-notifications');
    }
  }, []);

  function handleNotificationsOpen() {
    setIsOpen(true);
    notificationsSocket.emit('read-notifications', { userID: user?.user_id });
  }

  return (
    <nav className='w-full h-20 bg-main shadow-lg flex justify-between align-middle text-center p-2 sticky top-0 z-10'>
      <div className='flex justify-around place-items-center text-center'>
        <img src={logo} className='h-14 w-14 inline m-4' />
        <div className='hidden md:inline'>
          <h2 className='font-extrabold'>Frilore</h2>
        </div>
      </div>
      <div className='flex justify-around place-items-center text-center'>
        <div className='relative'>
          <button className='relative place-items-center mx-2' onClick={handleNotificationsOpen}>
            <IoMdNotificationsOutline size={35} className='relative align-middle hover:rotate-12 transition-all' />
            { !notifications[0]?.seen && <div className='absolute rounded-full bg-red-500 
              w-2 h-2 top-0 left-0 px-1 font-thin text-xs' /> }
          </button>
          { isOpen && (
            <div className='absolute top-0 left-0 w-52 bg-white shadow-lg'>
              <button onClick={() => setIsOpen(false)}>
                <GrClose size='30' />
              </button>
              {
                notifications.map(elem => {
                  return (
                    <div key={elem.notification_id}>
                      <div>{elem.content}</div>
                    </div>
                  )
                })
              }
            </div>
          )}
        </div>
        <Link to='profile' className='font-bold mx-2'>
          <div className='text-lg text-right'>John Bob Smith</div>
          <div className='text-sm text-gray-400 float-right'>Argentina</div>
        </Link>
        <img src={logo} className='rounded-full w-11 h-11 mx-2' />
        <button className='md:hidden pl-4' onClick={() => onSidebarToggle(true)}>
          <BsLayoutSidebar size={40} />
        </button>
      </div>
    </nav>
  );
}