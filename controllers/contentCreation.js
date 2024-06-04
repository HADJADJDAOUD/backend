const asyncCatcher = require("../utils/asyncCatcher");
const { Blog } = require("../models/contentModule");
const { Course } = require("../models/contentModule");
const { Resource } = require("../models/contentModule");
const User = require("../models/userModule");
const bodyParser = require("body-parser");
const { Int32 } = require("mongodb");
const { Statistics } = require("../models/StatisticsModule");
const app = require("express")();
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// exports.getsortedbloges=asyncCatcher(async(req,res,next)=>{
//  const sortedbloges=await Blog.find().sort({points:1});
exports.getAllBlogs = asyncCatcher(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  console.log(`this is the number of pages ${page}`);
  const blogs = await Blog.find().skip(skip).limit(limit);

  const populatedBlogs = await Promise.all(
    blogs.map(async (blog) => {
      // Access user details from the populated user_id fieldx
      await blog.populate("user_id", "name photo");
      return blog;
    })
  );

  res.status(200).json({ "data-size": populatedBlogs.length, populatedBlogs });
});

exports.createBlog = asyncCatcher(async (req, res, next) => {
  try {
    console.log("this is req.body of createblog", req.body);
    const blog = await Blog.create(req.body);
    blog.user_id = req.user._id;
    console.log("the id is:.......................");
    console.log(blog.user_id);
    const user = await User.findOneAndUpdate(
      { _id: blog.user_id },
      { $inc: { points: 30 } }
    );
    let stats = await Statistics.findOne();
    if (!stats) {
      console.log("No statistics document found, creating a new one...");
      stats = await Statistics.create({});
    }

    stats.total_points += 30;

    function updateCategories(array, categoriesToCheck) {
      console.log("entered updating category");
      categoriesToCheck.forEach((category) => {
        console.log("updating category", category);
        const foundObject = array.find((obj) => obj.category === category);
        if (foundObject) {
          console.log("Object found, updating num...");
          foundObject.num += 1;
          console.log("Updated object:", foundObject);
        } else {
          console.log("Category not found, adding new object...");
          const newObject = { category: category, num: 1 };
          array.push(newObject);
          console.log("New object added:", newObject);
        }
      });
    }

    console.log("Updating categories...");
    // Ensure blog.categories is an array before updating categories
    const categoriesToCheck = Array.isArray(blog.categories)
      ? blog.categories
      : [];
    updateCategories(stats.categoriesinfo, categoriesToCheck);

    console.log("Updated stats:", JSON.stringify(stats, null, 2));

    try {
      const saveResult = await stats.save();
      console.log("Statistics updated and saved successfully:", saveResult);
    } catch (error) {
      console.error("Error saving statistics:", error);
    }

    console.log("suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui");
    res.status(201).json({
      status: "success",
      blog: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create blog",
    });
  }
});

exports.adduprev = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    {
      $inc: { up: 1 },
      $push: {
        revusers: req.user._id,
      },
    }
  );
  console.log(blog);
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0.5;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});
exports.adddownrev = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    {
      $inc: { down: 1 },
      $push: {
        revusers: req.user._id,
      },
    }
  );
  console.log(blog);
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0.5;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});
exports.remuprev = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    {
      $inc: { up: -1 },
      $pull: {
        revusers: { $in: [req.user._id] },
      },
    }
  );
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});
exports.remdownrev = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    {
      $inc: { down: -1 },
      $pull: {
        revusers: req.user._id,
      },
    }
  );
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});
exports.switchuptodown = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    { $inc: { down: +1, up: -1 } }
  );
  console.log(blog);
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});
exports.switchdowntoup = asyncCatcher(async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.blogID },
    { $inc: { down: +1, up: -1 } }
  );
  console.log(blog);
  const rev = blog.up - blog.down;
  var plus = 0;
  function addplus() {
    return 0;
  }
  plus = addplus();
  console.log(plus);
  const myuser = await User.findOneAndUpdate(
    { _id: blog.user_id },
    { $inc: { points: plus } }
  );
  console.log("-=-=-=-=-=-=-=" + myuser);
  res.status(200).json({
    status: "success",
    message: "Resource updated successfully",
  });
});

exports.getAllCourses = asyncCatcher(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  const courses = await Course.find().skip(skip).limit(limit);
  const populatedCourses = await Promise.all(
    courses.map(async (course) => {
      await course.populate("user_id", "name photo");
      return course;
    })
  );
  res
    .status(200)
    .json({ "data-size": populatedCourses.length, populatedCourses });
});

// exports.createCourse = asyncCatcher(async (req, res, next) => {
//   req.body.user_id = req.user.id;
//   console.log(req.body.user_id);
//   const course = await Course.create(req.body);

//   await User.findOneAndUpdate(
//     { _id: req.user.id }, // Filter to find the user
//     { $inc: { points: 30 } } // Increment the points field by 30
//   );
//   res.status(201).json({
//     status: "success",
//     data: {
//       course,
//     },
//   });
// });

exports.getAllResources = asyncCatcher(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  const resources = await Resource.find().skip(skip).limit(limit);
  const populatedResources = await Promise.all(
    resources.map(async (resource) => {
      await resource.populate("user_id", "name photo");
      return resource;
    })
  );
  res.status(200).json({
    "data-size": populatedResources.length,
    populatedResources,
  });
});

// exports.createResource = asyncCatcher(async (req, res, next) => {
//   req.body.user_id = req.user.id;
//   // Create the resource using the user ID and other information
//   const resource = await Resource.create(req.body);
//   //  console.log(resource);

//   res.status(201).json({
//     status: "success",
//     data: {
//       resource,
//     },
//   });
// });
exports.createResource = asyncCatcher(async (req, res, next) => {
  try {
    console.log("it entered resourses");
    console.log("it entered resourses", req.user._id);
    req.body.user_id = req.user._id;
    const resource = await Resource.create(req.body);
    resource.User = req.user._id;
    console.log("this is user", resource.User);
    await User.findOneAndUpdate(
      { _id: resource.user_id },
      { $inc: { points: 20 } }
    );
    const stats = await Statistics.findOne();
    if (!stats) {
      console.log("No statistics document found, creating a new one...");
      stats = await Statistics.create({});
    }
    stats.total_points += 20;

    function updateCategories(array, categoriesToCheck) {
      categoriesToCheck.forEach((category) => {
        const foundObject = array.find((obj) => obj.category === category);

        if (foundObject) {
          console.log("Object found, updating num...");
          foundObject.num += 1;
          console.log("Updated object:", foundObject);
        } else {
          console.log("Category not found, adding new object...");
          const newObject = { category: category, num: 1 };
          array.push(newObject);
          console.log("New object added:", newObject);
        }
      });
    }

    console.log("Updating categories...");
    updateCategories(stats.categoriesinfo, resource.categories);
    console.log("Updated stats:", JSON.stringify(stats, null, 2));

    try {
      const saveResult = await stats.save();
      console.log("Statistics updated and saved successfully:", saveResult);
    } catch (error) {
      console.error("Error saving statistics:", error);
    }

    res.status(201).json({
      status: "success",
      data: {
        resource,
      },
    });
  } catch (error) {
    console.error("Error creating resourse:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create resourse",
    });
  }
});

exports.createCourse = asyncCatcher(async (req, res, next) => {
  try {
    req.body.user_id = req.user._id;
    const course = await Course.create(req.body);
    course.user_id = req.user._id;
    await User.findOneAndUpdate(
      { _id: course.user_id },
      { $inc: { points: 50 } }
    );
    const stats = await Statistics.findOne();
    if (!stats) {
      console.log("No statistics document found, creating a new one...");
      stats = await Statistics.create({});
    }

    stats.total_points += 50;
    function updateCategories(array, categoriesToCheck) {
      categoriesToCheck.forEach((category) => {
        const foundObject = array.find((obj) => obj.category === category);

        if (foundObject) {
          console.log("Object found, updating num...");
          foundObject.num += 1;
          console.log("Updated object:", foundObject);
        } else {
          console.log("Category not found, adding new object...");
          const newObject = { category: category, num: 1 };
          array.push(newObject);
          console.log("New object added:", newObject);
        }
      });
    }

    console.log("Updating categories...");
    updateCategories(stats.categoriesinfo, course.categories);
    console.log("Updated stats:", JSON.stringify(stats, null, 2));

    try {
      const saveResult = await stats.save();
      console.log("Statistics updated and saved successfully:", saveResult);
    } catch (error) {
      console.error("Error saving statistics:", error);
    }

    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Error  creating course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create courses",
    });
  }
});
