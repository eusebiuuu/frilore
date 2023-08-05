import { StatusCodes } from "http-status-codes";
import { checkPermissions, getSingleEntity } from "../utils.api.js";
import pool from "../../services/database.js";
import { createAssignmentQuery, deleteAssignmentQuery, getAssignmentsQuery } from "./assignment.queries.js";

const getAssignments = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
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
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { taskID, assignmentType } = req.body;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  const newAssignment = await pool.query(createAssignmentQuery, [taskID, userID, assignmentType]);
  return res.status(StatusCodes.CREATED).json({
    assignment: newAssignment.rows[0],
  });
}

const deleteAssignment = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { id: assignmentID } = req.params;
  const matchingAssignment = await getSingleEntity(assignmentID, 'assignment', 'assignment_id');
  const taskID = matchingAssignment.rows[0].task;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteAssignmentQuery, [assignmentID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Assignment deleted successfully',
  });
}

export default {
  createAssignment,
  deleteAssignment,
  getAssignments
}