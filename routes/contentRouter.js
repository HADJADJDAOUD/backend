
const contentCreation = require("../controllers/contentCreation");
const express = require("express");
const router = express.Router();
 const authControler=require('../../userAuth/controllers/authController')

//// BLOGS,RESOURSES,COURSES,PAGE
router.get("/blogs", contentCreation.getAllBlogs);

router.post("/createBlogs",authControler.protect, contentCreation.createBlog);
router.patch("/blogs/addup/:blogID",authControler.protect,contentCreation.adduprev);
router.patch("/blogs/adddown/:blogID",authControler.protect,contentCreation.adddownrev);
router.patch("/blogs/removeup/:blogID",authControler.protect,contentCreation.remuprev);
router.patch("/blogs/removedown/:blogID",authControler.protect,contentCreation.remdownrev);
router.patch("/blogs/switchup/:blogID",authControler.protect,contentCreation.switchuptodown);
router.patch("/blogs/switchdown/:blogID",authControler.protect,contentCreation.switchdowntoup);
module.exports = router;
