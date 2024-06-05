const handleFactory = require("./handleFactory");
const asyncCatcher = require("../utils/asyncCatcher");
const User = require("../models/userModule");
exports.getAllUsers = asyncCatcher(async (req, res, next) => {
  try {
    const { query, categories, minRank, maxRank, minPoints, maxPoints } =
      req.query;

    const filter = {};
    console.log(query, categories, minRank, maxRank, maxPoints, minPoints);
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (categories) {
      filter.skills = { $in: categories.split(",") };
    }

    if (minRank && maxRank) {
      filter.rank = { $gte: parseInt(minRank), $lte: parseInt(maxRank) };
    }

    if (minPoints && maxPoints) {
      filter.points = { $gte: parseInt(minPoints), $lte: parseInt(maxPoints) };
    }

    const users = await User.find(filter);

    res.status(200).json({
      status: "success",
      dataLength: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
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

////////////////////////////////////////////////////////

//////////////////////////////////////////

////////////////////////////
exports.getUsersaves = asyncCatcher(async (req, res, next) => {
  try {
    const user_id = req.user._id;
    console.log("this is in saves and this is user_id", user_id);

    const user = await User.findById(user_id)
      .populate("saves.blogs", "_id title text photo") // Populate blogs array
      .populate("saves.resources", "_id title text photo") // Populate resources array
      .populate("saves.courses", "_id title  text photo"); // Populate courses array

    console.log(user.name);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const saves = user.saves;
    console.log("this is saves", saves);

    // Send the saves object as a response
    res.status(200).json(saves);
  } catch (error) {
    console.error("Error fetching user saves:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user saves",
    });
  }
});
