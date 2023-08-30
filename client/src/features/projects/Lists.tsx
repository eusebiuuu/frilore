import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { CompleteProject, ModalData, Task } from "./utils.project"
import ButtonsDropdown from "../../components/ButtonsDropdown";
import { AiOutlineClockCircle, AiOutlinePlus } from "react-icons/ai";
import Members from "../../components/Members";
import { getListDropdown, getTaskDropdown } from "./dropdown-logic";
import { useState } from "react";
import { ITaskData } from "./SingleProject";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { onDragEnd } from "./onDragEnd";

type Props = {
  project: CompleteProject,
  onModalDataChange: (data: ModalData) => void,
  taskModalData: ITaskData,
  setTaskModalData: React.Dispatch<React.SetStateAction<ITaskData>>,
  trigger: () => void,
  setProject: React.Dispatch<React.SetStateAction<CompleteProject | undefined>>
}

export default function Lists(props: Props) {
  const { project } = props;
  const [listDropdowns, setListDropdowns] = useState(Array.from(
    project.lists.map(() => false)
  ));
  const [taskDropdowns, setTaskDropdowns] = useState<boolean[][]>(
    Array.from(project.lists.map(elem => {
      return Array.from(elem.tasks.map(_ => false))
    }))
  );

  function handleListToggle(idx: number) {
    return setListDropdowns(oldVal => {
      return oldVal.map((val, curIdx) => {
        return idx === curIdx ? !val : val;
      })
    })
  }

  function handleTaskToggle(listIdx: number, taskIdx: number) {
    return setTaskDropdowns(oldVal => {
      return oldVal.map((elem, idx) => {
        if (idx === listIdx) {
          return elem.map((val, idx) => {
            return taskIdx === idx ? !val : val;
          })
        }
        return elem;
      })
    });
  }

  async function handleListDelete(listID: string) {
    try {
      await customFetch.delete(`/list/${listID}`);
    } catch (err) {
      catchAxiosError(err);
    }
    props.trigger();
  }
  
  async function handleAllTasksDelete(listID: string) {
    try {
      await customFetch.delete(`/list/tasks/${listID}/${project.project_id}`);
    } catch (err) {
      catchAxiosError(err);
    }
    props.trigger();
  }

  async function handleTaskModalDelete(taskID: string) {
    try {
      await customFetch.delete(`/task/${taskID}`);
    } catch (err) {
      catchAxiosError(err);
    }
    props.trigger();
  }

  function handleTaskModalUpdate(task: Task, listID: string) {
    props.setTaskModalData({
      ...task,
      open: true,
      action: 'update',
      listID
    });
  }

  function handleTaskModalCreate(listID: string) {
    props.setTaskModalData({
      task_id: '',
      name: '',
      status: 'to do',
      deadline: '2023-05-23',
      description: '',
      priority: 'high',
      assignments: [],
      open: true,
      action: 'create',
      listID,
      created_at: new Date(),
    });
  }

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result, project, props.setProject)}>
      <div className='flex overflow-auto w-full rotate-x'>
        {
          project.lists.map((elem, listIdx) => {
            return (
              <Droppable key={listIdx} droppableId={elem.list_id}>
                {provider =>
                  <div ref={provider.innerRef} className='border-gray-200 border-solid 
                    border-2 rounded-lg min-w-96 mb-6 mx-5 rotate-scroll rotate-x' {...provider.droppableProps}>
                    <div className='flex justify-between bg-gray-200 p-3 rounded-t-md'>
                      <h4 className='grid place-content-center'>{elem.title}</h4>
                      <div className='relative'>
                        <button onClick={() => handleListToggle(listIdx)}>
                          <BsThreeDots size={25} />
                        </button>
                        { listDropdowns[listIdx] && (
                          <ButtonsDropdown lines={getListDropdown(props.onModalDataChange, 
                            async () => await handleListDelete(elem.list_id),
                            async () => await handleAllTasksDelete(elem.list_id))}
                            onDropdownClose={() => handleListToggle(listIdx)}
                          />
                        )}
                      </div>
                    </div>
                    <div className='p-4'>
                      <button className='w-full rounded-2xl border-dashed border-4 grid place-content-center py-1'
                        onClick={() => handleTaskModalCreate(elem.list_id)}>
                        <AiOutlinePlus size={30} />
                      </button>
                      <div className='grid grid-cols-1'>
                        { elem.tasks.length > 0
                          ? elem.tasks.map((taskElem, taskIdx) => {
                            return (
                              <Draggable key={taskElem.task_id} draggableId={taskElem.task_id} index={taskIdx}>
                                {taskProvider => (
                                  <div className='p-4 rounded-2xl border-2 shadow-sm mt-4 cursor-grab [&>*]:cursor-grab'
                                    {...taskProvider.draggableProps}>
                                    <div className='flex justify-between'>
                                      <div className='font-bold'>{taskElem.name}</div>
                                      <div className='flex'>
                                        <AiOutlineClockCircle size={23} />
                                        <div className='pl-1'>{taskElem.deadline} days</div>
                                      </div>
                                      <div className='relative'>
                                        <button onClick={() => handleTaskToggle(listIdx, taskIdx)}>
                                          <BsThreeDotsVertical size={23} />
                                        </button>
                                        { taskDropdowns[listIdx][taskIdx] && <ButtonsDropdown
                                          lines={getTaskDropdown(props.onModalDataChange,
                                          async () => await handleTaskModalDelete(taskElem.task_id),
                                          () => handleTaskModalUpdate(taskElem, elem.list_id))} 
                                          onDropdownClose={() => handleTaskToggle(listIdx, taskIdx)}
                                        /> }
                                      </div>
                                    </div>
                                    <div {...taskProvider.dragHandleProps} ref={taskProvider.innerRef}>
                                      <div className='text-gray-500'>{taskElem.description}</div>
                                      {
                                        taskElem.assignments && <Members members={taskElem.assignments.map(elem => {
                                          return {
                                            member_id: elem.user_id,
                                            username: elem.username,
                                            image_url: elem.image_url
                                          }
                                        })} />
                                      }
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })
                          : <h3 className="m-auto">No tasks yet</h3>
                        }
                      </div>
                    </div>
                    {provider.placeholder}
                  </div>
                }
              </Droppable>
            )
          })
        }
      </div>
    </DragDropContext>
  )
}