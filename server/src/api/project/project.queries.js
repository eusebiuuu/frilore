export const addProject = 'INSERT INTO project (name, description) VALUES ($1, $2) RETURNING *';

export const getAllJoinedProjects = `SELECT * FROM project WHERE project_id IN (SELECT project_id FROM registration
WHERE user_id = $1)`;

export const getJoinedProjectQuery = `SELECT * FROM (${getAllJoinedProjects}) AS joined_projects WHERE project_id = $2`;

export const getAllProjectsWithAssignedTasksQuery = `SELECT * FROM (SELECT name, project_id, COALESCE(list_data.total_tasks, 0) AS total_tasks FROM project LEFT JOIN (SELECT COALESCE(SUM(task_data.tasks_cnt), 0) AS total_tasks, project FROM list LEFT JOIN (SELECT list, COALESCE(COUNT(task_id), 0) AS tasks_cnt FROM task WHERE task_id IN (SELECT task FROM assignment WHERE user_id = $1) GROUP BY list) AS task_data ON list.list_id = task_data.list GROUP BY list.project) AS list_data ON project.project_id = list_data.project) AS project_data WHERE project_data.project_id IN (SELECT project_id FROM registration WHERE user_id = $1)`;

export const editProjectQuery = `UPDATE project SET name = $1, description = $2 WHERE project_id = $3 RETURNING *`;

export const deleteProjectQuery = 'DELETE FROM project WHERE project_id = $1';

export const getProjectsWithMembersQuery = `SELECT * FROM (${getAllJoinedProjects}) AS projects LEFT JOIN (SELECT json_agg(json_build_object('member_id', user_table.user_id, 'username', username, 'image_url', user_table.image_url)) AS members, project_id FROM registration JOIN user_table ON user_table.user_id = registration.user_id GROUP BY project_id) AS user_info ON projects.project_id = user_info.project_id`;

export const getSingleProjectWithMembersInfoQuery = `SELECT * FROM (SELECT * FROM project WHERE project_id = $1) AS projects LEFT JOIN (SELECT json_agg(json_build_object('member_id', user_table.user_id, 'username', username, 'image_url', user_table.image_url, 'is_leader', r.is_leader, 'role', user_table.role)) AS members, project_id FROM registration r JOIN user_table ON user_table.user_id = r.user_id GROUP BY project_id) AS user_info ON projects.project_id = user_info.project_id`;

const getProjectMembersQuery = `SELECT p.project_id, p.name, p.description, user_info.members FROM project p LEFT JOIN (SELECT json_agg(json_build_object('member_id', user_table.user_id, 'username', username, 'role', role)) AS members, project_id FROM registration JOIN user_table ON user_table.user_id = registration.user_id GROUP BY project_id) AS user_info ON p.project_id = user_info.project_id WHERE p.project_id = $1`;

const getAggAssignmentsQuery = `SELECT json_agg(json_build_object('assignment_id', a.assignment_id, 'user_id', a.user_id, 'type', a.type, 'username', user_data.username)) AS assignments, task FROM assignment a LEFT JOIN (SELECT * FROM user_table GROUP BY user_id) AS user_data ON user_data.user_id = a.user_id GROUP BY task`;

const getAggTasksQuery = `SELECT json_agg(json_build_object('task_id', t.task_id, 'name', t.name, 'description', t.description, 'priority', t.priority, 'status', t.status, 'deadline', t.deadline, 'assignments', COALESCE(assignment_data.assignments, '[]'::json))) AS tasks, list FROM task t LEFT JOIN (${getAggAssignmentsQuery}) AS assignment_data ON assignment_data.task = t.task_id GROUP BY list`;

const getAggListsQuery = `SELECT json_agg(json_build_object('list_id', l.list_id, 'title', l.title, 'tasks', COALESCE(tasks_array.tasks, '[]'::json))) AS lists, project FROM list l LEFT JOIN (${getAggTasksQuery}) AS tasks_array ON tasks_array.list = l.list_id GROUP BY l.project`;

export const getCompleteSingleProjectInfoQuery = `SELECT project_id, name, description, COALESCE(members, '[]'::json) AS members, COALESCE(lists_array.lists, '[]'::json) AS lists FROM (${getProjectMembersQuery}) AS project_data LEFT JOIN (${getAggListsQuery}) AS lists_array ON lists_array.project = project_data.project_id`;