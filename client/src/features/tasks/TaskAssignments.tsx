import { useEffect, useState } from "react";
import { TaskMember } from "./utils.tasks";

/*
- add checkbox label
*/

type Props = {
  members: TaskMember[],
  title: string,
  type: 'assignee' | 'reporter',
  onTaskMembersChange: (idx: number, type: 'assignee' | 'reporter' | 'none') => void
}

export default function TaskAssignments(props: Props) {
  const [membersStatus, setMembersStatus] = useState<number[]>(Array.from(props.members, 
    member => getProperNum(member.type)
  ));
  
  useEffect(() => {
    setMembersStatus(Array.from(props.members, 
      member => getProperNum(member.type)
    ));
  }, [props.members]);

  function getProperNum(type: 'assignee' | 'reporter' | 'none') {
    if (type === props.type) {
      return 1;
    } else if (type === 'none') {
      return 0;
    }
    return -1;
  }

  function handleMembersChange(idx: number, typeNum: number) {
    if (typeNum !== 0 && typeNum !== 1) return;
    props.onTaskMembersChange(idx, typeNum === 0 ? props.type : 'none');
  }

  return (
    <div className="mt-3">
      <h3>{props.title}</h3>
      <div className='grid grid-cols-1 border-gray-200 border rounded-lg mt-3 p-5 h-40 overflow-auto'>
        {
          props.members.map((elem, idx) => {
            return (
              <div key={elem.user_id} className='mb-4 border-b-2 border-b-gray-200 flex'>
                <div>{elem.username}</div>
                <div className='text-gray-400 mx-4'>{elem.role}</div>
                <input type='checkbox' checked={membersStatus[idx] === 1} disabled={membersStatus[idx] === -1}
                  onChange={() => handleMembersChange(idx, membersStatus[idx])}
                  className='scale-125 disabled:cursor-not-allowed' />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}