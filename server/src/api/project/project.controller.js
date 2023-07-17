import { StatusCodes } from "http-status-codes";

const getProjects = async (req, res) => {
  // take the id from uri and build the logic around its existence
  return res.status(StatusCodes.OK).json({
    data: 'Get projects'
  });
}

const createProject = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create project'
  });
}

const editProject = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit project'
  });
}

const deleteProject = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete project'
  });
}

export default {
  createProject,
  editProject,
  deleteProject,
  getProjects
}