// const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const experienceCreation = require("../controllers/experiencesController");
const express = require("express");
const router = express.Router();
/// AUTHENTICATION PART ../../../../../.../

// router.post("/signUp", authController.signUp);
// router.get("/confirm/:token", authController.confirmRegistration);
// router.post("/login", authController.login);
// router.post("/signOut", authController.signOut);
// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/user/update",userController.updateuser)
router.post("/user/addExperience",experienceCreation.createExperince)
router.patch("/user/removeExperience/:expID",experienceCreation.removeExperince)
router.patch("/edutaion/update",userController.updateeducation)
router.patch("/education/delete",userController.deleteeducation)
router.patch("/skills/update",userController.updateskills)
router.patch("/skills/delete",userController.deleteskills)
router.patch("/licenses/update",userController.updateslicences)
router.patch("/licenses/delete",userController.deletelicences)
router.patch("/language/update",userController.updateslanguage)
router.patch("/language/delete",userController.deletelanguage)
//// FIRST PAGE PART CVS
router.get("/", userController.getAllUsers);
router.get("/users/:userID", userController.getUser);
// SEARCH ONE
  

/// MY PROFILE
// router.get("/getMe", authController.protect, userController.getUser);
module.exports = router;
