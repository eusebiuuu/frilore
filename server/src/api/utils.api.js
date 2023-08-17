import { StatusCodes } from "http-status-codes";
import pool from "../services/database.js";
import CustomAPIError from "../utils.js";
import { getJoinedProjectQuery } from "./project/project.queries.js";
import { getSingleRegistrationQuery } from "./registration/registration.queries.js";
import { deleteAllAssignmentsQuery } from "./assignment/assignment.queries.js";

export const checkPermissions = async (userID, projectID, mustBeLeader) => {
  const singleProject = await pool.query(getJoinedProjectQuery, [userID, projectID]);
  if (singleProject.rowCount !== 1) {
    throw new CustomAPIError('Project not found in your projects list', StatusCodes.BAD_REQUEST);
  }
  if (mustBeLeader) {
    const registration = await pool.query(getSingleRegistrationQuery, [projectID, userID]);
    if (!registration.rows[0].is_leader) {
      throw new CustomAPIError(
        'Permission denied. You have to be one of the project leaders to do this operation',
        StatusCodes.FORBIDDEN
      );
    }
  }
}

export const getSingleEntity = async (entityID, entityTableName, entityIDName) => {
  const matchingEntity = await pool.query(
    `SELECT * FROM ${entityTableName} WHERE ${entityIDName} = $1`,
    [entityID]
  );
  if (matchingEntity.rowCount !== 1) {
    throw new CustomAPIError(`${entityTableName} not found`, StatusCodes.BAD_REQUEST);
  }
  return matchingEntity;
}

export const deleteAllAssignments = async (taskID) => {
  await pool.query(deleteAllAssignmentsQuery, [taskID]);
}