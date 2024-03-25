const asyncCatcher = require("../utils/asyncCatcher");
const { Blog } = require("../models/contentModule");
const { Course } = require("../models/contentModule");
const { Resource } = require("../models/contentModule");
exports.getAllBlogs = asyncCatcher(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  console.log(`this is the number of pages ${page}`);

  const blogs = await Blog.find()
    .populate("user_id", "name photo")
    .skip(skip)
    .limit(limit);

  const populatedBlogs = blogs.map((blog) => {
    // Access user details from the populated user_id field
    const { name, photo } = blog.user_id;
    // Construct a new object with blog data and author info
    return {
      _id: blog._id,
      text: blog.text,
      link: blog.link,
      photo: blog.photo,
      video: blog.video,
      user_id: blog.user_id,
      datePublished: blog.datePublished,
      author: { name, photo },
    };
  });
  console.log("this is the first blog user", populatedBlogs[0].author);
  res.status(200).json(populatedBlogs);
});

exports.createBlog = asyncCatcher(async (req, res, next) => {
  console.log("suuuuuuuuuuuuui");
  const blog = await Blog.create(req.body);
  console.log("suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui");
  res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.getAllCourses = asyncCatcher(async (req, res, next) => {
  const courses = await Course.find();
  const populatedCourses = await Promise.all(
    courses.map((course) => course.getAuthorInfo())
  );
  res.status(200).json({
    status: "success",
    data: {
      courses: populatedCourses,
    },
  });
});

exports.createCourse = asyncCatcher(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.getAllResources = asyncCatcher(async (req, res, next) => {
  const resources = await Resource.find();
  const populatedResources = await Promise.all(
    resources.map((resource) => resource.getAuthorInfo())
  );
  res.status(200).json({
    status: "success",
    data: {
      resources: populatedResources,
    },
  });
});

exports.createResource = asyncCatcher(async (req, res, next) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      resource,
    },
  });
});
