export const updateUserQuery = `UPDATE user_table SET username = $1, real_name = $2, role = $3, country = $4, birthday = $5 WHERE user_id = $6 RETURNING *`;

export const deleteUserQuery = `DELETE FROM user_table WHERE user_id = $1`;

const getProjectIDs = `SELECT project_id FROM registration WHERE user_id = $1`;

export const getTeammatesQuery = `SELECT * FROM ((SELECT DISTINCT user_id FROM registration WHERE project_id IN (${getProjectIDs}) AND user_id != $1 AND pending = FALSE) AS user_ids LEFT JOIN user_table ON 
user_ids.user_id = user_table.user_id) LIMIT $2`;