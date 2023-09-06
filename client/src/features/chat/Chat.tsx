import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";
import { useUserContext } from "../../context/user";
import { socket } from "../../socket";
import ScrollableComponent from "../../components/ScrollableComponent";

type Message = {
  message_id: string,
  author: string,
  chat: string,
  content: string,
  created_at: Date,
  username: string,
  role: string,
}

export type ChatData = {
  chatID: string,
  onChatIDChange: () => void,
  title: string,
}

export default function Chat({ chatID, onChatIDChange, title }: ChatData) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState('');
  const { user } = useUserContext();
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get(`/message/${chatID}?page=${page}`);
        setMessages(result.data.messages);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(oldVal => {
        return [
          message,
          ...oldVal,
        ]
      })
    });
    socket.emit('join', { chatID });
    return () => {
      socket.off('message');
    };
  }, []);


  function addMessage() {
    socket.emit('message', { messageContent, chatID });
    setMessageContent('');
  }

  function handleChatLeave() {
    socket.emit('leave', { chatID });
    onChatIDChange();
  }

  function submitOnEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter' || e.code === "NumpadEnter") {
      e.preventDefault();
      addMessage();
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className={`m-6 rounded-lg bg-white h-screen`}>
      {
        loading
        ? <Loader size='big' />
        : <>
          <div className="w-full bg-white shadow-md p-4 border-t-gray-500 sticky z-10 top-0">
            <h2 className='font-bold'>{title}</h2>
            <p className='m-0'>{messages.length} message shown</p>
          </div>
          {
            messages.length === 0
            ? <div className='w-full flex place-items-center'>
              <h2>There are no messages to be displayed</h2>
            </div>
            : <>
              <ScrollableComponent
                action={() => setPage(old => old + 1)}
                destination="top"
                className={`overflow-auto h-[calc(100vh-10.575em)] flex relative p-4`}
              >
                {
                  messages.map(elem => {
                    const direction = user && user.user_id === elem.author ? 'justify-end' : '';
                    const bgColor = user && user.user_id === elem.author ? 'bg-blue-300' : 'bg-gray-200';
                    return (
                      <div key={elem.message_id} className={`w-full flex ${direction} my-3`}>
                        <div className='w-1/2'>
                          <div className='text-sm text-gray-400 ml-5'>
                            {`${elem.username} -- ${elem.role}`}
                          </div>
                          <div className={`w-full ${bgColor} p-4 rounded-3xl`}>
                            <div className=''>{elem.content}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </ScrollableComponent>
              <div className='flex border-t-2 border-solid border-t-gray-500 sticky p-2 bottom-0 w-full bg-white'>
                <button className='rounded-full w-fit p-3 bg-red-400' onClick={handleChatLeave}>
                  <BsArrowLeft size={30} />
                </button>
                <input
                  className='w-full border-none text-lg'
                  onKeyDown={submitOnEnter} 
                  placeholder="Write something"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <button onClick={addMessage}>
                  <AiOutlineSend size={30} />
                </button>
              </div>
            </>
          }
        </>
      }
    </div>
  )
}