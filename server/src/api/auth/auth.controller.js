import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { checkUsernameDuplicationQuery, createUserQuery } from "./auth.queries.js";
import CustomAPIError from "../../utils.js";
import { getSingleEntity } from "../utils.api.js";
import bcrypt from 'bcrypt';

const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.OK).json({
      msg: 'No user logged in'
    });
  }
  const userID = req.user.user_id;
  const user = await getSingleEntity(userID, 'user_table', 'user_id');
  return res.status(StatusCodes.OK).json({
    user: user.rows[0],
  });
}

const register = async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await pool.query(checkUsernameDuplicationQuery, [username]);
  if (existingUser.rowCount > 0) {
    throw new CustomAPIError('Username already exists. Please choose another one', StatusCodes.BAD_REQUEST);
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  await pool.query(createUserQuery, [username, hashedPassword]);
  next();
}

const logout = async (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}

export default {
  getCurrentUser,
  register,
  logout,
}