const mongoose = require("mongoose");
const {User}=require('./userModule');


// Define the common schema for blogs, resources, and courses
const contentSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },text: {
    type: String,
    required: true,
  },
  employment_type: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  company_name: {
    type: String,
    required: false,
  },
 start_date: {
    type: String,
    required: false,
  },end_date: {  
    type: String,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  datePublished: {
    type: Date,
    default: Date.now,
  }
});
// Create multiple models using the same schema
// Define middleware or methods specific to each model
// For example, let's define a method to get the author's username

const Experience = mongoose.model("Experience", contentSchema);

// Export the models
module.exports = {Experience};
