import { StatusCodes } from "http-status-codes";

const getLists = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get List'
  });
}

const createList = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create List'
  });
}

const editList = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit List'
  });
}

const deleteList = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete List'
  });
}

export default {
  createList,
  editList,
  deleteList,
  getLists
}