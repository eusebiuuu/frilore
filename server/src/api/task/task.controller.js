import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { checkPermissions, deleteAllAssignments, getSingleEntity } from "../utils.api.js";
import { createTaskQuery, deleteTaskQuery, getAssignedTasksQuery, getSingleTaskQuery, updateTaskQuery, updateTasksOrderQuery } from "./task.queries.js";

const getSingleTask = async (req, res) => {
  const userID = req.user.user_id;
  const { id: taskID } = req.params;
  const matchingTask = await getSingleEntity(taskID, 'task', 'task_id');
  const listID = matchingTask.rows[0].list;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, false);
  const task = await pool.query(getSingleTaskQuery, [taskID]);
  return res.status(StatusCodes.OK).json({
    task: task.rows[0],
  });
}

const createTask = async (req, res) => {
  const userID = req.user.user_id;
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
  const userID = req.user.user_id;
  const { id: taskID } = req.params;
  const { listID, name, description, priority, status, deadline } = req.body;
  const task = await getSingleEntity(taskID, 'task', 'task_id');
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
  return res.status(StatusCodes.OK).json({
    task: newTask.rows[0],
  });
}

const getAllAssignedTasks = async (req, res) => {
  const userID = req.user.user_id;
  const tasks = await pool.query(getAssignedTasksQuery, [userID]);
  return res.status(StatusCodes.OK).json({
    tasks: tasks.rows,
  });
}

const editTasksOrder = async (req, res) => {
  const userID = req.user.user_id;
  const { order, projectID } = req.body;
  await checkPermissions(userID, projectID, true);
  const placeholders = order.map((elem, idx) => { 
    return `'${elem}'`;
  }).join(',');
  const currQuery = updateTasksOrderQuery(placeholders);
  const newTasks = await pool.query(currQuery, [order]);
  return res.status(StatusCodes.OK).json({
    tasks: newTasks.rows,
  });
}

const deleteTask = async (req, res) => {
  const userID = req.user.user_id;
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
  editTasksOrder,
  getSingleTask,
}