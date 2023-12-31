export const addRegistration = 'INSERT INTO registration (project_id, user_id, is_leader) VALUES ($1, $2, $3) RETURNING *';

export const getAllRegistrations = 'SELECT * FROM registration WHERE project_id = $1';

export const updateRegistrationQuery = `UPDATE registration SET is_leader = $1 WHERE user_id = $2 AND project_id = $3 RETURNING *`;

export const deleteRegistrationQuery = 'DELETE FROM registration WHERE project_id = $1 AND user_id = $2';

export const getSingleRegistrationQuery = `SELECT * FROM registration WHERE project_id = $1 AND user_id = $2`;

export const getLeadersQuery = `SELECT * FROM registration WHERE is_leader = true AND project_id = $1`;