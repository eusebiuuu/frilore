import { StatusCodes } from "http-status-codes";

const getNotifications = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Notification'
  });
}

const createNotification = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Notification'
  });
}

const editNotification = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit Notification'
  });
}

const deleteNotification = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Notification'
  });
}

export default {
  createNotification,
  editNotification,
  deleteNotification,
  getNotifications
}