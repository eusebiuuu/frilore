import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { checkPermissions, getSingleEntity } from "../utils.api.js";

const LIMIT = 10;

const getMessages = async (req, res) => {
  const userID = req.user.user_id;
  const { id: chatID } = req.params;
  const { page } = req.query;
  const project = await getSingleEntity(chatID, 'project', 'chat_id');
  const projectID = project.rows[0].project_id;
  await checkPermissions(userID, projectID, false);
  const messages = await pool.query(
    `SELECT * FROM message WHERE chat = $1`,
    [chatID],
  );
  return res.status(StatusCodes.OK).json({
    messages: messages.rows,
  });
}

export default {
  getMessages
}