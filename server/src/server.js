import http from 'http'
import dotenv from 'dotenv'
dotenv.config();
import app from './app.js'

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  try {
    server.listen(PORT, () => {
      console.log(`The server is listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();