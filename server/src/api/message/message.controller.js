import { StatusCodes } from "http-status-codes";

const getMessages = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Message'
  });
}

const createMessage = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Message'
  });
}

const deleteMessage = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Message'
  });
}

export default {
  createMessage,
  deleteMessage,
  getMessages
}