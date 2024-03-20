class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log("suuuuui we are in the err");
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    console.log("err completed");
  }
}

module.exports = AppError;
