import { StatusCodes } from "http-status-codes";
import { checkPermissions, getSingleEntity } from "../utils.api.js";
import pool from "../../services/database.js";
import { createListQuery, deleteAllTasksQuery, deleteListQuery, getAllListsQuery, getSingleListQuery } from "./list.queries.js";

const getLists = async (req, res) => {
  const userID = req.user.user_id;
  const { projectID } = req.body;
  await checkPermissions(userID, projectID, false);
  const matchingLists = await pool.query(getAllListsQuery, [projectID]);
  return res.status(StatusCodes.OK).json({
    lists: matchingLists.rows
  });
}

const createList = async (req, res) => {
  const userID = req.user.user_id;
  const { title, projectID } = req.body;
  await checkPermissions(userID, projectID, true);
  const newList = await pool.query(createListQuery, [title, projectID]);
  return res.status(StatusCodes.OK).json({
    list: newList.rows[0],
  });
}

const deleteAllTasks = async (req, res) => {
  const userID = req.user.user_id;
  const { list: listID, project: projectID } = req.params;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteAllTasksQuery, [listID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Tasks deleted successfully'
  });
}

const deleteList = async (req, res) => {
  const userID = req.user.user_id;
  const { id: listID } = req.params;
  const matchingList = await getSingleEntity(listID, 'list', 'list_id');
  const projectID = matchingList.rows[0].project;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteListQuery, [listID]);
  return res.status(StatusCodes.OK).json({
    msg: 'List deleted successfully'
  });
}

export default {
  createList,
  deleteList,
  getLists,
  deleteAllTasks,
}