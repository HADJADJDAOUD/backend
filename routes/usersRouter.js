const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const express = require("express");
const router = express.Router();

router.get("/", userController.getUsers);
router.post("/signUp", authController.signUp);
router.get("/confirm/:token", authController.confirmRegistration);
router.post("/login", authController.login);
router.post("/signOut", authController.signOut);
router.post("/forgotPassword", authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
