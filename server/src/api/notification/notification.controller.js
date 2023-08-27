import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";

const getNotifications = async (req, res) => {
  const userID = req.user.user_id;
  const notifications = await pool.query(
    `SELECT * FROM notification WHERE user_id = $1 ORDER BY created_at DESC`,
    [userID]
  );
  return res.status(StatusCodes.OK).json({
    notifications: notifications.rows,
  });
}

export default {
  getNotifications,
}