import logo from '../../assets/logo.svg'
import { MdOutlineWorkOutline } from 'react-icons/md'
import { AiOutlineCalendar, AiOutlineFundProjectionScreen, AiOutlineMail } from 'react-icons/ai'
import Field from './Field'
import userProfile from '../../assets/user-profile.svg'
import { Link, useParams } from 'react-router-dom'
import project from '../../assets/project.png'
import { useEffect, useState } from 'react'
import customFetch from '../../lib/customFetch'
import Loader from '../../components/Loader'
import { Projects, getAge } from './utils.profile'
import { catchAxiosError } from '../../utils/utils'

const REQUESTS = 3;

type Teammates = {
  username: string,
}[];

const initialState = {
  real_name: '',
  username: '',
  email: '',
  role: '',
  birthday: null,
  country: '',
  description: 'Lorem ipsum dol de9wfohiu weuif ehioqwegf 32y723 3y owehe0wd83 deuod 3280d'
}

export default function ForeignProfile() {
  const { id: curUserID } = useParams();
  const [userData, setUserData] = useState(initialState);
  const [loadingCount, setLoadingCount] = useState(0);
  const [projects, setProjects] = useState<Projects>([]);
  const [teammates, setTeammates] = useState<Teammates>([]);
  
  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get(`/user/${curUserID}`);
        setUserData((oldData) => {
          return {
            ...oldData,
            ...result.data.user
          }
        });
      } catch (err) {
        catchAxiosError(err);
      }
      setLoadingCount(oldVal => oldVal + 1);
    })();
    (async () => {
      try {
        const result = await customFetch.get('/project/all');
        setProjects(result.data.projects);
      } catch (err) {
        catchAxiosError(err);
      }
      setLoadingCount(oldVal => oldVal + 1);
    })();
    (async () => {
      try {
        const result = await customFetch.get(`/user/teammates/${curUserID}`);
        // console.log(result.data.teammates);
        setTeammates(result.data.teammates);
      } catch (err) {
        catchAxiosError(err);
      }
      setLoadingCount(oldVal => oldVal + 1);
    })();
  }, []);

  return (
    <div className='w-full p-6'>
      {
        loadingCount < REQUESTS
        ? <Loader size='big' />
        : <><div className='w-full grid grid-cols-1 lg:grid-cols-profile
          gap-4 place-items-center lg:place-items-stretch'>
          <div className='w-72 text-center rounded-lg shadow-lg bg-white grid place-content-center p-4'>
            <img src={logo} alt='profile' className='h-40 w-40 m-auto border-2 border-transparent
              outline-2 outline outline-red-500 rounded-full my-2' />
            <div className='font-bold'>{userData.real_name}</div>
            <p>{userData.country}</p>
            <hr />
            <Field icon={MdOutlineWorkOutline} text={userData.role} />
            <Field icon={AiOutlineCalendar} text={getAge(userData.birthday)} />
            <Field icon={AiOutlineMail} text={userData.email} />
            <Field icon={AiOutlineFundProjectionScreen} text={`Worked in ${projects.length} projects`} />
          </div>
          <div className='rounded-md bg-white shadow-md p-4'>
            <div className='relative mb-20'>
              <h3 className='mb-6'>{userData.role}</h3>
              <div className='absolute top-8 left-0 bg-gray-200 p-2 rounded-md'>
                {userData.description}
              </div>
              <div className='absolute border-transparent border-b-8 border-l-8 border-r-8 border-b-gray-200
                w-0 h-0 top-6 left-6'></div>
            </div>
            <div className='w-full'>
              <div className='font-bold my-4'>
                Teammates
              </div>
              <div className='w-full grid grid-cols-3 grid-rows-3 gap-3'>
                {
                  teammates.slice(0, 9).map(elem => {
                    return (
                      <div key={elem.username} className=''>
                        <img src={userProfile} alt='profile' className='w-32 h-32 rounded-full m-auto' />
                        <div className='font-bold w-full text-center'>{elem.username}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className='w-full rounded-lg p-4 grid grid-cols-2 gap-5 bg-white shadow-md mt-6'>
          {
            projects.map(elem => {
              return (
                <Link to={`/projects/${elem.project_id}`} key={elem.project_id} 
                  className='flex place-items-center hover:bg-gray-200 transition-all rounded-md'>
                  <img src={project} className='w-24 h-24' />
                  <div className='ml-2'>
                    <h3>{elem.name}</h3>
                    <p>{elem.description.slice(0, 100)}&hellip;</p>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </>}
    </div>
  )
}