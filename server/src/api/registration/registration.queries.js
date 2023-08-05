export const addRegistration = 'INSERT INTO registration (project_id, user_id) VALUES ($1, $2) RETURNING *';

export const duplicateRegistration = 'SELECT * FROM registration WHERE project_id = $1 AND user_id = $2';

export const getAllRegistrations = 'SELECT * FROM registration WHERE project_id = $1';

export const updateRegistrationQuery = `UPDATE registration SET pending = $1, is_leader = $2
WHERE registration_id = $3 RETURNING *`;

export const deleteRegistrationQuery = 'DELETE FROM registration WHERE registration_id = $1';

export const getSingleRegistration = `SELECT * FROM registration WHERE project_id = $1 AND user_id = $2`;

export const getLeadersQuery = `SELECT * FROM registration WHERE is_leader = true AND project_id = $1`;