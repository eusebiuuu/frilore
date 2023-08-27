import http from 'http'
import dotenv from 'dotenv'
dotenv.config();
import app from './app.js'
import { socketLogic } from './sockets/socket.js';

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

socketLogic(server);

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