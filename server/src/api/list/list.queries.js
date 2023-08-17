export const createListQuery = `INSERT INTO list (title, project) VALUES ($1, $2) RETURNING *`;

export const getAllListsQuery = `SELECT * FROM list WHERE project = $1`;

export const getSingleListQuery = `SELECT * FROM list WHERE list_id = $1`;

export const deleteListQuery = `DELETE FROM list WHERE list_id = $1`;

export const deleteAllTasksQuery = `DELETE FROM task WHERE list = $1`;