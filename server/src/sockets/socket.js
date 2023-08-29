import passport from 'passport';
import { Server } from 'socket.io';
import CustomAPIError from '../utils.js';
import { StatusCodes } from 'http-status-codes';
import session from 'express-session';
import { messageNamespaceLogic } from './messageNamespace.js';
import { notificationNamespaceLogic } from './notificationNamespaceLogic.js';

export function socketLogic(server) {
  const io = new Server(server, {
    cors: {
      origin: [ 'http://localhost:5173' ]
    }
  });
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

  io.use(wrap(session({
    secret: process.env.SESSION_SECRET,
    key: 'express.sid',
    resave: false,
    saveUninitialized: false,
    // store: new PgStore({
    //   ...connectionData,
    //   database: 'cookies_store'
    // }),
  })));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    socket.request.user = {
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
    };
    if (socket.request.user) {
      next();
    } else {
      next(new CustomAPIError('You must be authenticated to access this route', StatusCodes.UNAUTHORIZED));
    }
  });

  messageNamespaceLogic(io);

  notificationNamespaceLogic(io); 
}