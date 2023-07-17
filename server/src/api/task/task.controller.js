import { StatusCodes } from "http-status-codes";

const getTasks = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Task'
  });
}

const createTask = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Task'
  });
}

const editTask = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit Task'
  });
}

const deleteTask = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Task'
  });
}

export default {
  createTask,
  editTask,
  deleteTask,
  getTasks
}