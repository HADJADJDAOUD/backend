const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const contentCreation = require("../controllers/contentCreation");
const express = require("express");
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


/// MY PROFILE
router.get("/getMe", authController.protect, userController.getUser);
module.exports = router;
