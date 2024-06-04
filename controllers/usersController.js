const handleFactory = require("./handleFactory");
const asyncCatcher = require("../utils/asyncCatcher");
const User = require("../models/userModule");
exports.getAllUsers = asyncCatcher(async (req, res, next) => {
  const users = await User.find({});
  // Send the users data as a response
  res.status(200).json({
    status: "success",
    dataLength: users.length,
    data: users,
  });
});
exports.getUser = asyncCatcher(async (req, res, next) => {
  const user = req.user;
  // Send the user's name and photo as a response
  res.status(200).json(user);
  console.log("this is the username", user.name);
});
exports.updateSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Extract skills array from request body
    const { skills } = req.body;

    // Update user's skills array
    user.skills = skills;

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Skills updated successfully" });
  } catch (error) {
    console.error("Error updating skills:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// exports.getAllUsers=handleFactory.getAll(User)

exports.getUserCv = handleFactory.getOne(User);
exports.updateUserInfo = handleFactory.updateOne(User);
