export const getMatchingUserQuery = `SELECT * FROM user_table WHERE user_id = $1`;

export const updateUserQuery = `UPDATE user_table SET username = $1, real_name = $2, role = $3, country = $4, birthday = $5 WHERE user_id = $6 RETURNING *`;

export const deleteUserQuery = `DELETE FROM user_table WHERE user_id = $1`;