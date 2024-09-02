import pkg from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
dotenv.config();
const { Pool } = pkg;

export const connectionData = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  ssl: false,
}

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const pool = new Pool(connectionData);


// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: 'frilore',
//   password: process.env.POSTGRES_PASSWORD,
//   port: process.env.POSTGRES_PORT,
//   ssl: {
//     ca: fs.readFileSync(path.resolve(__dirname, '../../cert/eu-north-1-bundle.pem')),
//   },
// });

export default pool;