import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let message = err.message || 'Something went wrong, please try again later';
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    statusCode = 400;
  }
  if (err.name === 'CastError') {
    message = `No item found with id : ${err.value}`;
    statusCode = 404;
  }
  res.status(statusCode).json({
    msg: message,
  });
};

export { errorHandlerMiddleware };

