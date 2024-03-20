const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const values = Object.values(err.errors)
    .map((el) => el.message)
    .join(".. ");
  const message = `invaild data the reason is !--: ${values} `;

  // console.log(
  //   'this is the start of the error.........-------------',
  //   err.errors,
  // );
  return new AppError(message, 400);
};

const handleJwtError = () => new AppError("invaild token please login", 401);

const handleJwtExpired = () =>
  new AppError("expired token please  login again", 401);
/////////////////////
const sendErrorDev = (err, res) => {
  console.log("we are sending errodev");
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log("it enterd to the errcontroller");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.log("the env id development");
    sendErrorDev(err, res);
    next();
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJwtError();

    if (error.name === "TokenExpiredError") error = handleJwtExpired();

    sendErrorProd(error, res);
  }
};
