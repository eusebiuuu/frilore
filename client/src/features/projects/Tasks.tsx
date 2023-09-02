import { Draggable } from "react-beautiful-dnd";
import { CompleteProject, List } from "./utils.project";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import Members from "../../components/Members";
import ButtonsDropdown from "../../components/ButtonsDropdown";
import { getTaskDropdown } from "./dropdownActions";
import { useState } from "react";

type Props = {
  list: List,
  project: CompleteProject,
}

export default function Tasks(props: Props) {
  const [taskDropdowns, setTaskDropdowns] = useState<boolean[]>(
    Array.from(props.list.tasks.map(_ => false))
  );

  function handleTaskToggle(taskIdx: number) {
    setTaskDropdowns(oldVal => {
      return oldVal.map((val, idx) => {
        return taskIdx === idx ? !val : val;
      })
    });
  }
  return (
    <div className='grid grid-cols-1 gap-4'>
      {
        props.list.tasks.map((taskElem, taskIdx) => {
          return (
            <Draggable key={taskElem.task_id} draggableId={taskElem.task_id} index={taskIdx}>
              {(taskProvider, snapshot) => (
                <div 
                  className={`p-4 rounded-2xl border-2 shadow-sm w-full 
                    ${snapshot.isDragging ? 'bg-gray-200' : 'bg-white'}`}
                  ref={taskProvider.innerRef}
                  {...taskProvider.draggableProps}
                  {...taskProvider.dragHandleProps}
                >
                  <div className='flex justify-between'>
                    <div className='font-bold'>{taskElem.name}</div>
                    <div className='flex'>
                      <AiOutlineClockCircle size={23} />
                      <div className='pl-1'>{taskElem.deadline} days</div>
                    </div>
                    <div className='relative'>
                      <button onClick={() => handleTaskToggle(taskIdx)}>
                        <BsThreeDotsVertical size={23} />
                      </button>
                      { taskDropdowns[taskIdx] && (
                        <ButtonsDropdown
                          lines={() => getTaskDropdown(taskElem, props.list.list_id, props.project)} 
                          onDropdownClose={() => handleTaskToggle(taskIdx)}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='text-gray-500'>{taskElem.description}</div>
                    <Members members={taskElem.assignments.map(elem => {
                      return {
                        member_id: elem.user_id,
                        username: elem.username,
                        image_url: elem.image_url
                      }
                    })} />
                  </div>
                </div>
              )}
            </Draggable>
          )
        })
      }
    </div>
  )
}