import { DropResult } from "react-beautiful-dnd";
import { CompleteProject } from "./utils.project";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/catchAxiosError";
import { toast } from "react-toastify";

export async function onDragEnd(
  result: DropResult, project: CompleteProject, 
  onProjectChange: (project: CompleteProject) => void,
  ) {
  const { destination, source, draggableId, type } = result;
  // console.log(destination, source, draggableId);
  if (!destination) {
    return;
  }
  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return;
  }
  if (type === 'task') {
    const initList = project.lists.find(elem => elem.list_id === source.droppableId);
    const currList = project.lists.find(elem => elem.list_id === destination.droppableId);
    if (!initList || !currList) {
      return;
    }
    const movedTask = initList.tasks.find(elem => elem.task_id === draggableId);
    if (!movedTask) {
      return;
    }
    const listArr = currList.list_id !== initList.list_id ? [initList, currList] : [currList];
    const startIdx = 0, endIdx = listArr.length - 1;
    const newTasksInitList = Array.from(listArr[startIdx].tasks);
    const newTasksCurrList = Array.from(listArr[endIdx].tasks);
    const tasksArr = endIdx === 0 ? [newTasksCurrList] : [newTasksInitList, newTasksCurrList];
    tasksArr[startIdx].splice(source.index, 1);
    tasksArr[endIdx].splice(destination.index, 0, movedTask);
    listArr[startIdx] = {
      ...listArr[startIdx],
      tasks: tasksArr[startIdx],
    }
    listArr[endIdx] = {
      ...listArr[endIdx],
      tasks: tasksArr[endIdx],
    }
    onProjectChange({
      ...project,
      lists: project.lists.map(elem => {
        if (elem.list_id === listArr[startIdx].list_id) {
          return listArr[startIdx];
        } else if (elem.list_id === listArr[endIdx].list_id) {
          return listArr[endIdx];
        }
        return elem;
      })
    });
    if (listArr.length === 2) {
      try {
        await customFetch.patch(`/task/${movedTask.task_id}`, { listID: listArr[endIdx].list_id });
      } catch (err) {
        catchAxiosError(err);
        return;
      }
    }
    for (const list of listArr) {
      try {
        await customFetch.patch(`/task/order`, {
          order: Array.from(list.tasks, (elem) => elem.task_id),
          projectID: project.project_id,
        });
        list.tasks = list.tasks.map((elem, idx) => {
          return {
            ...elem,
            order_num: idx + 1,
          }
        })
      } catch (err) {
        catchAxiosError(err);
        return;
      }
    }
    onProjectChange({
      ...project,
      lists: project.lists.map(elem => {
        if (elem.list_id === listArr[startIdx].list_id) {
          return listArr[startIdx];
        } else if (elem.list_id === listArr[endIdx].list_id) {
          return listArr[endIdx];
        }
        return elem;
      })
    });
    toast.success('Task moved successfully');
  } else if (type === 'list') {
    const listArr = project.lists;
    const movedList = listArr.find(elem => elem.list_id === draggableId);
    if (!movedList) {
      return;
    }
    listArr.splice(source.index, 1);
    listArr.splice(destination.index, 0, movedList);
    try {
      await customFetch.patch('/list/order', {
        projectID: project.project_id,
        order: Array.from(listArr, elem => elem.list_id),
      })
    } catch (err) {
      catchAxiosError(err);
      return;
    }
    onProjectChange({
      ...project,
      lists: listArr.map((elem, idx) => {
        return {
          ...elem,
          order_num: idx + 1,
        }
      }),
    });
    toast.success('List moved successfully');
  }
}