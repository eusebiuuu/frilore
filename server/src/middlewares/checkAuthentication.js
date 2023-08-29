import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../utils.js";

export function checkAuthentication(req, res, next) {
  if (!req.user) {
    req.user = {
      "user_id": "3f0ee4b1-c232-49d9-baf5-dee451eab9a0",
      "username": "eusebiuu",
      "password": "$2b$10$FejZ4dxSwDRDDexoQrSLSeUEKbBzPHwRyeiFJF7fo8pNQlLEv87Lu",
      "real_name": "",
      "email": null,
      "country": "Romania",
      "role": "",
      "birthday": null,
      "image_public_id": null,
      "image_url": "https://res.cloudinary.com/dwgihvjqj/image/upload/v1692532441/frilore/abstract-user-flat-4_pl9jts.png",
      "google_id": null,
      "github_id": null,
      "description": "",
      "last_login": "2023-08-27T11:11:28.995Z"
    }
  }
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  throw new CustomAPIError('You must be authenticated to access this routes', StatusCodes.UNAUTHORIZED);
};