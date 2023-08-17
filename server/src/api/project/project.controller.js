import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addProject, createOwnRegistration, deleteAllRegistrationsExceptAuthorQuery, deleteProjectQuery, editProjectQuery, getAllJoinedProjects, getCompleteSingleProjectInfoQuery, getProjectsWithMembersQuery } from "./project.queries.js";
import { checkPermissions, getSingleEntity } from "../utils.api.js";

const getAllProjects = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const allProjects = await pool.query(getAllJoinedProjects, [userID]);
  return res.status(StatusCodes.OK).json({
    projects: allProjects.rows,
  });
}

const getProjectsWithMembers = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const projectsWithMembers = await pool.query(getProjectsWithMembersQuery, [userID]);
  return res.status(StatusCodes.OK).json({
    projects: projectsWithMembers.rows,
  });
}

const getSingleProjectInfo = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: projectID } = req.params;
  await checkPermissions(userID, projectID, false);
  const project = await pool.query(getCompleteSingleProjectInfoQuery, [projectID]);
  return res.status(StatusCodes.OK).json({
    project: project.rows[0],
  });
}

const createProject = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { title: name, description } = req.body;
  const createdProject = await pool.query(addProject, [name, description, []]);
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
  await checkPermissions(userID, projectID, true);
  const singleProject = await getSingleEntity(projectID, 'project', 'project_id');
  const newName = name ?? singleProject.name;
  const newDescription = description ?? singleProject.description;
  const newlyUpdatedProject = await pool.query(editProjectQuery, [newName, newDescription, projectID]);
  await pool.query(deleteAllRegistrationsExceptAuthorQuery, [projectID, userID]);
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
  getAllProjects,
  getProjectsWithMembers,
  getSingleProjectInfo,
}