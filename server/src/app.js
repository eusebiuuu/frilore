import dotenv from 'dotenv'
dotenv.config();
import 'express-async-errors'
import express from 'express'
import version1Router from './versions/api-v1.js';
import morgan from 'morgan'
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import { notFoundMiddleware } from './middlewares/notFound.js';
import { errorHandlerMiddleware } from './middlewares/error.js';
import passport from "passport";
import authStrategies from './authStrategies.js';
import session from 'express-session';
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'
import store from 'connect-pg-simple'
import { connectionData } from './services/database.js';

const app = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PgStore = store(session);

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  key: 'express.sid',
  resave: true,
  saveUninitialized: true,
  // store: new PgStore({
  //   ...connectionData,
  //   database: 'cookies_store'
  // }),
  cookie: {
    secure: false,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
})

app.set('trust proxy', 1);
app.use(cors({
  origin: ['http://localhost:5173']
}));
app.use(RateLimit({
  windowMs: 100 * 60 * 15,
  max: 1000,
  standardHeaders: true,
  message: `<h1 style='display:flex; align-items:center; justify-content:center; height:100vh'>
    429 - Too many Requests <br> Try again later!
  </h1>`,
}));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(morgan('common'));
app.use('/api/v1', version1Router);
app.use('/', (_, res) => res.send('<h1>Home page</h1>'));
authStrategies();
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;