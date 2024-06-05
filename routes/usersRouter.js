const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const contentCreation = require("../controllers/contentCreation");
const experienceController = require("../controllers/profileController");
const express = require("express");
const { Experience } = require("../models/experienceModule");
const router = express.Router();
/// AUTHENTICATION PART ../../../../../.../

router.post("/signUp", authController.signUp);
router.get("/confirm/:token", authController.confirmRegistration);
router.post("/login", authController.login);
router.post("/signOut", authController.signOut);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//// FIRST PAGE PART CVS
router.get("/", userController.getAllUsers);
// SEARCH ONE
router.patch(
  "/updateUserInfo",
  authController.protect,
  userController.updateUserInfo
);
router.patch(
  "/updateSkills",
  authController.protect,
  userController.updateUserInfo
);
router.patch(
  "/addExperience",
  authController.protect,
  experienceController.addExperience
);
router.patch(
  "/addEducations",
  authController.protect,
  experienceController.addEducations
);
router.patch(
  "/addCertification",
  authController.protect,
  experienceController.addCertification
);
router.patch(
  "/addLanguage",
  authController.protect,
  experienceController.addLanguage
);
/// MY PROFILE
router.get("/getMe", authController.protect, userController.getUser);
router.get("/allUsers", userController.getAllUsers);
router.delete("/deleteExperience", experienceController.removeExperince);
router.get("/saves", authController.protect, userController.getUsersaves);
router.post(
  "/savecontent",
  authController.protect,
  contentCreation.saveContent
);
router.delete(
  "/deletesavecontent",
  authController.protect,
  contentCreation.deleteSavedContent
);
module.exports = router;
