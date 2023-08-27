import { ObjType } from "../../utils/getObjectsStates";

export const getDaysAgo = (curDate: Date): number => {
  const oldMilisec = curDate.getMilliseconds();
  const nowMilisec = new Date().getMilliseconds();
  const diff = nowMilisec - oldMilisec;
  const oneDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil(diff / oneDay);
  return days;
}

export function prepareForObjectState(arr: TaskMember[]): ObjType[] {
  return arr.map(elem => {
    if (elem.type !== 'none') {
      return {
        id: elem.user_id,
        body: elem,
      }
    }
  }).filter(elem => elem !== undefined) as unknown as ObjType[];
}

export type Colour = 'red' | 'orange' | 'green';

export type TaskMember = {
  user_id: string,
  type: 'assignee' | 'reporter' | 'none',
  username: string,
  role: string,
}

export const statusColour = new Map<string, string>([
  ['to do', 'red'],
  ['pending', 'orange'],
  ['completed', 'green']
]);

export const priorityColour = new Map<string, string>([
  ['high', 'red'],
  ['low', 'orange'],
]);

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

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const getFullDate = (strDate: string): string => {
  const date = new Date(strDate);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${months[month]} ${year}`;
}
