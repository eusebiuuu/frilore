
export type ModalData = {
  content: string,
  text: string,
  action: () => Promise<unknown>,
  open: boolean,
}

export type Assignment = {
  assignment_id: string,
  user_id: string,
  type: 'assignee' | 'reporter',
  username: string,
}

export type Task = {
  task_id: string,
  name: string,
  description: string,
  priority: 'low' | 'high',
  status: 'to do' | 'pending' | 'completed',
  deadline: string,
  assignments: Assignment[],
  open?: boolean,
}

type List = {
  list_id: string,
  title: string,
  tasks: Task[]
}

export type Member = {
  member_id: string,
  username: string,
  role: string,
}

export type CompleteProject = {
  project_id: string,
  name: string,
  description: string,
  members: Member[],
  lists: List[],
}

export type ProjectsWithMembers = {
  project_id: string,
  description: string | '',
  name: string,
  lastUpdates: string[],
  created_at?: string,
  members: {
    member_id: string,
    username: string,
  }[]
}[];

export const lastUpdates = [
  {
    id: 0,
    description: 'Andrew added alexalex to the project'
  },
  {
    id: 1,
    description: 'Andrew assigned task `Complete the back-end` to alexalex and eusebiuu'
  },
  {
    id: 2,
    description: 'Andrew created the project'
  },
  {
    id: 3,
    description: 'Andrew added you to the project'
  }
];

export const allMembers = [
  {
    id: 0,
    name: 'Andrew andrew',
  },
  {
    id: 1,
    name: 'Alex alex',
  },
  {
    id: 2,
    name: 'Stephan stephan',
  },
  {
    id: 3,
    name: 'John Smith',
  },
  {
    id: 4,
    name: 'John Smith',
  },
  {
    id: 5,
    name: 'John Smith',
  },
  {
    id: 6,
    name: 'John Smith',
  }
];

export const tasks = [
  {
    id: 0,
    title: 'Food research',
    days: 12,
    description: 'Food design is required for our new project let\'s research the best practices.'
  },
  {
    id: 1,
    title: 'Food research',
    days: 12,
    description: 'Food design is required for our new project let\'s research the best practices.'
  },
  {
    id: 2,
    title: 'Food research',
    days: 12,
    description: 'Food design is required for our new project let\'s research the best practices.'
  },
  {
    id: 3,
    title: 'Food research',
    days: 12,
    description: 'Food design is required for our new project let\'s research the best practices.'
  },
  {
    id: 4,
    title: 'Food research',
    days: 12,
    description: 'Food design is required for our new project let\'s research the best practices.'
  },
]