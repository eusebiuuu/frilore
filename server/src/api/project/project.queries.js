export const addProject = 'INSERT INTO project (name, description, last_updates) VALUES ($1, $2, $3) RETURNING *';

export const getAllJoinedProjects = `SELECT * FROM project WHERE project_id IN (SELECT project_id FROM registration
WHERE user_id = $1 AND pending = false)`;

export const getSingleProject = `SELECT * FROM (${getAllJoinedProjects}) AS joined_projects WHERE project_id = $2`;

export const createOwnRegistration = `INSERT INTO registration (project_id, user_id, is_leader, pending) VALUES
($1, $2, TRUE, FALSE) RETURNING *`;

export const editProjectQuery = `UPDATE project SET name = $1, description = $2 WHERE project_id = $3 RETURNING *`;

export const deleteProjectQuery = 'DELETE FROM project WHERE project_id = $1';