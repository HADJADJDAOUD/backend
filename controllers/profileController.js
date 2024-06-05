const handleFactory = require("./handleFactory");
const asyncCatcher = require("../utils/asyncCatcher");
const { Experience } = require("../models/experienceModule");
const User = require("../models/userModule");
exports.createExperince = asyncCatcher(async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body.data);
    experience.user_id = req.user._id;
    const filtre = req.query.filtre ? req.query.filtre.split(",") : [];
    console.log(filtre);
    res.status(201).json({
      status: "success",
      experience: experience,
    });
    const myuser = await User.findOneAndUpdate(
      { _id: experience.user_id },
      { $push: { Experiences: experience._id } }
    );
  } catch (error) {
    console.error("Error adding creating experince:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to creating experince",
    });
  }
});
exports.upadtingExperince = asyncCatcher(async (req, res, next) => {
  try {
    await Experience.findOneAndUpdate(req.params.expID, req.body);
    res.status(201).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error adding updating experience:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update experience",
    });
  }
});
exports.removeExperince = asyncCatcher(async (req, res, next) => {
  try {
    await Experience.findOneAndDelete(req.params.expID);
    res.status(201).json({
      status: "success",
    });
    const myuser = await User.findOneAndUpdate(
      { _id: req.body.user._id },
      { $pull: { Experiences: { $in: [req.params.expID] } } }
    );
  } catch (error) {
    console.error("Error adding deleting experience:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete experience",
    });
  }
});

///////////////////
///////////////////
//////////////////
////////////////////

exports.addExperience = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming you have the user id from authentication middleware
    const { title, companyName, EmploymentType, location, startDate, endDate } =
      req.body;

    const user = await User.findById(userId);

    // Add the new experience
    user.Experience.push({
      title,
      companyName,
      EmploymentType,
      location,
      startDate,
      endDate,
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.removeExperince = asyncCatcher(async (req, res, next) => {
  try {
    await Experience.findOneAndDelete(req.params.expID);
    res.status(201).json({
      status: "success",
    });
    const myuser = await User.findOneAndUpdate(
      { _id: req.body.user._id },
      { $pull: { Experiences: { $in: [req.params.expID] } } }
    );
  } catch (error) {
    console.error("Error adding deleting experience:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete experience",
    });
  }
});

exports.addEducations = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming you have the user id from authentication middleware
    const { school, field, degree, startDate, endDate } = req.body;

    const user = await User.findById(userId);

    // Add the new experience
    user.Education.push({
      endDate,
      startDate,
      degree,
      field,
      school,
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addCertification = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming you have the user id from authentication middleware
    const { name, org, url, startDate } = req.body;

    const user = await User.findById(userId);

    // Add the new experience
    user.Certification.push({
      name,
      org,
      url,
      startDate,
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.addLanguage = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming you have the user id from authentication middleware
    const { language, proficiency } = req.body;

    const user = await User.findById(userId);

    // Add the new experience
    user.Language.push({
      language,
      proficiency,
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
