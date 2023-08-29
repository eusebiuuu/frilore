import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { checkPermissions, getPage, getSingleEntity } from "../utils.api.js";

const LIMIT = 10, DEFAULT_PAGE = 1;

const getMessages = async (req, res) => {
  const userID = req.user.user_id;
  const { id: chatID } = req.params;
  const { page } = req.query;
  const actualPage = getPage(page, DEFAULT_PAGE);
  const project = await getSingleEntity(chatID, 'project', 'chat_id');
  const projectID = project.rows[0].project_id;
  await checkPermissions(userID, projectID, false);
  const messages = await pool.query(
    `SELECT * FROM message WHERE chat = $1 ORDER BY created_at DESC LIMIT $2`,
    [chatID, actualPage * LIMIT],
  );
  return res.status(StatusCodes.OK).json({
    messages: messages.rows,
  });
}

export default {
  getMessages
}