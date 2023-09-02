import { toast } from "react-toastify"
import customFetch from "../../lib/customFetch"
import { DetailedMember, Project } from "./CreateProject"
import { catchAxiosError } from "../../utils/utils"
import { getStates } from "../../utils/getObjectsStates"
import { notificationsSocket } from "../../socket"

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
  image_url: string,
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
  created_at: Date,
  order_num?: number,
}

export type List = {
  list_id: string,
  title: string,
  tasks: Task[],
  order_num?: number,
}

export type Member = {
  member_id: string,
  username: string,
  role: string,
  image_url: string,
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
  created_at: string,
  members: {
    member_id: string,
    username: string,
    image_url: string,
  }[]
}[];

export function prepareForObjectState(arr: DetailedMember[]) {
  return arr.map(elem => {
    return {
      id: elem.member_id,
      body: elem,
    }
  })
}

export async function addMemberToProject(
    project: Project, memberID: string, setMemberLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setProject: React.Dispatch<React.SetStateAction<Project>>
  ) {
  const exists = project.members.find(elem => {
    return elem.member_id === memberID ? elem : null;
  });
  if (exists) {
    toast.error('The user already exists');
    return;
  }
  setMemberLoading(true);
  try {
    const result = await customFetch.get(`user/${memberID}`);
    const currUser = result.data.user;
    setProject(oldVal => {
      return {
        ...oldVal,
        members: [...oldVal.members, {
          username: currUser.username,
          role: currUser.role === '' ? 'no role specified' : currUser.role,
          member_id: currUser.user_id,
          is_leader: false,
          image_url: currUser.image_url,
        }]
      }
    });
  } catch (err) {
    catchAxiosError(err);
  } finally {
    setMemberLoading(false);
  }
}

export async function handleRegistrationsChange(
    edit: boolean, project: Project, projectID: string, initialRegistrations: DetailedMember[], userID: string
  ) {
  let newProject;
  if (edit) {
    newProject = await customFetch.patch(`/project/${projectID}`, project);
  } else {
    newProject = await customFetch.post('/project', project);
  }
  const registrationStates = getStates(
    prepareForObjectState(initialRegistrations),
    prepareForObjectState(project.members)
  );
  // console.log(registrationStates);
  for (const member of registrationStates.create as any[] as DetailedMember[]) {
    await customFetch.post('/registration', {
      candidateID: member.member_id,
      projectID: newProject.data.project.project_id,
      is_leader: member.is_leader,
    });
    notificationsSocket.emit('create-registration',
      newProject.data.project.name,
      member.member_id === userID,
      member.member_id
    );
  }
  for (const member of registrationStates.update as any[] as DetailedMember[]) {
    await customFetch.patch(`/registration`, {
      registeredUserID: member.member_id,
      projectID: newProject.data.project.project_id,
      is_leader: member.is_leader,
    });
    notificationsSocket.emit('update-registration',
      newProject.data.project.name,
      member.member_id
    );
  }
  for (const member of registrationStates.delete as any[] as DetailedMember[]) {
    await customFetch.delete(`/registration/${projectID}/${member.member_id}`);
    notificationsSocket.emit('delete-registration',
      newProject.data.project.name,
      false,
      member.member_id
    );
  }
  return newProject;
}