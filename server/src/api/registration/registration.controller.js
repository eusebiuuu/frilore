import { StatusCodes } from "http-status-codes";

const getRegistrations = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get Registration'
  });
}

const createRegistration = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Registration'
  });
}

const editRegistration = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit Registration'
  });
}

const deleteRegistration = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Registration'
  });
}

export default {
  createRegistration,
  editRegistration,
  deleteRegistration,
  getRegistrations
}