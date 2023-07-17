import { StatusCodes } from "http-status-codes";

const getAssignments = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Assignment'
  });
}

const createAssignment = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Assignment'
  });
}

const editAssignment = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit Assignment'
  });
}

const deleteAssignment = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Assignment'
  });
}

export default {
  createAssignment,
  editAssignment,
  deleteAssignment,
  getAssignments
}