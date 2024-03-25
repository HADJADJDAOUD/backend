const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");
const contentCreation = require("../controllers/contentCreation");
const express = require("express");
const router = express.Router();

//// BLOGS,RESOURSES,COURSES,PAGE
router.get("/blogs", contentCreation.getAllBlogs);

router.post("/createBlogs", contentCreation.createBlog);
module.exports = router;
