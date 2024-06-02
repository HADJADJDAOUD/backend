const mongoose = require("mongoose");
const {User}=require('./userModule');
const { Int32 } = require("mongodb");


// Define the common schema for blogs, resources, and courses
const contentSchema = new mongoose.Schema({
total_points:{
type:Number,
    default:0
},categoriesinfo:[{
    type:Object,
}]
});

const Statistics = mongoose.model("Statistics", contentSchema);

// Export the models
module.exports = {Statistics};