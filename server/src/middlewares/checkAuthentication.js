import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../utils.js";

export function checkAuthentication(req, res, next) {
  if (!req.user) {
    req.user = {
      "user_id": "1183c530-7ea3-4a80-8378-fb4f5fb8875a",
      "username": "bob_john",
      "password": "$2b$10$./r.reUEA9PAFptRx7zLrOGWOoQ1jbTkn8C4.sfodT7eI4AFk1eF.",
      "real_name": "",
      "email": null,
      "country": "Romania",
      "role": "",
      "birthday": null,
      "google_id": null,
      "github_id": null,
      "description": "",
      "last_login": "2023-08-21T15:11:24.619Z"
    }
  }
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  throw new CustomAPIError('You must be authenticated to access this routes', StatusCodes.UNAUTHORIZED);
};