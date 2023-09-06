import { MdOutlineWorkOutline } from 'react-icons/md'
import { AiOutlineCalendar, AiOutlineFundProjectionScreen, AiOutlineMail } from 'react-icons/ai'
import Field from './Field'
import Input from './Input'
import { ChangeEvent, useEffect, useState } from 'react'
import CountrySelector from './CountriesSelector'
import { COUNTRIES, Projects, SelectMenuOption, User, getAge } from './utils.profile'
import project from '../../assets/project.png'
import { Navigate } from 'react-router-dom'
import customFetch from '../../lib/customFetch'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { catchAxiosError } from '../../utils/utils'
import Modal from '../../components/Modal'
import LoadingButton from '../../components/LoadingButton'
import { useUserContext } from '../../context/user'
import { useModalContext } from '../../context/modals'

export default function PersonalProfile() {
  const { user, onUserChange } = useUserContext();
  const { onModalToggle, onGeneralModalChange, modalInfo } = useModalContext();
  if (!user) {
    return <Navigate to='/' replace />
  }
  const [userData, setUserData] = useState<User>(user);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Projects>([]);
  const [curUserData, setCurUserData] = useState<User>(user);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [file, setFile] = useState<null | File>(null);

  function handleFormDataChange(e: ChangeEvent<HTMLInputElement>) {
    setUserData(oldVal => {
      if (!oldVal) return oldVal;
      return {
        ...oldVal,
        [e.target.name]: e.target.value,
      }
    });
  }

  async function handleFileUpload() {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        await customFetch.post('/user/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (err) {
        catchAxiosError(err);
      }
    }
  }

  useEffect(() => {
    (async () => {
      try {
        let result = await customFetch.get('/auth');
        const newUser = {
          ...user,
          ...result.data.user,
        }
        setUserData(newUser);
        setCurUserData(newUser);
        result = await customFetch.get('/project');
        setProjects(result.data.projects);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleProfileEdit() {
    setSaveLoading(true);
    try {
      await handleFileUpload();
      await customFetch.patch(`/user`, userData);
      setFile(null);
      setCurUserData(userData);
      onUserChange(userData);
      toast.success('Profile updated successfully');
    } catch (err) {
      catchAxiosError(err);
    } finally {
      setSaveLoading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function handleProfileDelete() {
    setDeleteLoading(true);
    setDeleteLoading(false);
  }

  async function handleModalOpen() {
    onGeneralModalChange(true, {
      question: 'Are you sure? This cannot be undone!',
      rightAction: handleProfileDelete,
      rightContent: 'Delete',
      onModalClose: () => onModalToggle('general', false),
    })
  }
  
  return (
    <div className='py-6 px-4'>
      {modalInfo.general.open && <Modal {...modalInfo.general.content} /> }
        {
        loading
        ? <Loader size='big' />
        : <>
          <div className='grid grid-cols-1 lg:grid-cols-profile gap-4 place-items-center lg:place-items-stretch'>
            <div className='w-72 text-center rounded-lg shadow-lg bg-white grid place-content-center p-4'>
              <img src={userData.image_url} alt='profile' className='h-40 w-40 m-auto border-2 border-transparent
                outline-2 outline outline-red-500 rounded-full my-2' />
              <div className='font-bold'>
                {`${userData.real_name === '' ? 'No real name provided' : userData.real_name}`}
              </div>
              <p>{userData.country}</p>
              <hr />
              <Field icon={MdOutlineWorkOutline} text={userData.role === '' ? 'No role specified' : userData.role} />
              <Field icon={AiOutlineCalendar} text={getAge(userData.birthday)} />
              <Field icon={AiOutlineMail} text={userData.email ?? 'No email specified'} />
              <Field icon={AiOutlineFundProjectionScreen} text={`Worked in ${projects.length} projects`} />
            </div>
            <div className=' w-fit rounded-lg shadow-lg bg-white  p-4'>
              <h2 className='mb-2'>Edit profile</h2>
              <div className='grid grid-cols-2 gap-3 place-content-center'>
                <Input inputName='username' name='Username' value={userData.username}
                  onInputChange={handleFormDataChange} />
                <Input inputName='real_name' name='Real name' value={userData.real_name}
                  onInputChange={handleFormDataChange} />
                <Input inputName='email' name='Email' value={userData.email || ''}
                  onInputChange={handleFormDataChange} disabled={userData.google_id !== null} />
                <Input inputName='role' name='Role' value={userData.role}
                  onInputChange={handleFormDataChange} />
                <CountrySelector id='country' open={isOpen} 
                  onToggle={() => setIsOpen(val => !val)}
                  onChange={newVal => {
                    setUserData((oldVal) => {
                      return { ...oldVal, 'country': newVal }
                    })
                  }}
                  selectedValue={COUNTRIES.find(option => option.title === userData.country) as SelectMenuOption}
                />
              </div>
              <label className="block mt-3 mb-1 font-medium text-gray-900 dark:text-white" htmlFor="file_input">
                Upload a new profile image
              </label>
              <input className="block w-full text-sm text-gray-900 border
                border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 
                focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"     
                aria-describedby="file_input_help" id="file_input" type="file" accept='.svg, .png, .jpg, .jpeg'
                onChange={handleFileChange}
              />
              <div className='text-center mt-6'>
                {
                  saveLoading
                  ? <LoadingButton text={'Saving...'} />
                  : (
                    <button className={`m-auto w-fit rounded-lg text-white bg-blue-400 px-4 py-2 
                      disabled:cursor-not-allowed disabled:bg-gray-400`} 
                      disabled={JSON.stringify(curUserData) === JSON.stringify(userData) && file === null}
                      onClick={() => handleProfileEdit()}
                    >
                      Save
                    </button>
                  )
                }
              </div>
            </div>
          </div>
          <div className='bg-white shadow-md mt-6 w-full rounded-lg p-4'>
            <h2>Projects</h2>
            <div className=' grid grid-cols-2 gap-5 my-4'>
              {
                projects.map(elem => {
                  return (
                    <div key={elem.project_id} 
                      className='flex place-items-center bg-gray-100 transition-all rounded-md p-4'>
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
          </div>
          <div className='w-full my-8'>
            {
              deleteLoading
              ? <LoadingButton text={'Deleting...'} />
              : (
                <button className='float-right bg-red-500 font-bold p-4 rounded-xl'onClick={handleModalOpen}>
                  Delete account
                </button>
              )
            }
          </div>
        </>
      }
    </div>
  )
}