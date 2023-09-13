import { useEffect, useState } from "react";
import { catchAxiosError } from "../../utils/catchAxiosError";
import customFetch from "../../lib/customFetch";
import Loader from "../../components/Loader";
import { Projects } from "../profile/utils.profile";
import project from '../../assets/project.png'
import Chat from "./Chat";

type ChatData = {
  title: string,
  chatID: string,
}

const initialState = {
  title: '',
  chatID: '',
}

export default function Groups() {
  const [projects, setProjects] = useState<Projects>();
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState<ChatData>(initialState);

  function handleChatDataChange(fieldName: string, value: string) {
    setChatData(oldVal => {
      return {
        ...oldVal,
        [fieldName]: value,
      }
    })
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get('/project');
        setProjects(result.data.projects);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleProjectClick(chatID: string, title: string) {
    handleChatDataChange('chatID', chatID);
    handleChatDataChange('title', title);
  }

  return (
    <div className='w-full'>
      {
        loading
        ? <Loader size='big' />
        : (<>
          {
            chatData.chatID !== ''
            ? <Chat {...chatData} onChatIDChange={() => handleChatDataChange('chatID', '')} />
            : <div className={`m-6 rounded-lg p-6 bg-white max-h-screen overflow-auto flex`}>
              <div className='w-full'>
                <h2>Chats</h2>
                <hr />
                {
                  !projects || projects.length === 0
                  ? <h3>No chats available. Join or create a project first</h3>
                  : <>
                    {
                      projects && projects.map(elem => {
                        return (
                          <div key={elem.project_id} className='flex hover:bg-gray-300 cursor-pointer 
                            p-3 place-items-center' onClick={() => handleProjectClick(elem.chat_id, elem.name)}>
                            <img src={project} className='w-16 h-16 rounded-full border-black border-2 border-solid' />
                            <div className='ml-5'>
                              <div className='font-bold text-lg'>{elem.name}</div>
                              <div className='text-gray-500 text-sm'>{elem.description.slice(0, 100)}</div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </>
                }
              </div>
            </div>
          }
        </>)
      }
    </div>
  )
}