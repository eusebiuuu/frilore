import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { addUser, checkEmail } from "./auth.queries.js";
import CustomAPIError from "../../utils.js";
import { getSingleEntity } from "../utils.api.js";

const getCurrentUser = async (req, res) => {
  // auth
  const userID = '181cc5d2-b164-4e51-a78a-6acd0b2e9af1';
  const user = await getSingleEntity(userID, 'user_table', 'user_id');
  return res.status(StatusCodes.OK).json({
    user: user.rows[0],
  });
}

const isValidEmail = async (req, res) => {
  const { email } = req.body;
  const sameEmail = await pool.query(checkEmail, [email]);
  // console.log(sameEmail.rows);
  if (sameEmail.rows.length > 0) {
    throw new CustomAPIError('Email already exists', StatusCodes.BAD_REQUEST);
  }
  return res.status(StatusCodes.OK).json({
    good: true,
  });
}

const register = async (req, res) => {
  const { role, username, realName, email, country } = req.body;
  const result = await pool.query(addUser, [username, realName, email, country, role]);
  // console.log(result.rows);
  return res.status(StatusCodes.CREATED).json({
    user: result.rows,
  });
}

const login = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create Auth'
  });
}

const logout = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete Auth'
  });
}

export default {
  getCurrentUser,
  register,
  login,
  logout,
  isValidEmail
}