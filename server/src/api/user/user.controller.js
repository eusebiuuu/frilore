import { StatusCodes } from "http-status-codes";
import pool from "../../services/database.js";
import { deleteUserQuery, getTeammatesQuery, updateUserQuery } from "./user.queries.js";
import { getSingleEntity } from "../utils.api.js";
import cloudinary from 'cloudinary'
import fs from 'fs'
import CustomAPIError from '../../utils.js';

const getSingleUser = async (req, res) => {
  const { id: userID } = req.params;
  const user = await getSingleEntity(userID, 'user_table', 'user_id');
  return res.status(StatusCodes.OK).json({
    user: user.rows[0],
  });
}

const editUser = async (req, res) => {
  const userID = req.user.user_id;
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
  const userID = req.user.user_id;
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

const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomAPIError('No file uploaded', StatusCodes.BAD_REQUEST);
	}
	const curImage = req.files.image;
	if (!curImage.mimetype.startsWith('image')) {
		throw new CustomAPIError('Please upload an image', StatusCodes.BAD_REQUEST);
	}
	const maxSize = 1024 * 1024 * 10;
	if (curImage.size > maxSize) {
		throw new CustomAPIError('Please upload an image smaller than 10MB', StatusCodes.BAD_REQUEST);
	}
	const result = await cloudinary.v2.uploader.upload(
		req.files.image.tempFilePath,
		{
			use_filename: true,
			folder: 'frilore'
		}
	);
	fs.unlinkSync(req.files.image.tempFilePath);
  const userID = req.user.user_id;
	const currUser = await getSingleEntity(userID, 'user_table', 'user_id');
	const publicID = currUser.rows[0].image_public_id;
	if (publicID) {
		await cloudinary.v2.uploader.destroy(publicID, function (err, _) {
			if (err) {
				console.log(err);
			}
		});
	}
	await pool.query(
    `UPDATE user_table SET image_public_id = $1 WHERE user_id = $2`,
    [publicID, userID]
  );
	return res.status(StatusCodes.OK).json({
		image: {
			src: result.secure_url,
			public_id: result.public_id,
		}
	});
};

export default {
  getSingleUser,
  editUser,
  deleteUser,
  getAllTeammates,
  uploadImage,
}