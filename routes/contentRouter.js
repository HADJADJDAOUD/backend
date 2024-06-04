const contentCreation = require("../controllers/contentCreation");
const express = require("express");
const router = express.Router();
const authControler = require("../controllers/authController");
const statisticsController = require("../controllers/statisticsController");
//// BLOGS,RESOURSES,COURSES,PAGE

router.post("/createBlogs", authControler.protect, contentCreation.createBlog);
router.post(
  "/createResource",
  authControler.protect,
  contentCreation.createResource
);
router.post(
  "/createCourse",
  authControler.protect,
  contentCreation.createCourse
);
router.get("/blogs", contentCreation.getAllBlogs);
router.get("/resources", contentCreation.getAllResources);
router.get("/courses", contentCreation.getAllCourses);
///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
router.patch(
  "/blogs/addup/:blogID",
  authControler.protect,
  contentCreation.adduprev
);
router.patch(
  "/blogs/adddown/:blogID",
  authControler.protect,
  contentCreation.adddownrev
);
router.patch(
  "/blogs/removeup/:blogID",
  authControler.protect,
  contentCreation.remuprev
);
router.patch(
  "/blogs/removedown/:blogID",
  authControler.protect,
  contentCreation.remdownrev
);
router.patch(
  "/blogs/switchup/:blogID",
  authControler.protect,
  contentCreation.switchuptodown
);
router.patch(
  "/blogs/switchdown/:blogID",
  authControler.protect,
  contentCreation.switchdowntoup
);
router.get("/categoriesStatistic", statisticsController.getcatstats);
router.get("/top5Users", statisticsController.gettopusers);
module.exports = router;
