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