export const checkEmail = 'SELECT email FROM user_table WHERE email = $1';
export const addUser = `INSERT INTO user_table (username, real_name, email, country, role) 
  VALUES ($1, $2, $3, $4, $5) RETURNING *`;