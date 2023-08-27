import { StatusCodes } from "http-status-codes";
import { checkPermissions, getSingleEntity } from "../utils.api.js";
import pool from "../../services/database.js";
import { createAssignmentQuery, deleteSingleAssignmentQuery, editAssignmentQuery, getAssignmentsQuery } from "./assignment.queries.js";

const getAssignments = async (req, res) => {
  const userID = req.user.user_id;
  const { taskID } = req.body;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, false);
  const assignments = await pool.query(getAssignmentsQuery, [taskID]);
  return res.status(StatusCodes.OK).json({
    assignments: assignments.rows,
  });
}

const createAssignment = async (req, res) => {
  const userID = req.user.user_id;
  const { taskID, assignmentType, newUserID } = req.body;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  const newAssignment = await pool.query(createAssignmentQuery, [taskID, newUserID, assignmentType]);
  return res.status(StatusCodes.CREATED).json({
    assignment: newAssignment.rows[0],
  });
}

const editAssignment = async (req, res) => {
  const userID = req.user.user_id;
  const { taskID, assignmentType, currUserID } = req.body;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  const newAssignment = await pool.query(editAssignmentQuery, [assignmentType, taskID, currUserID]);
  return res.status(StatusCodes.CREATED).json({
    assignment: newAssignment.rows[0],
  });
}

const deleteAssignment = async (req, res) => {
  const userID = req.user.user_id;
  const { id: currUserID, task: taskID } = req.params;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteSingleAssignmentQuery, [taskID, currUserID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Assignment deleted successfully',
  });
}

export default {
  createAssignment,
  deleteAssignment,
  getAssignments,
  editAssignment,
}