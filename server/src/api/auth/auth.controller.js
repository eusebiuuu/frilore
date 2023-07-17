import { StatusCodes } from "http-status-codes";

const getAuths = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Auth'
  });
}

const createAuth = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Auth'
  });
}

const editAuth = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit Auth'
  });
}

const deleteAuth = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Auth'
  });
}

export default {
  createAuth,
  editAuth,
  deleteAuth,
  getAuths
}