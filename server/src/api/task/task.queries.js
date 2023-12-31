export const createTaskQuery = `INSERT INTO task (name, description, status, deadline, priority, list) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

export const getAssignedTasksQuery = `SELECT * FROM (SELECT * FROM task WHERE task_id IN (SELECT task FROM assignment WHERE user_id = $1)) AS t LEFT JOIN (SELECT json_agg(json_build_object('assignment_id', a.assignment_id, 'user_id', a.user_id, 'type', a.type, 'username', user_data.username, 'image_url', user_data.image_url)) AS assignments, task FROM assignment a LEFT JOIN (SELECT * FROM user_table GROUP BY user_id) AS user_data ON user_data.user_id = a.user_id GROUP BY task) AS assignment_data ON assignment_data.task = t.task_id ORDER BY created_at`;

export const getTaskQuery = `SELECT * FROM task WHERE task_id = $1`;

export const updateTaskQuery = `UPDATE task SET name = $1, description = $2, deadline = $3, list = $4, priority = $5, status = $6 WHERE task_id = $7 RETURNING *`;

export const deleteTaskQuery = `DELETE FROM task WHERE task_id = $1`;

export const updateTasksOrderQuery = (placeholders) => {
  return `UPDATE task SET order_num = array_search(task_id, $1) WHERE task_id = ANY (ARRAY [${placeholders}]::uuid[]) RETURNING *`
}

export const getSingleTaskQuery = `SELECT COALESCE(assignment_data.assignments, '[]'::json) AS assignments, created_at, deadline, description, list, name, order_num, priority, status, t.task_id FROM (SELECT * FROM task WHERE task_id = $1) AS t LEFT JOIN (SELECT json_agg(json_build_object('assignment_id', a.assignment_id, 'user_id', a.user_id, 'type', a.type, 'username', user_data.username, 'image_url', user_data.image_url)) AS assignments, task FROM assignment a LEFT JOIN (SELECT * FROM user_table GROUP BY user_id) AS user_data ON user_data.user_id = a.user_id GROUP BY task) AS assignment_data ON assignment_data.task = t.task_id`