
type SingleTaskType = {
  id: number,
    title: string,
    deadline: Date,
    createdDate: Date,
    priority: 'low' | 'high',
    status: 'completed' | 'pending' | 'to do',
    author: string,
}

type TaskType = Array<SingleTaskType>

export const tasks: TaskType = [
  {
    id: 0,
    title: 'Make an Automatic Payment System that enable the design',
    deadline: new Date(),
    createdDate: new Date(),
    priority: 'low',
    status: 'completed',
    author: 'John Smith',
  },
  {
    id: 1,
    title: 'Make an Automatic Payment System that enable the design',
    deadline: new Date(),
    createdDate: new Date(),
    priority: 'low',
    status: 'to do',
    author: 'John Smith',
  },
  {
    id: 2,
    title: 'Make an Automatic Payment System that enable the design',
    deadline: new Date(),
    createdDate: new Date(),
    priority: 'low',
    status: 'pending',
    author: 'John Smith',
  },
  {
    id: 3,
    title: 'Make an Automatic Payment System that enable the design',
    deadline: new Date(),
    createdDate: new Date(),
    priority: 'low',
    status: 'completed',
    author: 'John Smith',
  },
];

export const getDaysAgo = (curDate: Date): number => {
  const oldMilisec = curDate.getMilliseconds();
  const nowMilisec = new Date().getMilliseconds();
  const diff = nowMilisec - oldMilisec;
  const oneDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil(diff / oneDay);
  return days;
}

export const StatusTypes = ['to do', 'pending', 'completed'];

export const tagClasses = {
  "green": {
    bg: 'bg-green-200',
    text: 'text-green-600',
  },
  "red": {
    bg: 'bg-red-200',
    text: 'text-red-600',
  },
  "orange": {
    bg: 'bg-orange-200',
    text: 'text-orange-600',
  }
}

export const people = [
  {
    id: 0,
    name: 'John Smith',
    role: 'web designer'
  },
  {
    id: 1,
    name: 'John Smith',
    role: 'web designer'
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'web designer'
  },
  {
    id: 3,
    name: 'John Smith',
    role: 'web designerwwwww'
  },
  {
    id: 4,
    name: 'John Smith',
    role: 'web designer'
  },
  {
    id: 5,
    name: 'John Smith',
    role: 'web designer'
  }
]

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const getFullDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${months[month]} ${year}`;
}
