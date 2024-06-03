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
    res.stats(200).json(stats.categoriesinfo);
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
    const users = await User.find().sort({ point: 1 });
    let topusers = [];
    for (let i = 0; i < 5; i++) {
      topusers.push(users[i]);
    }
    res.status(200).json({ data: stats.total_points, topusers });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to get statistics ",
    });
  }
});
