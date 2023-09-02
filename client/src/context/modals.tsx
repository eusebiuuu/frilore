import { ReactNode, createContext, useContext, useState } from "react";
import { Task } from "../features/projects/utils.project";
import { TaskModalProps } from "../features/tasks/TaskModal";
import { CreateTaskModalProps } from "../features/tasks/CreateTaskModal";
import { ListModalProps } from "../features/projects/ListModal";
import { GeneralModalProps } from "../components/Modal";

type ModalContextProps = {
  children: ReactNode
}

type Modals = {
  singleTask: {
    content: TaskModalProps,
    open: boolean,
  },
  actionTask: {
    content: CreateTaskModalProps,
    open: boolean,
  },
  list: {
    content: ListModalProps,
    open: boolean,
  },
  general: {
    content: GeneralModalProps,
    open: boolean,
  }
}

const dummyTask: Task = {
  task_id: '',
  name: '',
  status: 'to do',
  deadline: '2023-05-23',
  description: '',
  priority: 'high',
  assignments: [],
  open: true,
  created_at: new Date(),
}

const dummyFunction = () => {};

const dummyPromise = async () => {};

const initialContextState: Modals = {
  singleTask: {
    open: false,
    content: {
      task: dummyTask,
      onModalClose: dummyFunction,
    }
  },
  actionTask: {
    open: false,
    content: {
      onModalClose: dummyFunction,
      members: [],
      listID: '',
      projectTitle: '',
      type: 'create',
    }
  },
  list: {
    open: false,
    content: {
      action: dummyPromise,
      onModalClose: dummyFunction,
    }
  },
  general: {
    open: false,
    content: {
      question: '',
      leftContent: '',
      rightContent: '',
      rightAction: dummyPromise,
      onModalClose: dummyFunction,
    }
  }
}

type ModalsNames = 'singleTask' | 'actionTask' | 'list' | 'general';

type ModalContextValue = {
  modalInfo: Modals,
  onActionTaskChange: (open: boolean, content: CreateTaskModalProps) => void,
  onListChange: (open: boolean, content: ListModalProps) => void,
  onSingleTaskChange: (open: boolean, content: TaskModalProps) => void,
  onGeneralModalChange: (open: boolean, content: GeneralModalProps) => void,
  onModalToggle: (name: ModalsNames, state: boolean) => void,
}

const defaultContextState: ModalContextValue = {
  modalInfo: initialContextState,
  onActionTaskChange: dummyFunction,
  onListChange: dummyFunction,
  onSingleTaskChange: dummyFunction,
  onGeneralModalChange: dummyFunction,
  onModalToggle: dummyFunction,
}

const ModalContext = createContext(defaultContextState);

export default function ModalProvider({ children }: ModalContextProps) {
  const [modalInfo, setModalInfo] = useState<Modals>(initialContextState);

  function handleSingleTaskChange(open: boolean, content: TaskModalProps) {
    setModalInfo(oldData => {
      return {
        ...oldData,
        singleTask: {
          open,
          content,
        }
      }
    })
  }

  function handleActionTaskChange(open: boolean, content: CreateTaskModalProps) {
    setModalInfo(oldData => {
      return {
        ...oldData,
        actionTask: {
          open,
          content,
        }
      }
    })
  }

  function handleListChange(open: boolean, content: ListModalProps) {
    setModalInfo(oldData => {
      return {
        ...oldData,
        list: {
          open,
          content,
        }
      }
    })
  }

  function handleGeneralModalChange(open: boolean, content: GeneralModalProps) {
    setModalInfo(oldData => {
      return {
        ...oldData,
        general: {
          open,
          content,
        }
      }
    })
  }

  function handleModalToggle(name: ModalsNames, state: boolean) {
    setModalInfo(oldVal => {
      return {
        ...oldVal,
        [name]: {
          ...oldVal[name],
          open: state,
        }
      }
    })
  }

  const value: ModalContextValue = {
    modalInfo,
    onActionTaskChange: handleActionTaskChange,
    onGeneralModalChange: handleGeneralModalChange,
    onListChange: handleListChange,
    onSingleTaskChange: handleSingleTaskChange,
    onModalToggle: handleModalToggle,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext);