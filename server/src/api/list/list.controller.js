import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils.api.js";
import pool from "../../services/database.js";
import { createListQuery, deleteAllTasksQuery, deleteListQuery, getAllListsQuery, getSingleListQuery } from "./list.queries.js";
import CustomAPIError from "../../utils.js";

const getLists = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { projectID } = req.body;
  await checkPermissions(userID, projectID, false);
  const matchingLists = await pool.query(getAllListsQuery, [projectID]);
  return res.status(StatusCodes.OK).json({
    lists: matchingLists.rows
  });
}

const createList = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { title, projectID } = req.body;
  await checkPermissions(userID, projectID, true);
  const newList = await pool.query(createListQuery, [title, projectID]);
  return res.status(StatusCodes.OK).json({
    list: newList.rows[0],
  });
}

const deleteAllTasks = async (req, res) => {
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { projectID } = req.body;
  const { id: listID } = req.params;
  await checkPermissions(userID, projectID, true);
  await pool.query(deleteAllTasksQuery, [listID]);
  return res.status(StatusCodes.OK).json({
    msg: 'Tasks deleted successfully'
  });
}

const deleteList = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const { id: listID } = req.params;
  const matchingList = await pool.query(getSingleListQuery, [listID]);
  if (matchingList.rowCount !== 1) {
    throw new CustomAPIError('List not found', StatusCodes.BAD_REQUEST);
  }
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