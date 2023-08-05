import { groups, messages } from "./utils.chat";
import project from '../../assets/project.png'
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";

export default function Chat() {
  const [chat, setChat] = useState(-1);
  const [allMessages, setAllMessages] = useState(messages);
  const [msg, setMsg] = useState('');

  function addMessage() {
    setAllMessages(oldMsg => {
      return [...oldMsg, {
        id: oldMsg.length,
        personal: Boolean(new Date().getMilliseconds() % 2),
        msg: msg,
        author: 'John john snow smith'
      }];
    });
    setMsg('');
  }

  return (
    <div className={`w-full m-6 rounded-lg p-6 bg-white max-h-screen overflow-auto 
      flex ${chat === -1 ? '' : 'flex-col-reverse'}`}>
      {
        chat !== -1
        ? <div className='w-full'>
          <button className='rounded-full p-3 sticky top-0 bg-red-400'
            onClick={() => setChat(-1)}>
            <BsArrowLeft size={30} />
          </button>
          {
            allMessages.map(elem => {
              const direction = elem.personal ? 'justify-end' : '';
              const bgColor = elem.personal ? 'bg-blue-400' : 'bg-gray-200';
              return (
                <div key={elem.id} className={`w-full flex ${direction}`}>
                  <div className='w-1/2 my-3'>
                    <div className='text-sm text-gray-400 ml-5'>
                      {elem.author}
                    </div>
                    <div className={`w-full ${bgColor} p-4 rounded-3xl`}>
                      <div className=''>{elem.msg}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div className='flex border-2 border-solid border-gray-500 mt-4'>
            <input className='w-full' placeholder="Write something" value={msg}
              onChange={(e) => setMsg(e.target.value)} />
            <button onClick={addMessage}>
              <AiOutlineSend size={30} />
            </button>
          </div>
        </div>
        : <div className='w-full'>
          <h2>Chats</h2>
          <hr />
          {
            groups.map(elem => {
              return (
                <div key={elem.id} className='flex hover:bg-gray-300 cursor-pointer p-3 place-items-center'
                  onClick={() => setChat(elem.id)}>
                  <img src={project} className='w-16 h-16 rounded-full border-black border-2 border-solid' />
                  <div className='ml-5'>
                    <div className='font-bold text-lg'>{elem.title}</div>
                    <div className='text-gray-500 text-sm'>{elem.lastMessage}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}