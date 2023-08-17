import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { deleteUserQuery, getTeammatesQuery, updateUserQuery } from "./user.queries.js";
import { getSingleEntity } from "../utils.api.js";

const getSingleUser = async (req, res) => {
  const { id: userID } = req.params;
  const user = await getSingleEntity(userID, 'user_table', 'user_id');
  return res.status(StatusCodes.OK).json({
    user: user.rows[0],
  });
}

const editUser = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  // const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { username, real_name: realName, country, role, birthday } = req.body;
  const matchingUser = await getSingleEntity(userID, 'user_table', 'user_id');
  const newUsername = username ?? matchingUser.rows[0].username;
  const newRealName = realName ?? matchingUser.rows[0].real_name;
  const newCountry = country ?? matchingUser.rows[0].country;
  const newRole = role ?? matchingUser.rows[0].role;
  const newBirthday = birthday ?? matchingUser.rows[0].birthday;
  const newUser = await pool.query(updateUserQuery, 
    [newUsername, newRealName, newRole, newCountry, newBirthday, userID]
  );
  return res.status(StatusCodes.OK).json({
    user: newUser.rows[0],
  });
}

const deleteUser = async (req, res) => {
  // auth
  const userID = 'f9a55867-06df-4cb6-87c4-d2e7ded74431';
  await getSingleEntity(userID, 'user_table', 'user_id');
  await pool.query(deleteUserQuery, [userID]);
  return res.status(StatusCodes.OK).json({
    msg: 'User deleted successfully'
  });
}

const MAX_TEAMMATES = 9;

const getAllTeammates = async (req, res) => {
  const { id: userID } = req.params;
  const { limit } = req.query;
  const teammates = await pool.query(getTeammatesQuery, [userID, limit || MAX_TEAMMATES]);
  return res.status(StatusCodes.OK).json({
    teammates: teammates.rows
  });
}

export default {
  getSingleUser,
  editUser,
  deleteUser,
  getAllTeammates,
}