import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addRegistration, deleteRegistrationQuery, duplicateRegistration, getAllRegistrations, getLeadersQuery, getSingleRegistrationQuery, updateRegistrationQuery } from "./registration.queries.js";
import CustomAPIError from "../../utils.js";
import { checkPermissions, getSingleEntity } from "../utils.api.js";

const getRegistrations = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { projectID } = req.body;
  await checkPermissions(userID, projectID, false);
  const allRegistrations = await pool.query(getAllRegistrations, [projectID]);
  return res.status(StatusCodes.OK).json({
    registrations: allRegistrations.rows,
  });
}

const getSingleRegistration = async (req, res) => {
  // auth
  // const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: projectID } = req.params;
  await checkPermissions(userID, projectID, false);
  const matchingRegistration = await pool.query(getSingleRegistrationQuery, [projectID, userID]);
  return res.status(StatusCodes.OK).json({
    registration: matchingRegistration.rows[0],
  });
}

const createRegistration = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
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
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  // const userID = '4e0f33ff-c6dc-4027-9dce-23bfe9888edf';
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
  // auth
  // const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
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