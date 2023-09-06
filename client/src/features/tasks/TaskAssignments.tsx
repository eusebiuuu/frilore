import { useEffect, useState } from "react";
import { TaskMember } from "./utils.tasks";

type AssignmentTypes = 'assignee' | 'reporter' | 'none';

type Props = {
  members: TaskMember[],
  title: string,
  type: 'assignee' | 'reporter',
  onTaskMembersChange: (idx: number, type: AssignmentTypes) => void
}

export default function TaskAssignments(props: Props) {
  const [membersStatus, setMembersStatus] = useState<AssignmentTypes[]>(
    Array.from(props.members, member => member.type)
  );
  
  useEffect(() => {
    setMembersStatus(Array.from(props.members, member => member.type));
  }, [props.members]);

  function handleMembersChange(idx: number, currType: 'assignee' | 'reporter' | 'none') {
    if (currType === props.type) {
      props.onTaskMembersChange(idx, 'none');
    } else {
      props.onTaskMembersChange(idx, props.type);
    }
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
                <input type='checkbox' checked={membersStatus[idx] === props.type}
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