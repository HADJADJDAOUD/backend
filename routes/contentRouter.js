const contentCreation = require("../controllers/contentCreation");
const Statistics=require('../controllers/statisticsController')
const express = require("express");
const router = express.Router();
//  const  =require('../controllers/authController')
const filtreContent=require('../controllers/filterContent');
//// BLOGS,RESOURSES,COURSES,PAGE 
router.get("/blogs", contentCreation.getAllBlogs);
router.post("/createBlogs",contentCreation.createBlog);
router.post("/creatcourses",contentCreation.createCourse);
router.post("/createresourses",contentCreation.createResource);
router.patch("/blogs/addup/:blogID", contentCreation.blogadduprev);
router.patch("/blogs/adddown/:blogID", contentCreation.blogadddownrev);
router.patch("/blogs/removeup/:blogID", contentCreation.blogremuprev);
router.patch("/blogs/removedown/:blogID", contentCreation.blogremdownrev);
router.patch("/blogs/switchup/:blogID", contentCreation.blogswitchuptodown);
router.patch("/blogs/switchdown/:blogID", contentCreation.blogswitchdowntoup);
router.get("/blogs/filtredblogs",filtreContent.getfilteredblogs);
router.get("/blogs/search",filtreContent.getsearchedfiltredblogs);
router.get("/courses",contentCreation.getAllsavedCourses, contentCreation.getAllliveCourses); 
router.patch("/blogs/:blogID", contentCreation.saveblog); 
router.delete("/blogs/:blogID",contentCreation.deleteblog)
router.patch("/blogs/categories/update/:blogID",contentCreation.updatecategorie)
router.patch("/blogs/categories/delete/:blogID",contentCreation.deletecategorie)
// router.get("/blogs/statas",Statistics.calcblogsStats,Statistics.calccourseStats,Statistics.calcresourceStats) 





 
module.exports = router;
