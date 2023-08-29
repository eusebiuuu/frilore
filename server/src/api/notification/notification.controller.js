import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";

const MAX_NOTIFICATIONS = 30;

function getLimit(limit) {
  if (isNaN(limit)) {
    return MAX_NOTIFICATIONS;
  }
  const numLimit = parseInt(limit, 10);
  return Math.min(Math.abs(numLimit), MAX_NOTIFICATIONS);
}

const getNotifications = async (req, res) => {
  const userID = req.user.user_id;
  const { limit } = req.query;
  const actualLimit = getLimit(limit);
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