export const addProject = 'INSERT INTO project (name, description, last_updates) VALUES ($1, $2, $3) RETURNING *';

export const getAllJoinedProjects = `SELECT * FROM project WHERE project_id IN (SELECT project_id FROM registration
WHERE user_id = $1)`;

export const getJoinedProjectQuery = `SELECT * FROM (${getAllJoinedProjects}) AS joined_projects WHERE project_id = $2`;

export const createOwnRegistration = `INSERT INTO registration (project_id, user_id, is_leader) VALUES
($1, $2, TRUE) RETURNING *`;

export const editProjectQuery = `UPDATE project SET name = $1, description = $2 WHERE project_id = $3 RETURNING *`;

export const deleteProjectQuery = 'DELETE FROM project WHERE project_id = $1';

export const deleteAllRegistrationsExceptAuthorQuery = `DELETE * FROM registration WHERE project_id = $1 AND
user_id != $2`;

export const getProjectsWithMembersQuery = `SELECT * FROM (${getAllJoinedProjects}) AS projects LEFT JOIN
(SELECT json_agg(json_build_object('member_id', user_table.user_id, 'username', username)) AS members, project_id FROM registration JOIN user_table ON user_table.user_id = registration.user_id GROUP BY project_id) AS usernames ON
projects.project_id = usernames.project_id`;

const getProjectMembersQuery = `SELECT p.project_id, p.name, p.description, p.last_updates, user_info.members FROM project p LEFT JOIN (SELECT json_agg(json_build_object('member_id', user_table.user_id, 'username', username, 'role', role)) AS members, project_id FROM registration JOIN user_table ON user_table.user_id = registration.user_id GROUP BY project_id) AS user_info ON p.project_id = user_info.project_id WHERE p.project_id = $1`;

const getAggAssignmentsQuery = `SELECT json_agg(json_build_object('assignment_id', a.assignment_id,
'user_id', a.user_id, 'type', a.type, 'username', user_data.username)) AS assignments, task FROM assignment a 
LEFT JOIN (SELECT * FROM user_table GROUP BY user_id) AS user_data ON user_data.user_id = a.user_id GROUP BY task`;

const getAggTasksQuery = `SELECT json_agg(json_build_object('task_id', t.task_id, 'name', t.name, 
'description', t.description, 'priority', t.priority, 'status', t.status, 'deadline', t.deadline, 
'assignments', assignment_data.assignments)) AS tasks, list FROM task t LEFT JOIN (${getAggAssignmentsQuery}) 
AS assignment_data ON assignment_data.task = t.task_id GROUP BY list`;

const getAggListsQuery = `SELECT json_agg(json_build_object('list_id', l.list_id, 'title', l.title, 'tasks', tasks_array.tasks)) AS lists, project FROM list l LEFT JOIN (${getAggTasksQuery}) AS tasks_array 
ON tasks_array.list = l.list_id GROUP BY l.project`;

export const getCompleteSingleProjectInfoQuery = `SELECT * FROM (${getProjectMembersQuery}) AS project_data 
LEFT JOIN (${getAggListsQuery}) AS lists_array ON lists_array.project = project_data.project_id`;