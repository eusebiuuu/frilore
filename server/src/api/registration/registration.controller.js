import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addRegistration, deleteRegistrationQuery, duplicateRegistration, getAllRegistrations, getLeadersQuery, getSingleRegistrationQuery, updateRegistrationQuery } from "./registration.queries.js";
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

const getSingleRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { id: projectID } = req.params;
  await checkPermissions(userID, projectID, false);
  const matchingRegistration = await pool.query(getSingleRegistrationQuery, [projectID, userID]);
  return res.status(StatusCodes.OK).json({
    registration: matchingRegistration.rows[0],
  });
}

const createRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { candidateID, projectID } = req.body;
  await checkPermissions(userID, projectID, true);
  const existingRegistration = await pool.query(duplicateRegistration, [projectID, candidateID]);
  if (existingRegistration.rows.length > 0) {
    throw new CustomAPIError('You already have the user in the project', StatusCodes.BAD_REQUEST);
  }
  const registration = await pool.query(addRegistration, [projectID, candidateID]);
  return res.status(StatusCodes.OK).json({
    registration: registration.rows[0],
  });
}

const editRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { id: registrationID } = req.params;
  const { is_leader } = req.body;
  const matchingRegistration = await getSingleEntity(registrationID, 'registration', 'registration_id');
  const { initialLeaderState, project_id: projectID } = matchingRegistration.rows[0];
  await checkPermissions(userID, projectID, true);
  const leaders = await pool.query(getLeadersQuery, [projectID]);
  if (leaders.rowCount === 1 && initialLeaderState && !is_leader) {
    throw new CustomAPIError('Each project must have at least one leader', StatusCodes.FORBIDDEN);
  }
  const newRegistration = await pool.query(updateRegistrationQuery, [is_leader, registrationID]);
  return res.status(StatusCodes.OK).json({
    registration: newRegistration.rows,
  });
}

const deleteRegistration = async (req, res) => {
  const userID = req.user.user_id;
  const { id: registrationID } = req.params;
  const matchingRegistration = await getSingleEntity(registrationID, 'registration', 'registration_id');
  const isOwnRegistration = matchingRegistration.rows[0].user_id === userID;
  const projectID = matchingRegistration.rows[0].project_id;
  await checkPermissions(userID, projectID, !isOwnRegistration);
  const leaders = await pool.query(getLeadersQuery, [projectID]);
  if (leaders.rowCount === 1 && matchingRegistration.rows[0].is_leader) {
    throw new CustomAPIError('Each project must have at least one leader', StatusCodes.FORBIDDEN);
  }
  await pool.query(deleteRegistrationQuery, [registrationID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Registration deleted successfully'
  });
}

export default {
  createRegistration,
  editRegistration,
  deleteRegistration,
  getRegistrations,
  getSingleRegistration,
}