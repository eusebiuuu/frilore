import { checkPermissions, getSingleEntity } from "../api/utils.api.js";
import pool from "../services/database.js";

export function messageNamespaceLogic(io) {
  const messageNamespace = io.of('/');
  
  messageNamespace.on('connection', (socket) => {
    let user = null;
    socket.on('user info', (currUser) => {
      user = currUser;
      console.log(`Current user: ${user.username}`);
    });

    socket.on('join', ({ chatID }) => {
      socket.join(chatID);
    });

    socket.on('leave', ({ chatID }) => {
      socket.leave(chatID);
    });

    socket.on('message', async ({ messageContent, chatID }) => {
      const userID = user.user_id;
      const project = await getSingleEntity(chatID, 'project', 'chat_id');
      const projectID = project.rows[0].project_id;
      await checkPermissions(userID, projectID, false);
      const message = await pool.query(
        `INSERT INTO message (author, chat, content) VALUES ($1, $2, $3) RETURNING *`,
        [userID, chatID, messageContent],
      );
      messageNamespace.in(chatID).emit('message', { ...message.rows[0], role: user.role, username: user.username });
    });
  });
}
