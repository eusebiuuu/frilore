import logo from '../assets/logo.svg'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { useUserContext } from '../context/user';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationsSocket } from '../socket';
import customFetch from '../lib/customFetch';
import { catchAxiosError } from '../utils/utils';
import { GrClose } from 'react-icons/gr';
import { getFullDate } from '../features/tasks/utils.tasks';

type Notification = {
  notification_id: string
  user_id: string
  content: string,
  created_at: Date,
  seen: boolean,
}

const INITIAL_COUNT = 8;

export default function Navbar() {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState<number | string>(INITIAL_COUNT);

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get(`/notification?limit=${limit}`);
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
  }, [limit]);

  function handleNotificationsOpen() {
    setIsOpen(true);
  }

  function handleNotificationsClose() {
    setIsOpen(false);
    notificationsSocket.emit('read-notifications', { userID: user?.user_id });
  }

  function handleSetLimitChange() {
    setLimit('all');
  }

  return (
    <nav className='w-full h-20 bg-main shadow-lg flex justify-between align-middle text-center p-2 sticky top-0 z-10'>
      <div className='flex justify-around place-items-center text-center'>
        <img src={logo} className='h-14 w-14 inline m-4' />
        <div className='hidden md:inline'>
          <h2 className='font-extrabold'>Frilore</h2>
        </div>
      </div>
      <div className='flex justify-around place-items-center'>
        {
          user
          ? (<>
            <div className='relative'>
              <button className='relative place-items-center mx-2' onClick={handleNotificationsOpen}>
                <IoMdNotificationsOutline size={35} className='relative align-middle hover:rotate-12 transition-all' />
                { notifications.length > 0 && !notifications[0]?.seen && (
                  <div className='absolute rounded-full bg-red-500 
                  w-2 h-2 top-0 left-0 px-1 font-thin text-xs' /> )}
              </button>
              { isOpen && (<>
                <div className='absolute border-transparent border-b-8 border-l-8 border-r-8 border-b-black
                  w-0 h-0 top-12 left-4'></div>
                <div className='bg-white absolute top-14 -left-52 w-96 border-2 border-black shadow-lg border-solid'>
                  <div className='w-full p-3 flex align-middle place-content-end shadow-md'>
                    <button onClick={handleNotificationsClose}>
                      <GrClose size='30' />
                    </button>
                  </div>
                  <div className='max-h-[400px] overflow-auto'>
                    {
                      notifications.map(elem => {
                        return (
                          <div key={elem.notification_id} className={`w-full border-t-2 border-gray-300 
                            border-solid px-4 py-2 hover:bg-gray-200 block place-content-start 
                            ${!elem.seen ? '[&>*]:font-bold' : ''}`}>
                            <div className='w-full flex place-content-start pb-2'>{elem.content}</div>
                            <div className='w-full flex place-content-end text-gray-400 text-sm'>
                              {getFullDate(elem.created_at)}
                            </div>
                          </div>
                        )
                      })
                    }
                    { limit !== 'all' && (
                      <div className='flex place-content-center py-4 px-2 border-t-2 border-gray-300 border-solid'>
                        <button className='underline text-blue-500' onClick={handleSetLimitChange}>Show more</button>
                      </div>
                    )}
                  </div>
                </div>
              </>)}
            </div>
            <Link to='profile' className='font-bold mx-2'>
              <div className='text-lg text-right'>
                {user.real_name === '' ? 'No real name provided' : user.real_name}
              </div>
              <div className='text-sm text-gray-400 float-right'>
                {user.country}
              </div>
            </Link>
            <img src={user.image_url} className='rounded-full w-11 h-11 mx-2' />
          </>)
          : <div className='flex [&>a]:mx-3 [&>a]:text-xl'>
            <Link to='/'>Home</Link>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
          </div>
        }
      </div>
    </nav>
  );
}