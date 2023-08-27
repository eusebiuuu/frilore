export const checkUsernameDuplicationQuery = `SELECT * FROM user_table WHERE username = $1`;

export const createUserQuery = `INSERT INTO user_table (username, password) VALUES ($1, $2) RETURNING *`;