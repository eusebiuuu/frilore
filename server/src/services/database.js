import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config();
const { Pool } = pkg;

export const connectionData = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: 'frilore',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
}

const pool = new Pool(connectionData);

export default pool;