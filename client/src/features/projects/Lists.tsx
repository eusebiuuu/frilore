import { BsThreeDots } from "react-icons/bs";
import { CompleteProject } from "./utils.project"
import ButtonsDropdown from "../../components/ButtonsDropdown";
import { AiOutlinePlus } from "react-icons/ai";
import { getListDropdown } from "./dropdownActions";
import { useState } from "react";
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { onDragEnd } from "./onDragEnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import Tasks from "./Tasks";
import { useModalContext } from "../../context/modals";

type Props = {
  project: CompleteProject,
  onProjectChange: (project: CompleteProject) => void,
}

export default function Lists(props: Props) {
  const { project } = props;
  const { onActionTaskChange, onModalToggle } = useModalContext();
  const [listDropdowns, setListDropdowns] = useState(Array.from(
    project.lists.map(() => false)
  ));

  function handleListToggle(idx: number) {
    return setListDropdowns(oldVal => {
      return oldVal.map((val, curIdx) => {
        return idx === curIdx ? !val : val;
      })
    })
  }

  function handleTaskModalCreate(listID: string) {
    onActionTaskChange(true, {
      type: 'create',
      onModalClose: () => onModalToggle('actionTask', false),
      members: project.members,
      project: project,
      onProjectChange: props.onProjectChange,
      listID,
    });
  }

  return (
    <DragDropContext onDragEnd={async (result) => await onDragEnd(result, project, props.onProjectChange)}>
      <StrictModeDroppable droppableId="lists" direction="horizontal" type='list'>
        {((provider) =>
          <div
            ref={provider.innerRef}
            className='grid grid-flow-col gap-6 overflow-auto w-full'
            {...provider.droppableProps}
          >
            {
              project.lists.map((elem, listIdx) => {
                return (
                  <Draggable key={elem.list_id} draggableId={elem.list_id} index={listIdx}>
                    {(listDragProvider) => 
                      <div 
                        ref={listDragProvider.innerRef}
                        {...listDragProvider.draggableProps}
                        {...listDragProvider.dragHandleProps}
                      >
                        <StrictModeDroppable droppableId={elem.list_id} type="task">
                          {(listProvider, snapshot) =>
                            <div ref={listProvider.innerRef} className={`bg-white rounded-lg min-w-96 mb-6`} 
                              {...listProvider.droppableProps}>
                              <div 
                                className='flex justify-between bg-gray-200 p-3 rounded-t-md'
                              >
                                <h3 className='grid place-content-center'>{elem.title}</h3>
                                <div className='relative'>
                                  <button onClick={() => handleListToggle(listIdx)}>
                                    <BsThreeDots size={25} />
                                  </button>
                                  { listDropdowns[listIdx] && (
                                    <ButtonsDropdown 
                                      lines={() => getListDropdown(elem, project, props.onProjectChange)}
                                      onDropdownClose={() => handleListToggle(listIdx)}
                                    />
                                  )}
                                </div>
                              </div>
                              <div 
                                className={`${snapshot.isDraggingOver ? ' bg-blue-200' : 'bg-transparent'}`}>
                                <button 
                                  className='w-full rounded-2xl border-dashed border-4 
                                    grid place-content-center py-1 my-4'
                                  onClick={() => handleTaskModalCreate(elem.list_id)}
                                >
                                  <AiOutlinePlus size={30} />
                                </button>
                                <div>
                                  { elem.tasks.length > 0
                                    ? <Tasks list={elem} project={project} onProjectChange={props.onProjectChange} />
                                    : <div className="w-full text-center">
                                      <h3>No tasks yet</h3>
                                    </div>
                                  }
                                </div>
                              </div>
                              {listProvider.placeholder}
                            </div>
                          }
                        </StrictModeDroppable>
                      </div>                    
                    }
                  </Draggable>
                )
              })
            }
            {provider.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}