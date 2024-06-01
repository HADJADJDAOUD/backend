const handleFactory = require("./handleFactory");
const asyncCatcher = require("../utils/asyncCatcher");
const User = require("../models/userModule");
exports.getAllUsers = asyncCatcher(async (req, res, next) => {
  const users = await User.find({});
  // Send the users data as a response
  res.status(200).json({
    status: "success",
    dataLength: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = asyncCatcher(async (req, res, next) => {
  const user = req.user;
  // Send the user's name and photo as a response
  res.status(200).json(user);
  console.log("this is the username",user.name);
});

// exports.getAllUsers=handleFactory.getAll(User)

exports.getUserCv = handleFactory.getOne(User);
exports.updateUserInfo=handleFactory.updateOne(User);