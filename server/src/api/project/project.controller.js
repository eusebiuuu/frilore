import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addProject, createOwnRegistration, deleteProjectQuery, editProjectQuery, getAllJoinedProjects } from "./project.queries.js";
import CustomAPIError from "../../utils.js";
import { checkPermissions } from "../utils.api.js";

const getProjects = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: projectID } = req.params;
  const allProjects = await pool.query(getAllJoinedProjects, [userID]);
  if (projectID === 'all') {
    return res.status(StatusCodes.OK).json({
      projects: allProjects.rows,
    });
  }
  const singleProject = checkPermissions(userID, projectID);
  return res.status(StatusCodes.OK).json({
    project: singleProject.rows[0],
  });
}

const createProject = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { name, description, lastUpdates } = req.body;
  if (!name || !description || !lastUpdates) {
    throw new CustomAPIError('Invalid data provided', StatusCodes.BAD_REQUEST);
  }
  const createdProject = await pool.query(addProject, [name, description, lastUpdates]);
  const ownRegistration = await pool.query(createOwnRegistration, [createdProject.rows[0].project_id, userID]);
  return res.status(StatusCodes.OK).json({
    registration: ownRegistration.rows[0],
    project: createdProject.rows[0],
  });
}

const editProject = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: projectID } = req.params;
  const { name, description } = req.body;
  const singleProject = await checkPermissions(userID, projectID, true);
  const newName = name ?? singleProject.name;
  const newDescription = description ?? singleProject.description;
  const newlyUpdatedProject = await pool.query(editProjectQuery, [newName, newDescription, projectID]);
  return res.status(StatusCodes.OK).json({
    project: newlyUpdatedProject.rows,
  });
}

const deleteProject = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: projectID } = req.params;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteProjectQuery, [projectID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Project deleted successfully'
  });
}

export default {
  createProject,
  editProject,
  deleteProject,
  getProjects
}