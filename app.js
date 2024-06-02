const morgan = require("morgan");

const userRouter = require("./routes/usersRouter");
const contentRouter = require("./routes/contentRouter");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const globalErrorHandler = require("./controllers/errController");

const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
  })
);

// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from the same API
const limiter = rateLimit({
  max: 1010,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "ratingsAverage",
      "ratingQuantity",
      "difficulty",
      "maxGroupSize",
    ],
  })
);

// Set view engine and views directory

// Serving static files
//app.use(express.static(path.join(__dirname, "public")));

// Middleware for test
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// Routes

app.use("/api/content", contentRouter);
app.use("/api/users", userRouter);
// Error handling for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Content Security Policy Middleware

module.exports = app;
