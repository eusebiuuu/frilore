import { BiSolidUser } from 'react-icons/bi'

type MembersProps = {
  members: {
    member_id: string,
    username: string
  }[],
}

const SHOW_NUM = 5;

export default function Members(props: MembersProps) {
  const { members } = props;
  const end = Math.min(SHOW_NUM, members.length);
  const diff = Math.max(members.length - SHOW_NUM, 0);
  return (
    <div className='flex'>
      {
        members.slice(0, end).map(elem => {
          return <div key={elem.member_id} className='rounded-full bg-gray-300 -ml-2 border-2 border-white p-1'>
            <BiSolidUser size={25} />
          </div>
        })
      }
      {
        diff === 0 
        ? null 
        : <div className='rounded-full bg-gray-300 -ml-2 border-2 border-white p-1 grid place-items-center w-10'>
          <h5 className='tracking-tighter'>+{diff}</h5>
        </div>
      }
    </div>
  )
}