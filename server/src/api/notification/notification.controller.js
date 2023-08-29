import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { getLimit } from "../utils.api.js";

const MAX_NOTIFICATIONS = 30;

const getNotifications = async (req, res) => {
  const userID = req.user.user_id;
  const { limit } = req.query;
  const actualLimit = getLimit(limit, MAX_NOTIFICATIONS);
  const notifications = await pool.query(
    `SELECT * FROM notification WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userID, actualLimit]
  );
  return res.status(StatusCodes.OK).json({
    notifications: notifications.rows,
  });
}

export default {
  getNotifications,
}