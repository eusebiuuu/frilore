import pool from "../services/database.js";

export function notificationNamespaceLogic(io) {
  const notificationNamespace = io.of('/notification');

  async function createNotification(content, userID) {
    const notification = await pool.query(
      `INSERT INTO notification (user_id, content) VALUES ($1, $2) RETURNING *`,
      [userID, content]
    );
    notificationNamespace.in(userID).emit('add-notification', notification.rows[0]);
  }
  
  notificationNamespace.on('connection', socket => {
    console.log(`Current user: ${socket.request.user.username}`);

    socket.on('join', () => {
      socket.join(socket.request.user.user_id);
    });

    socket.on('leave', () => {
      socket.leave(socket.request.user.user_id);
    });

    socket.on('create-assignment', async (taskTitle, projectName, userID) => {
      await createNotification(
        `You have been assigned to task '${taskTitle}' from project '${projectName}'`,
        userID,
      );
    });

    socket.on('delete-assignment', async (taskTitle, projectName, userID) => {
      await createNotification(
        `You have been unassigned from task '${taskTitle}' from project '${projectName}'`,
        userID,
      );
    });

    socket.on('update-assignment', async (taskTitle, projectName, userID) => {
      await createNotification(
        `Your assignment to task '${taskTitle}' from project '${projectName}' has been changed`,
        userID,
      );
    });

    socket.on('create-registration', async (projectName, leader, userID) => {
      await createNotification(
        `You ${leader ? 'created' : 'have been added to'} the project '${projectName}'`,
        userID,
      );
    });

    socket.on('update-registration', async (projectName, userID) => {
      await createNotification(
        `Your registration to project '${projectName}' has been changed`,
        userID,
      );
    });

    socket.on('delete-registration', async (projectName, leave, userID) => {
      await createNotification(
        `You ${leave ? 'left' : 'have been removed from'} the project '${projectName}'`,
        userID,
      );
    });

    socket.on('read-notifications', async ({ userID }) => {
      await pool.query(
        `UPDATE notification SET seen = true WHERE user_id = $1`,
        [userID]
      );
      notificationNamespace.in(userID).emit('read-notifications');
    })
  });
}
