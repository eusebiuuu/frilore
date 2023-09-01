import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addRegistration, deleteRegistrationQuery, getAllRegistrations, getLeadersQuery, getSingleRegistrationQuery, updateRegistrationQuery } from "./registration.queries.js";
import CustomAPIError from "../../utils.js";
import { checkPermissions, getSingleEntity } from "../utils.api.js";

const getRegistrations = async (req, res) => {
  const userID = req.user.user_id;
  const { projectID } = req.body;
  await checkPermissions(userID, projectID, false);
  const allRegistrations = await pool.query(getAllRegistrations, [projectID]);
  return res.status(StatusCodes.OK).json({
    registrations: allRegistrations.rows,
  });
}

const createRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { candidateID, projectID, is_leader } = req.body;
  const leaders = await pool.query(getLeadersQuery, [projectID]);
  if (leaders.rowCount > 0) {
    await checkPermissions(userID, projectID, true);
  }
  const existingRegistration = await pool.query(getSingleRegistrationQuery, [projectID, candidateID]);
  if (existingRegistration.rows.length > 0) {
    const currUser = await getSingleEntity(candidateID, 'user_table', 'user_id');
    throw new CustomAPIError(
      `You already have the user ${currUser.rows[0].username} in the project`,
      StatusCodes.BAD_REQUEST
    );
  }
  const registration = await pool.query(addRegistration, [projectID, candidateID, Boolean(is_leader)]);
  return res.status(StatusCodes.OK).json({
    registration: registration.rows[0],
  });
}

const editRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { is_leader, registeredUserID, projectID } = req.body;
  const matchingRegistration = await pool.query(getSingleRegistrationQuery, [projectID, registeredUserID]);
  const { initialLeaderState } = matchingRegistration.rows[0];
  await checkPermissions(userID, projectID, true);
  const leaders = await pool.query(getLeadersQuery, [projectID]);
  if (leaders.rowCount === 1 && initialLeaderState && !is_leader) {
    throw new CustomAPIError('Each project must have at least one leader', StatusCodes.FORBIDDEN);
  }
  const newRegistration = await pool.query(updateRegistrationQuery, [is_leader, registeredUserID, projectID]);
  return res.status(StatusCodes.OK).json({
    registration: newRegistration.rows,
  });
}

const deleteRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { projectID, deleteUserID } = req.params;
  const matchingRegistration = await pool.query(getSingleRegistrationQuery, [projectID, deleteUserID]);
  const isOwnRegistration = matchingRegistration.rows[0].user_id === userID;
  await checkPermissions(userID, projectID, !isOwnRegistration);
  const leaders = await pool.query(getLeadersQuery, [projectID]);
  if (leaders.rowCount === 1 && matchingRegistration.rows[0].is_leader) {
    throw new CustomAPIError('Each project must have at least one leader', StatusCodes.FORBIDDEN);
  }
  await pool.query(deleteRegistrationQuery, [projectID, deleteUserID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Registration deleted successfully'
  });
}

export default {
  createRegistration,
  editRegistration,
  deleteRegistration,
  getRegistrations,
}