export const updateUserQuery = `UPDATE user_table SET username = $1, real_name = $2, role = $3, country = $4, birthday = $5 WHERE user_id = $6 RETURNING *`;

export const deleteUserQuery = `DELETE FROM user_table WHERE user_id = $1`;

export const getTeammatesQuery = `SELECT username, image_url, user_ids.user_id AS user_id FROM ((SELECT DISTINCT user_id FROM registration WHERE project_id IN (SELECT project_id FROM registration WHERE user_id = $1) AND user_id != $1) AS user_ids LEFT JOIN (SELECT * FROM user_table) AS u ON user_ids.user_id = u.user_id) LIMIT $2`;