import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import CustomAPIError from "../../utils.js";
import { checkPermissions, deleteAllAssignments, getSingleEntity } from "../utils.api.js";
import { createTaskQuery, deleteTaskQuery, getAssignedTasksQuery, getTaskQuery, updateTaskQuery } from "./task.queries.js";

const createTask = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { listID, name, description, priority, status, deadline } = req.body;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  const newTask = await pool.query(createTaskQuery, [name, description, status, deadline, priority, listID]);
  await deleteAllAssignments(newTask.rows[0].task_id);
  return res.status(StatusCodes.OK).json({
    task: newTask.rows[0],
  });
}

const editTask = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: taskID } = req.params;
  const { listID, name, description, priority, status, deadline } = req.body;
  const task = await pool.query(getTaskQuery, [taskID]);
  if (task.rowCount !== 1) {
    throw new CustomAPIError('Task not found', StatusCodes.BAD_REQUEST);
  }
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  const newListID = listID ?? task.rows[0].list;
  const newName = name ?? task.rows[0].name;
  const newDescription = description ?? task.rows[0].description;
  const newStatus = status ?? task.rows[0].status;
  const newPriority = priority ?? task.rows[0].priority;
  const newDeadline = deadline ?? task.rows[0].deadline;
  const newTask = await pool.query(
    updateTaskQuery,
    [newName, newDescription, newDeadline, newListID, newPriority, newStatus, taskID]
  );
  await deleteAllAssignments(newTask.rows[0].task_id);
  return res.status(StatusCodes.OK).json({
    task: newTask.rows[0],
  });
}

const getAllAssignedTasks = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const tasks = await pool.query(getAssignedTasksQuery, [userID]);
  return res.status(StatusCodes.OK).json({
    tasks: tasks.rows,
  });
}

const deleteTask = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { id: taskID } = req.params;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteTaskQuery, [taskID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Task deleted successfully'
  });
}

export default {
  createTask,
  editTask,
  deleteTask,
  getAllAssignedTasks,
}