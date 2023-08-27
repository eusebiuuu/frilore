import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";
import { useUserContext } from "../../context/user";
import { socket } from "../../socket";

type Message = {
  message_id: string,
  author: string,
  chat: string,
  content: string,
  created_at: Date,
}

export default function Chat({ chatID, onChatIDChange }: {
  chatID: string,
  onChatIDChange: () => void,
}) {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState('');
  const { user } = useUserContext();

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get(`/message/${chatID}`);
        setMessages(result.data.messages);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    socket.on('message', message => {
      console.log('Message received');
      setMessages(oldVal => {
        return [
          ...oldVal,
          message,
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

  return (
    <div className='w-full'>
      {
        loading
        ? <Loader size='big' />
        : <>
          <button className='rounded-full p-3 sticky top-0 bg-red-400' onClick={handleChatLeave}>
            <BsArrowLeft size={30} />
          </button>
          {
            messages.map(elem => {
              const direction = user && user.user_id === elem.author ? 'justify-end' : '';
              const bgColor = user && user.user_id === elem.author ? 'bg-blue-400' : 'bg-gray-200';
              return (
                <div key={elem.message_id} className={`w-full flex ${direction}`}>
                  <div className='w-1/2 my-3'>
                    <div className='text-sm text-gray-400 ml-5'>
                      {elem.author}
                    </div>
                    <div className={`w-full ${bgColor} p-4 rounded-3xl`}>
                      <div className=''>{elem.content}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div className='flex border-2 border-solid border-gray-500 mt-4'>
            <input className='w-full' placeholder="Write something" value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)} />
            <button onClick={addMessage}>
              <AiOutlineSend size={30} />
            </button>
          </div>
        </>
      }
    </div>
  )
}