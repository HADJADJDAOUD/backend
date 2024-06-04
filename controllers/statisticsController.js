const asyncCatcher = require("../utils/asyncCatcher");
const { Blog } = require("../models/contentModule");
const { Course } = require("../models/contentModule");
const { Resource } = require("../models/contentModule");
const User = require("../models/userModule");
const bodyParser = require("body-parser");
const { Int32 } = require("mongodb");
const { Statistics } = require("../models/StatisticsModule");

exports.getcatstats = asyncCatcher(async (req, res, next) => {
  try {
    const stats = await Statistics.findOne();
    res.status(200).json(stats.categoriesinfo);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});
exports.getmostcatstats = asyncCatcher(async (req, res, next) => {
  try {
    const stats = await Statistics.findOne();
    res.stats(200).json(stats.mostsearchedcat);
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});

exports.gettopusers = asyncCatcher(async (req, res, next) => {
  try {
    const stats = await Statistics.findOne();
    const users = await User.find().sort({ points: -1 });
    console.log("this is users", users);
    let topusers = [];
    for (let i = 0; i < users.length; i++) {
      topusers.push(users[i]);
    }
    console.log("this is topusers", topusers);
    res.status(200).json({
      data: stats.total_points,
      dataLength: topusers.length,
      topusers,
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});
exports.getpostsnum = asyncCatcher(async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    const courses = await Course.find();
    const resourses = await Resource.find();
    res.json({
      blognum: blogs.length,
      coursenum: courses.length,
      resoursenum: resourses.length,
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});
exports.getsavessnum = asyncCatcher(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const blogs = await Blog.find({ user_id: req.user.id });
    const courses = await Course.find({ user_id: req.user.id });
    const resourses = await Resource.find({ user_id: req.user.id });
    function calculateUpSum(blogs) {
      let sum = 0;
      for (let i = 0; i < blogs.length; i++) {
        sum += blogs[i].up;
      }
      return sum;
    }
    function calculateUpSum(blogs) {
      let sum = 0;
      for (let i = 0; i < blogs.length; i++) {
        sum += blogs[i].down;
      }
      return sum;
    }

    // Calculate the sum of "up" field
    const blogUpSum = calculateUpSum(blogs);
    const blogdownSum = calculatedownSum(blogs);
    res.json({
      saves: blogs.saves + courses.saves + resourses.saves,
      up: blogUpSum,
      down: blogdownSum,
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});
