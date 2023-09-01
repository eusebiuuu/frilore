import passport from "passport";
import { getSingleEntity } from "./api/utils.api.js";
import { Strategy as GitHubStrategy } from 'passport-github'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import CustomAPIError from "./utils.js";
import { StatusCodes } from "http-status-codes";
import pool from "./services/database.js";
import bcrypt from 'bcrypt';
import { checkUsernameDuplicationQuery } from "./api/auth/auth.queries.js";

export default function authStrategies() {
  passport.use(new LocalStrategy(async (username, password, done) => {
    const existingUser = await pool.query(
      checkUsernameDuplicationQuery,
      [username]
    );
    if (existingUser.rowCount === 0) {
      return done(new CustomAPIError('Incorrect username', StatusCodes.BAD_REQUEST), null);
    }
    if (!bcrypt.compareSync(password, existingUser.rows[0].password)) {
      return done(new CustomAPIError(
        'Incorrect password', StatusCodes.BAD_REQUEST
      ), null);
    }
    return done(null, existingUser.rows[0]);
  }));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.ORIGIN}/api/v1/auth/google/callback`,
    scope: ['email', 'profile'],
  }, async function(accessToken, refreshToken, profile, done) {
    const userEmail = profile._json.email;
    const existsUser = await pool.query(
      `SELECT * FROM user_table WHERE google_id = $1`,
      [profile.id]
    );
    if (existsUser.rowCount > 0) {
      const newUser = await pool.query(
        `UPDATE user_table SET last_login = $1 WHERE google_id = $2 RETURNING *`,
        [new Date(), existsUser.rows[0].google_id]
      );
      return done(null, newUser.rows[0]);
    }
    const newUser = await pool.query(
      `INSERT INTO user_table (username, email, google_id) VALUES ($1, $1, $2) RETURNING *`,
      [userEmail, profile.id]
    );
    done(null, newUser.rows[0]);
  }));
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.ORIGIN}/api/v1/auth/github/callback`,
  }, async function (accessToken, refreshToken, profile, done) {
    const existsUser = await pool.query(
      `SELECT * FROM user_table WHERE github_id = $1`,
      [profile.id]
    );
    if (existsUser.rowCount > 0) {
      const newUser = await pool.query(
        `UPDATE user_table SET last_login = $1 WHERE gihub_id = $2 RETURNING *`,
        [new Date(), existsUser.rows[0].github_id]
      );
      return done(null, newUser.rows[0]);
    }
    const newUser = await pool.query(
      `INSERT INTO user_table (username, github_id) VALUES ($1, $2) RETURNING *`,
      [profile.username, profile.id]
    );
    done(null, newUser.rows[0]);
  }));

  passport.serializeUser((userInfo, done) => {
    done(null, userInfo.user_id);
  });

  passport.deserializeUser(async (userID, done) => {
    const currUser = await getSingleEntity(userID, 'user_table', 'user_id');
    done(null, currUser.rows[0]);
  });
}