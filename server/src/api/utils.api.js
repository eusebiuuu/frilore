import { StatusCodes } from "http-status-codes";
import pool from "../services/database.js";
import CustomAPIError from "../utils.js";
import { getSingleProject } from "./project/project.queries.js";
import { getSingleRegistration } from "./registration/registration.queries.js";

export const checkPermissions = async (userID, projectID, mustBeLeader) => {
  const singleProject = await pool.query(getSingleProject, [userID, projectID]);
  if (singleProject.rowCount !== 1) {
    throw new CustomAPIError('Project not found in your projects list', StatusCodes.BAD_REQUEST);
  }
  if (mustBeLeader) {
    const registration = await pool.query(getSingleRegistration, [projectID, userID]);
    if (!registration.rows[0].is_leader) {
      throw new CustomAPIError(
        'Permission denied. You have to be one of the project leaders to do this operation',
        StatusCodes.FORBIDDEN
      );
    }
  }
  return singleProject.rows[0];
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