import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { checkPermissions, getPage, getSingleEntity } from "../utils.api.js";

const LIMIT = 10, DEFAULT_PAGE = 1;
const getMessagesQuery = `SELECT message_id, chat, content, created_at, author, username, role FROM message m JOIN (SELECT username, role, user_id FROM user_table) AS u ON m.author = u.user_id WHERE chat = $1 ORDER BY created_at DESC LIMIT $2`;

const getMessages = async (req, res) => {
  const userID = req.user.user_id;
  const { id: chatID } = req.params;
  const { page } = req.query;
  const actualPage = getPage(page, DEFAULT_PAGE);
  const project = await getSingleEntity(chatID, 'project', 'chat_id');
  const projectID = project.rows[0].project_id;
  await checkPermissions(userID, projectID, false);
  const messages = await pool.query(
    getMessagesQuery,
    [chatID, actualPage * LIMIT]
  );
  return res.status(StatusCodes.OK).json({
    messages: messages.rows,
  });
}

export default {
  getMessages
}