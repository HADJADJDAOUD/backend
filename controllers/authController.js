const crypto = require("crypto");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("../models/userModule");
const AppError = require("../utils/appError");
const asyncCatcher = require("../utils/asyncCatcher");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };
  cookieOptions.secure = true;
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  console.log("cookies are stored");
  // Remove password from output
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = asyncCatcher(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Generate confirmation token
  const confirmationToken = jwt.sign(
    { email: newUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // Send confirmation email
  console.log("it here sendi the email");
  const confirmationLink = `${req.protocol}://${req.get(
    "host"
  )}/api/users/confirm/${confirmationToken}`;
  const message = `Please use this link to confirm your registration: ${confirmationLink}`;

  await sendEmail({
    email: newUser.email,
    subject: "Confirmation Email",
    message,
  });
  console.log("email is sent");
  // Send token back to the client
  createSendToken(newUser, 200, res);
});
const determineUserRole = (email) => {
  // Find the last occurrence of "@" in the email address
  const lastIndex = email.lastIndexOf("@");
  console.log("the last index is", lastIndex);

  // Extract the domain part starting from the character after the last "@" symbol
  const domain = email.substring(lastIndex + 1);
  console.log(`this is the domain     ${domain} `);

  // Split the domain by "." to get the top-level domain
  const topLevelDomain = domain.split(".").slice(-2).join(".");
  console.log(`this is topleveldomain   ${topLevelDomain}`);

  const specifiedDomains = ["esi-sba.dz", "esi-alg.dz", "med-alg.dz"];

  // Check if the extracted domain is included in the specified domains array
  return specifiedDomains.includes(topLevelDomain) ? "brilliant" : "user";
};

exports.confirmRegistration = asyncCatcher(async (req, res, next) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { verified: true, userType: determineUserRole(decodedToken.email) },
      { new: true } // This option ensures that the updated document is returned
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    console.log(`user type is after the function ${user.userType}`);
    req.user = user;
    //---------------------------------------------
    //---------------------------------------------
    //---------------------------------------------
    // Update user's confirmation status in the database
    // const user = await User.findOneAndUpdate(
    //   { email: decodedToken.email },
    //   { verified: true },

    // );
    // if (!user) {
    //   return next(new AppError("User not found", 404));
    // }
    // const userType = determineUserRole(decodedToken.email);
    // console.log(`user type is after the funciton ${userType}`);

    // req.user = user;

    // console.log(`this is req.user.userType${req.user.userType}`);

    // // Add user role to req object for subsequent middleware to use
    // req.user.userType = userType;
    // console.log(`this is req.user.userType${req.user.userType}`);
    // await user.save();
    //---------------------------------------------//---------------------------------------------
    //---------------------------------------------//---------------------------------------------
    //---------------------------------------------//---------------------------------------------
    res.redirect("http://localhost:3000/confirmation-succes"); // Redirect to login page after confirmation
  } catch (err) {
    // Handle invalid or expired token
    return next(new AppError("Invalid or expired token", 400));
  }
});

exports.login = asyncCatcher(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = asyncCatcher(async (req, res, next) => {
  ///GET THE TOKEN AND CHECK IF IT'S EXICT
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("the token is from req.headers.auth");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log(`this token is from the cookies ${token}`);
  }

  if (!token) {
    return next(new AppError("you are unlogged pelase login to get that", 401));
  }

  /// VERIFICATION THE TOKEN IF IT'S VALID
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decode);

  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token has no longer exist.", 401)
    );
  }
  //CHECK IF THE USER DIDN'T CHANGE HIS PASSWORD
  console.log("this is the time of the decoding", decode.iat);
  if (currentUser.passwordChangedAfter(decode.iat)) {
    return next(new AppError("please relogin the password changed", 401));
  }

  req.user = currentUser;
  next();
});

exports.signOut = asyncCatcher(async (req, res, next) => {
  // Clear the JWT cookie
  res.clearCookie("jwt");

  // Send a success response
  res.status(200).json({ status: "success" });
});

exports.forgotPassword = asyncCatcher(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log("suuuuuuuuuuuuuuuuuuuuuuuuuuui  ");
  if (!user) {
    return next(new AppError("there is no user with this email", 404));
  }
  // generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log("wait for saving ");
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  console.log("befor reset url");
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;
  console.log("after it");
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf
     you didn't forget your password, please ignore this email!`;
  console.log("before sending eamil");
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    console.log("email sent");
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("there was an error sending the mail", 500));
  }
});

exports.resetPassword = asyncCatcher(async (req, res, next) => {
  //1 get user based on the token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  ///2 if token has not expired, and there is user , set the new password
  if (!user) {
    return next(new AppError("token is ivailed or expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  ///3 update changedpasswordAt property for the user

  ///4 log the user in , send jwt
  createSendToken(user, 200, res);
});
