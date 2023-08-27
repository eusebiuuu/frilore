export const createAssignmentQuery = `INSERT INTO assignment (task, user_id, type) VALUES ($1, $2, $3) RETURNING *`;

export const editAssignmentQuery = `UPDATE assignment SET type = $1 WHERE task = $2 AND user_id = $3`;

export const getAssignmentsQuery = `SELECT * FROM assignment WHERE task = $1`;

export const deleteSingleAssignmentQuery = `DELETE FROM assignment WHERE task = $1 AND user_id = $2`;

export const deleteAllAssignmentsQuery = `DELETE FROM assignment WHERE task = $1`;