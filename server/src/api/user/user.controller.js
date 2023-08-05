import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { deleteUserQuery, getMatchingUserQuery, updateUserQuery } from "./user.queries.js";
import CustomAPIError from "../../utils.js";

const editUser = async (req, res) => {
  // auth
  const userID = '52e689e2-7936-4a3f-a659-dd2c295a4889';
  const { username, realName, country, role, birthday } = req.body;
  const { rows: matchingUser } = await pool.query(getMatchingUserQuery, [userID]);
  if (matchingUser.length !== 1) {
    throw new CustomAPIError('User not found', StatusCodes.BAD_REQUEST);
  }
  const newUsername = username ?? matchingUser[0].username;
  const newRealName = realName ?? matchingUser[0].real_name;
  const newCountry = country ?? matchingUser[0].country;
  const newRole = role ?? matchingUser[0].role;
  const newBirthday = birthday ?? matchingUser[0].birthday;
  const newUser = await pool.query(updateUserQuery, 
    [newUsername, newRealName, newRole, newCountry, newBirthday, userID]
  );
  return res.status(StatusCodes.OK).json({
    user: newUser.rows
  });
}

const deleteUser = async (req, res) => {
  // auth
  const userID = 'f9a55867-06df-4cb6-87c4-d2e7ded74431';
  const { rows: matchingUser } = await pool.query(getMatchingUserQuery, [userID]);
  if (matchingUser.length !== 1) {
    throw new CustomAPIError('User not found', StatusCodes.BAD_REQUEST);
  }
  await pool.query(deleteUserQuery, [userID]);
  return res.status(StatusCodes.OK).json({
    msg: 'User deleted successfully'
  });
}

export default {
  editUser,
  deleteUser,
}