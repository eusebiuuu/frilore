export const createAssignmentQuery = `INSERT INTO assignment (task, user_id, type) VALUES ($1, $2, $3) RETURNING *`;

export const getAssignmentsQuery = `SELECT * FROM assignment WHERE task = $1`;

export const deleteAssignmentQuery = `DELETE FROM assignment WHERE assignment_id = $1`;