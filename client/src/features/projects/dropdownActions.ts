import { useNavigate } from "react-router-dom";
import { Line } from "../../components/ButtonsDropdown";
import { useModalContext } from "../../context/modals";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import { CompleteProject, List, Task } from "./utils.project";

export function getTaskDropdown(task: Task, listID: string,
  project: CompleteProject, onProjectChange: (project: CompleteProject) => void
): Line[] {
  const { onGeneralModalChange, onModalToggle, onActionTaskChange, onSingleTaskChange } = useModalContext();

  async function handleTaskDelete() {
    try {
      await customFetch.delete(`/task/${task.task_id}`);
      onProjectChange({
        ...project,
        lists: project.lists.map(elem => {
          if (elem.list_id !== listID) {
            return elem;
          }
          return {
            ...elem,
            tasks: elem.tasks.filter(currTask => currTask.task_id !== task.task_id)
          }
        })
      })
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function actionTaskDelete() {
    onGeneralModalChange(true, {
      rightAction: async() => handleTaskDelete(),
      question: 'Are you sure?',
      rightContent: 'Delete',
      onModalClose: () => onModalToggle('general', false),
    });
  }

  function actionTaskUpdate() {
    onActionTaskChange(true, {
      type: 'update',
      task,
      listID,
      onModalClose: () => onModalToggle('actionTask', false),
      members: project.members,
      project,
      onProjectChange,
    })
  }

  function actionGetMoreInfo() {
    onSingleTaskChange(true, {
      onModalClose: () => onModalToggle('singleTask', false),
      task,
    })
  }

  return [
    {
      name: 'Delete task',
      action: actionTaskDelete,
    },
    {
      name: 'Update task',
      action: actionTaskUpdate,
    },
    {
      name: 'More info',
      action: actionGetMoreInfo,
    }
  ]
}

export function getListDropdown(list: List, project: CompleteProject,
  onProjectChange: (project: CompleteProject) => void
): Line[] {
  const { onGeneralModalChange, onModalToggle } = useModalContext();

  async function handleListDelete() {
    try {
      await customFetch.delete(`/list/${list.list_id}`);
      onProjectChange({
        ...project,
        lists: project.lists.filter(elem => elem.list_id !== list.list_id),
      })
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function actionListDelete() {
    onGeneralModalChange(true, {
      question: 'Are you sure?',
      rightContent: 'Delete',
      rightAction: handleListDelete,
      onModalClose: () => onModalToggle('general', false),
    })
  }

  async function handleAllTasksDelete() {
    try {
      await customFetch.delete(`/list/tasks/${list.list_id}/${project.project_id}`);
      onProjectChange({
        ...project,
        lists: project.lists.map(elem => {
          if (elem.list_id !== list.list_id) {
            return elem;
          }
          return {
            ...elem,
            tasks: [],
          }
        })
      })
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function actionAllTasksDelete() {
    onGeneralModalChange(true, {
      question: 'Are you sure?',
      rightContent: 'Delete all tasks',
      rightAction: handleAllTasksDelete,
      onModalClose: () => onModalToggle('general', false),
    })
  }

  return [
    {
      name: 'Delete list',
      action: actionListDelete,
    },
    {
      name: 'Delete all tasks',
      action: actionAllTasksDelete,
    }
  ]
}

export function getProjectDropdown(
  project: CompleteProject,
  onProjectChange: (project: CompleteProject) => void,
): Line[] {
  const { onListChange, onModalToggle, onGeneralModalChange } = useModalContext();
  const navigate = useNavigate();

  async function handleListCreate(title: string) {
    try {
      const result = await customFetch.post(`/list`, {
        title,
        projectID: project.project_id,
      });
      onProjectChange({
        ...project,
        lists: [
          ...project.lists,
          { ...result.data.list }
        ]
      })
    } catch (err) {
      catchAxiosError(err);
    }
  }

  function actionListCreate() {
    onListChange(true, {
      action: handleListCreate,
      onModalClose: () => onModalToggle('list', false),
      onProjectChange,
      project,
    })
  }

  async function handleProjectDelete() {
    try {
      await customFetch.delete(`/project/${project.project_id}`);
    } catch (err) {
      catchAxiosError(err);
    }
    navigate('/projects');
  }

  function actionProjectDelete() {
    onGeneralModalChange(true, {
      question: 'Are you sure?',
      rightAction: handleProjectDelete,
      rightContent: 'Delete',
      onModalClose: () => onModalToggle('general', false),
    })
  }

  return [
    {
      name: 'Create list',
      action: actionListCreate,
    },
    {
      name: 'Alter members',
      action: `/create-project/${project.project_id}`,
      type: 'link',
    },
    {
      name: 'Edit project',
      action: `/create-project/${project.project_id}`,
      type: 'link',
    },
    {
      name: 'Delete project',
      action: actionProjectDelete,
    }
  ]
}