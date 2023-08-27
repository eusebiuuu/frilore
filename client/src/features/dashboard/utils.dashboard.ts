import { Task } from "../projects/utils.project";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function getTaskData(tasks: Task[]) {
  const currMonthIdx = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const ans: {
    month: string,
    count: number,
  }[] = [];
  for (let i = currMonthIdx + 1; i < months.length; ++i) {
    const count = tasks.reduce((sum: number, currElem) => {
      const monthStr = currElem.deadline.slice(5, 7);
      const yearStr = currElem.deadline.slice(0, 4);
      return sum + Number((parseInt(monthStr, 10) === i) && (parseInt(yearStr, 10) === currYear - 1));
    }, 0);
    ans.push({
      month: months[i].slice(0, 3),
      count: count,
    });
  }
  for (let i = 0; i <= currMonthIdx; ++i) {
    const count = tasks.reduce((sum: number, currElem) => {
      const monthStr = currElem.deadline.slice(5, 7);
      const yearStr = currElem.deadline.slice(0, 4);
      return sum + Number((parseInt(monthStr, 10) === i) && (parseInt(yearStr, 10) === currYear));
    }, 0);
    ans.push({
      month: months[i].slice(0, 3),
      count: count,
    });
  }
  // console.log(ans);
  return ans;
}

export const colours = ['#ff4d4d', '#4db8ff', '#8cff66'];

export function getProjectsData(projects: { name: string, total_tasks: string }[] | []) {
  const ans = projects.filter(elem => {
    if (parseInt(elem.total_tasks, 10) > 0) {
      return true;
    }
  }).map(elem => {
    return {
      name: elem.name,
      value: parseInt(elem.total_tasks, 10),
    }
  })
  return ans;
}

export function getTaskStatusData(tasks: Task[]) {
  let ans = [
    {
      name: "to do",
      high: 0,
      low: 0,
    },
    {
      name: "pending",
      high: 0,
      low: 0,
    },
    {
      name: "completed",
      high: 0,
      low: 0,
    }
  ];
  tasks.map(elem => {
    ans = ans.map(currElem => {
      if (elem.status === currElem.name) {
        return {
          ...currElem,
          [elem.priority]: currElem[elem.priority] + 1,
        }
      }
      return currElem;
    });
  });
  return ans;
}