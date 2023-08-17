import { Line } from "../../components/ButtonsDropdown";
import { ModalData } from "./utils.project";

export function getTaskDropdown(handleModalDataChange: (data: ModalData) => void, 
  onTaskDelete: () => Promise<unknown>, onTaskUpdate: () => void): Line[] {
  return [
    {
      name: 'Delete task',
      action: () => handleModalDataChange({
        action: onTaskDelete,
        content: 'Are you sure?',
        text: 'Delete',
        open: true,
      }),
    },
    {
      name: 'Update task',
      action: () => onTaskUpdate(),
    }
  ]
}

export function getListDropdown(handleModalDataChange: (data: ModalData) => void, 
  onListDelete: () => Promise<unknown>, onAllTasksDelete: () => Promise<unknown>): Line[] {
  return [
    {
      name: 'Delete list',
      action: () => handleModalDataChange({
        action: onListDelete,
        content: 'Are you sure?',
        text: 'Delete',
        open: true,
      }),
    },
    {
      name: 'Delete all tasks',
      action: () => handleModalDataChange({
        action: onAllTasksDelete,
        content: 'Are you sure?',
        text: 'Delete',
        open: true,
      }),
    }
  ]
}

export function getProjectDropdown(handleModalDataChange: (data: ModalData) => void,
  projectID: string | undefined, onModalOpen: () => void, onProjectDelete: () => Promise<unknown>,
  onProjectLeave: () => Promise<unknown>): Line[] {
  return [
    {
      name: 'Create list',
      action: onModalOpen,
    },
    {
      name: 'Alter members',
      action: `/create-project/${projectID}`,
      type: 'link',
    },
    {
      name: 'Edit project',
      action: `/create-project/${projectID}`,
      type: 'link',
    },
    {
      name: 'Delete project',
      action: () => handleModalDataChange({
        action: onProjectDelete,
        content: 'Are you sure?',
        text: 'Delete',
        open: true,
      }),
    },
    {
      name: 'Leave project',
      action: () => handleModalDataChange({
        content: 'Are you sure?',
        text: 'Leave project',
        action: onProjectLeave,
        open: true,
      })
    }
  ]
}