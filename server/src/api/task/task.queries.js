export const createTaskQuery = `INSERT INTO task (name, description, status, deadline, priority, list) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

export const getTasksQuery = `SELECT * FROM task WHERE list = $1`;

export const getTaskQuery = `SELECT * FROM task WHERE task_id = $1`;

export const updateTaskQuery = `UPDATE task SET name = $1, description = $2, deadline = $3, list = $4, priority = $5, status = $6 WHERE task_id = $7 RETURNING *`;

export const deleteTaskQuery = `DELETE FROM task WHERE task_id = $1`;