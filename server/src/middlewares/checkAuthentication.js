import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../utils.js";

export function checkAuthentication(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  throw new CustomAPIError('You must be authenticated to access this route', StatusCodes.UNAUTHORIZED);
};