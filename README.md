## Welcome to Frilore - the project management tool to rule them all!

Want to see the project in action? Click [here](http://frilore.xyz).  

Want to see the API Docs? Click [here](https://documenter.getpostman.com/view/24263146/2s9YC7SWYt).  

[I want to see some code.](#code-snippets)  

Add more

## Table of content
- [Overview](#overview)
  - [Introduction](#introduction)
  - [Workflow](#workflow)
  - [Technologies and tools](#technologies-and-tools)
  - [Code structure](#code-structure)
  - [Technical decisions](#technical-decisions)
  - [Future implementations](#future-implementations)
- [API docs](#api-docs)
- [Database structure](#database-structure)
- [Code snippets](#code-snippets)
- [Conclusion](#conclusion)
- [Licence](#licence)


## Overview
### Introduction
Welcome to my second full-stack project called **Frilore**. In this one, I focused on imitating a project management tool since I found this theme pretty challenging.  


**The entire project is structured and build only by me.**   


### Workflow
Throughout the building phase I focused on respecting the principles of a professional workflow like creating meaningful commits, using pull requests, writing readable code, respecting a predetermined plan, respecting deadlines and much more.  

You can check my general plan [here](https://docs.google.com/document/d/1WPNRGDCBKOQlnnAGeoCDX3A48MTuQiz9MAKsM80vaug/edit?usp=sharing) (note that it's build based on my experience and I know it's not very professional).   

### Technologies and tools
This project was made with the help of various technologies and tools. Some of them are the following:  
- Tailwind for CSS
- React with Vite for front-end
- Node and Express for API
- PostgreSQL is the relational database
- The API structure respects the REST principles
- Postman was responsible with the initial API testing and the final API documentation
- The containerisation was made with Docker
- The deployment was made through AWS EC2 service   


### Code structure
Fundamentally, both parts, front-end and back-end, were structured around features.  

Front-end functionality is located mostly in components and features directories.   

API functionality is located mostly in the api directory, respecting the MVC pattern.   


### Technical decisions
I used Tailwind CSS because of the ease of writing CSS it provides.   

I focused on handling React states locally and using the ContextAPI because React Redux or any other library would have been overkill.   

I used Docker and EC2 deployment because I see it's a more professional way of deploying full-stack web apps and it offers a lot of customisations.  

Lastly, I didn't write any tests or create any CI/CD pipelines because I wanted to focus on the functionality of the app.   


### Future updates
In the near future, if time allows me, I plan to add more features: comments within tasks, individual chats, Google Sign Up, some AI chatbot (?) and sorting tasks within a list based on the status.  

Besides this, I plan to improve project's design and general app performance.   


## API docs
Check the Postman API Docs [here](https://documenter.getpostman.com/view/24263146/2s9YC7SWYt).   

## Database structure
Check the database structure [here](https://github.com/eusebiuuu/frilore/assets/107063753/c3f053cb-8ded-4eae-968c-4aadc5e47a73).

## Code snippets

#### Abstract state type (created, deleted, updated)
```js
export function getStates(arrObj1: Array<ObjType>, arrObj2: Array<ObjType>) {
  const deletedObj: ObjType[] = arrObj1.filter(elem1 => {
    if (!arrObj2.find(elem2 => elem2.id === elem1.id)) {
      return elem1;
    }
  });
  const createdObj: ObjType[] = arrObj2.filter(elem2 => {
    if (!arrObj1.find(elem1 => elem1.id === elem2.id)) {
      return elem2;
    }
  });
  const updatedObj: ObjType[] = arrObj2.filter(elem2 => {
    const sameObj = arrObj1.find(elem1 => elem1.id === elem2.id ? elem1 : null);
    if (sameObj && JSON.stringify(elem2.body) !== JSON.stringify(sameObj.body)) {
      return true;
    }
  });
  return {
    create: createdObj.map((elem) => elem.body),
    update: updatedObj.map((elem) => elem.body),
    delete: deletedObj.map((elem) => elem.body),
  }
}
```

#### Get single project query
```sql
SELECT project_id, name, description, COALESCE(members, '[]'::json) AS members, COALESCE(lists_array.lists, '[]'::json) 
AS lists FROM (SELECT p.project_id, p.name, p.description, user_info.members FROM project p LEFT JOIN (SELECT json_agg
(json_build_object('member_id', user_table.user_id, 'username', username, 'role', role, 'image_url', user_table.
image_url)) AS members, project_id FROM registration JOIN user_table ON user_table.user_id = registration.user_id GROUP 
BY project_id) AS user_info ON p.project_id = user_info.project_id WHERE p.project_id = $1) AS project_data LEFT JOIN 
(SELECT json_agg(json_build_object('list_id', l.list_id, 'title', l.title, 'order_num', l.order_num, 'tasks', COALESCE
(tasks_array.tasks, '[]'::json)) ORDER BY l.order_num) AS lists, project FROM list l LEFT JOIN (SELECT json_agg
(json_build_object('task_id', t.task_id, 'name', t.name, 'description', t.description, 'priority', t.priority, 
'status', t.status, 'deadline', t.deadline, 'order_num', t.order_num, 'assignments', COALESCE(assignment_data.
assignments, '[]'::json)) ORDER BY t.order_num) AS tasks, list FROM task t LEFT JOIN (SELECT json_agg(json_build_object
('assignment_id', a.assignment_id, 'user_id', a.user_id, 'type', a.type, 'username', user_data.username, 'image_url', 
user_data.image_url)) AS assignments, task FROM assignment a LEFT JOIN (SELECT * FROM user_table GROUP BY user_id) AS 
user_data ON user_data.user_id = a.user_id GROUP BY task) AS assignment_data ON assignment_data.task = t.task_id GROUP 
BY list) AS tasks_array ON tasks_array.list = l.list_id GROUP BY l.project) AS lists_array ON lists_array.project = 
project_data.project_id
```

#### Update assignments
```js
const membersState = getStates(prepareForObjectState(initialTaskMembers), prepareForObjectState(taskMembers));
for (const member of membersState.delete as TaskMember[]) {
  notificationsSocket.emit('delete-assignment', task.name, props.project.name, member.user_id);
  await customFetch.delete(`/assignment/${member.user_id}/${currTask.task_id}`);
}
for (const member of membersState.create as TaskMember[]) {
  notificationsSocket.emit('create-assignment', task.name, props.project.name, member.user_id);
  await customFetch.post(`/assignment`, {
    newUserID: member.user_id,
    taskID: currTask.task_id,
    assignmentType: member.type,
  });
}
for (const member of membersState.update as TaskMember[]) {
  notificationsSocket.emit('update-assignment', task.name, props.project.name, member.user_id);
  await customFetch.patch(`/assignment`, {
    currUserID: member.user_id,
    taskID: task.task_id,
    assignmentType: member.type,
  });
}
```

## Conclusion
Hope you enjoy the project as much as I do!  

If you have any more question, don't hesitate to contact me: <eusebiu.rimboi04@gmail.com>.

## Licence
[MIT](https://choosealicense.com/licenses/mit/)
