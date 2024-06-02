const mongoose = require("mongoose");
const {User}=require('../models/userModule');
const { referrerPolicy } = require("helmet");

// Define the common schema for blogs, resources, and courses
const contentSchema = new mongoose.Schema({
  text: {
    type: String,
    // required: true,
  },title:{
    type:String,
    // required:true,
  },
  link: {
    type: String,
    // required: false,
  },
  photo: {
    type: String,
    // required: false,
  },
  video: {
    type: String,
    // required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: false,
  },
  categories:[{
    type:String,
    // required:true,
  }]
  ,
  datePublished: {
    type: Date,
    default: Date.now,
  },up:{
    type:Number,
    default:0
  },down:{
    type:Number,
    default:0
  },revusers:[{type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  default:[],
  }],
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
const contentSchema2 = new mongoose.Schema({
  text: {
    type: String,
    // required: true,
  },title:{
    type:String,
    // required:true,
  },
  link: {
    type: String,
    // required: false,
  },
  photo: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  categories:[{
    type:String,
    // required:true,
  }]
  ,status:{
    type:String,
    // required:true
  },
  datePublished: {
    type: Date,
    default: Date.now,
  },scrollprcnt:{
    type:Number,
    default:0,
  },up:{
    type:Number,
    default:0
  },down:{
    type:Number,
    default:0
  },revusers:[{type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  default:[],
  }],
});
const Blog = mongoose.model("Blog", contentSchema);
const Resource = mongoose.model("Resource", contentSchema);
const Course = mongoose.model("Course", contentSchema2);
// Export the models
module.exports = { Blog, Resource, Course };
