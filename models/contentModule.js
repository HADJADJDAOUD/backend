const mongoose = require("mongoose");

// Define the common schema for blogs, resources, and courses
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "my blog",
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
    default: "picture.png",
  },
  video: {
    type: String,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
    populate: {
      // Specify which fields you want to populate
      path: "user_id",
      select: "name photo", // Include 'name' and 'photo' fields
    },
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },
  scrollprcnt: {
    type: Number,
    default: 0,
  },
  up: {
    type: Number,
    default: 0,
  },
  down: {
    type: Number,
    default: 0,
  },
  revusers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  state: {
    type: String,
    default: "none",
  },
  saves: {
    type: Number,
    default: 0,
  },
  categories: [
    {
      type: String,
      // required:true,
    },
  ],
});

// Create multiple models using the same schema

// Define middleware or methods specific to each model
// For example, let's define a method to get the author's username
contentSchema.methods.getAuthorInfo = async function () {
  try {
    // Populate the user_id field to get user details
    await this.populate("user_id", "name image").execPopulate();
    // Access user details from the populated user_id field
    const { name, image } = this.user_id;
    return { name, image };
  } catch (error) {
    throw new Error("Error getting author info: " + error.message);
  }
};
const Blog = mongoose.model("Blog", contentSchema);
const Resource = mongoose.model("Resource", contentSchema);
const Course = mongoose.model("Course", contentSchema);

// Export the models
module.exports = { Blog, Resource, Course };
