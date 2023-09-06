import { MdOutlineWorkOutline } from 'react-icons/md'
import { AiOutlineCalendar, AiOutlineFundProjectionScreen, AiOutlineMail } from 'react-icons/ai'
import Field from './Field'
import { Link, useNavigate, useParams } from 'react-router-dom'
import project from '../../assets/project.png'
import { useEffect, useState } from 'react'
import customFetch from '../../lib/customFetch'
import Loader from '../../components/Loader'
import { Projects, User, getAge } from './utils.profile'
import { catchAxiosError } from '../../utils/utils'
import { getNonEmptyContent } from '../../utils/emptyValue'

type Teammates = {
  username: string,
  image_url: string,
  user_id: string,
}[];

export default function ForeignProfile() {
  const { id: curUserID } = useParams();
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Projects>([]);
  const [teammates, setTeammates] = useState<Teammates>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      try {
        let result = await customFetch.get(`/user/${curUserID}`);
        setUserData((oldData) => {
          return {
            ...oldData,
            ...result.data.user
          }
        });
        result = await customFetch.get('/project/members/all');
        setProjects(result.data.projects);
        result = await customFetch.get(`/user/teammates/${curUserID}`);
        setTeammates(result.data.teammates);
      } catch (err) {
        catchAxiosError(err);
        navigate('/not-found');
      }
      setLoading(false);
    })();
  }, [curUserID]);

  return (
    <div className='w-full p-6'>
      {
        loading || !userData
        ? <Loader size='big' />
        : <><div className='w-full grid grid-cols-1 lg:grid-cols-profile
          gap-4 place-items-center lg:place-items-stretch'>
          <div className='w-72 text-center rounded-lg shadow-lg bg-white grid place-content-center p-4'>
            <img src={userData.image_url} alt='profile' className='h-40 w-40 m-auto border-2 border-transparent
              outline-2 outline outline-red-500 rounded-full my-6' />
            <div className='font-bold'>{userData.username}</div>
            <p>{userData.country}</p>
            <hr />
            <Field icon={MdOutlineWorkOutline} text={getNonEmptyContent(userData.role, 'No role')} />
            <Field icon={AiOutlineCalendar} text={getAge(userData.birthday)} />
            <Field icon={AiOutlineMail} text={getNonEmptyContent(userData.email, 'No email')} />
            <Field icon={AiOutlineFundProjectionScreen} text={`Worked in ${projects.length} projects`} />
          </div>
          <div className='rounded-md bg-white shadow-md p-4'>
            <div className='relative mb-20'>
              <h3 className='mb-6'>{getNonEmptyContent(userData.role, 'No role')}</h3>
              <div className='absolute top-8 left-0 bg-gray-200 p-2 rounded-md'>
                {getNonEmptyContent(userData.description, 'No description provided')}
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
                  teammates.map(elem => {
                    return (
                      <div key={elem.user_id}>
                        <Link to={`/profile/${elem.user_id}`}>
                          <img src={elem.image_url} alt='profile' className='w-32 h-32 rounded-full m-auto' />
                          <div className='font-bold w-full text-center'>{elem.username}</div>
                        </Link>
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
                <div
                  key={elem.project_id} 
                  className='flex place-items-center bg-gray-100 transition-all rounded-md p-2'
                >
                  <img src={project} className='w-24 h-24' />
                  <div className='ml-2'>
                    <h3>{elem.name}</h3>
                    <p>{elem.description}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </>}
    </div>
  )
}