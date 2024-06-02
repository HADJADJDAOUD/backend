const asyncCatcher = require("../../userAuth/utils/asyncCatcher");
const { Blog } = require("../../userAuth/models/contentModule");
const { Course } = require("../../userAuth/models/contentModule");
const { Resource } = require("../../userAuth/models/contentModule");
const  User  = require("../../userAuth/models/userModule");
const {Statistics}=require('../models/StatisticsModule');
const bodyParser=require('body-parser');
const { Int32 } = require("mongodb");
const app=require('express')();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())





// exports.getsortedbloges=asyncCatcher(async(req,res,next)=>{
//  const sortedbloges=await Blog.find().sort({point:1}); 
// })

exports.getAllBlogs = asyncCatcher(async (req, res, next) => {
  try{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  console.log(`this is the number of pages ${page}`);
  const blogs = await Blog.find()
    .skip(skip)
    .limit(limit);
console.log(blogs)
  const  populatedBlogs = await Promise.all(blogs.map(async(blog) => {
    // Access user details from the populated user_id field
  await  blog.populate("user_id","name photo");
   return blog;
  }));
  
  
  res.status(200).json(populatedBlogs)
}
catch (error) {
 console.error("Error  getting blogs:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to get blogs"
 });
}
});

exports.createBlog = asyncCatcher(async (req, res, next) => {
  try{
  const blog = await Blog.create(req.body.data); 
  blog.user_id=req.body.user._id;
  console.log("the id is:.......................")
  console.log(blog.user_id)
  const user= await User.findOneAndUpdate({_id:blog.user_id},{$inc:{points:30}})
  const stats = await Statistics.findOne();
if (!stats) {
    console.error('No statistics document found');
    return;
}
stats.total_points += 30;
function updateCategories(array, categoriesToCheck) {
    categoriesToCheck.forEach(category => {
        const foundObject = array.find(obj => obj.category === category);

        if (foundObject) {
            console.log('Object found, updating num...');
            foundObject.num += 1;
            console.log('Updated object:', foundObject);
        } else {
            console.log('Category not found, adding new object...');
            const newObject = { category: category, num: 1 };
            array.push(newObject);
            console.log('New object added:', newObject);
        }
    });
}

console.log('Updating categories...');
updateCategories(stats.categoriesinfo, blog.categories);
console.log('Updated stats:', JSON.stringify(stats, null, 2));

try {
    const saveResult = await stats.save();
    console.log('Statistics updated and saved successfully:', saveResult);
} catch (error) {
    console.error('Error saving statistics:', error);
}

  console.log("suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui");
  res.status(201).json({
    status: "success",  
    blog:  blog,
   
  });
}
catch (error) {
 console.error("Error adding creating blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to create blog"
 });
}
});

exports.blogadduprev=asyncCatcher(async (req, res, next) => {
try{
 const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { up: 1 },$push: { 
  revusers: req.body.user._id
}});
console.log(blog)
var plus=0;
function addplus(){
  return 2;
}
 plus=addplus();
console.log(plus)
  const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
  const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
  console.log("-=-=-=-=-=-=-="+myuser)
  res.status(200).json({
    "status": "success",
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to course:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
});
exports.blogadddownrev=asyncCatcher(async (req, res, next) => {
  try{
  const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { down: 1 },$push: { 
   revusers: req.body.user._id
 }});
 console.log(blog)
 const rev=blog.up-blog.down;
 var plus=0;
 function addplus(){
   return -1;
 }
  plus=addplus();
 console.log(plus)
   const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
   const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
   console.log("-=-=-=-=-=-=-="+myuser)
   res.status(200).json({
    "status": "success",
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
});
exports.blogremuprev=asyncCatcher(async (req, res, next) => {
  try{
  const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { up: -1 },$pull: { 
   revusers: { $in: [req.body.user._id] } 
 }});
 const rev=blog.up-blog.down;
var plus=0;
function addplus(){
  return 2;
}
 plus=addplus();
console.log(plus)
  const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
  const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
  console.log("-=-=-=-=-=-=-="+myuser)
  res.status(200).json({
    "status": "success",
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
 });
 exports.blogremdownrev=asyncCatcher(async (req, res, next) => {
  try{
  const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { down: -1 },$pull: { 
   revusers: req.user._id
 }});
 const rev=blog.up-blog.down;
 var plus=0;
 function addplus(){
   return -1;
 }
  plus=addplus();
 console.log(plus)
   const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
   const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
   console.log("-=-=-=-=-=-=-="+myuser)
   res.status(200).json({
    "status": "success",
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
});
exports.blogswitchuptodown=asyncCatcher(async (req, res, next) => {
  try{
  const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { down: +1 , up:-1 }});
 console.log(blog)
  const rev=blog.up-blog.down;
 var plus=0;
 function addplus(){
   return -1;
 }
  plus=addplus();
 console.log(plus)
   const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
   const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
   console.log("-=-=-=-=-=-=-="+myuser)
   res.status(200).json({
    "status": "success", 
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
});
exports.blogswitchdowntoup=asyncCatcher(async (req, res, next) => {
  try{
  const blog=await Blog.findOneAndUpdate({_id : req.params.blogID},{$inc: { down: +1 , up:-1 }});
  console.log(blog) 
  const rev=blog.up-blog.down; 
 var plus=0;
 function addplus(){
   return 2;
 }
  plus=addplus();
 console.log(plus)
   const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc: { point: plus }})
   const stats=await Statistics.findOneAndUpdate({},{$inc: { total_points: plus }})
   console.log("-=-=-=-=-=-=-="+myuser)
   res.status(200).json({
    "status": "success",
    "message": "blog updated successfully"
  })
}
catch (error) {
 console.error("Error adding upvote to blog:", error);
 res.status(500).json({
   "status": "error",
   "message": "Failed to update blog"
 });
}
});


exports.getAllsavedCourses = asyncCatcher(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
    const skip = (page - 1) * limit;
    const courses = await Course.find({ status: "saved" }).skip(skip).limit(limit);
    const populatedsavedCourses = await Promise.all(courses.map(async (course) => {
      await course.populate("user_id", "name photo");
    
      return course.toJSON();
    }));
    res.courses = populatedsavedCourses; // Set res.courses
    console.log(res.courses)
    next();
  } catch (error) {
    console.error("Error fetching saved courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch saved courses",
    });
  }
});

exports.getAllliveCourses = asyncCatcher(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
    const skip = (page - 1) * limit;
    const courses = await Course.find({ status: "live" }).skip(skip).limit(limit);
    const populatedliveCourses = await Promise.all(courses.map(async (course) => {
      await course.populate("user_id", "name photo");
      return course;
    }));
    res.status(200).json({
      status: "success",
        courses:[populatedliveCourses,res.courses] 
      
    });

  } catch (error) {
    console.error("Error fetching live courses:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch live courses",
    });
  }
});




exports.createCourse = asyncCatcher(async (req, res, next) => {
  try{
  const course = await Course.create(req.body);     
  course.user_id=req.body.user._id;
  await User.findOneAndUpdate({_id:course.user_id},{$inc:{points:50}});
  const stats = await Statistics.findOne();
if (!stats) {
    console.error('No statistics document found');
    return;
}

stats.total_points += 50;
function updateCategories(array, categoriesToCheck) {
    categoriesToCheck.forEach(category => {
        const foundObject = array.find(obj => obj.category === category);

        if (foundObject) {
            console.log('Object found, updating num...');
            foundObject.num += 1;
            console.log('Updated object:', foundObject);
        } else {
            console.log('Category not found, adding new object...');
            const newObject = { category: category, num: 1 };
            array.push(newObject);
            console.log('New object added:', newObject);
        }
    });
}

console.log('Updating categories...');
updateCategories(stats.categoriesinfo, course.categories);
console.log('Updated stats:', JSON.stringify(stats, null, 2));

try {
    const saveResult = await stats.save();
    console.log('Statistics updated and saved successfully:', saveResult);
} catch (error) {
    console.error('Error saving statistics:', error);
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




exports.getAllResources = asyncCatcher(async (req, res, next) => {
  try{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Adjust the limit as needed
  const skip = (page - 1) * limit;
  const resources = await Resource.find().skip(skip)
  .limit(limit);
  const populatedResources = await Promise.all(resources.map(async(resource) => {
   await resource.populate("user_id", "name photo");
   return resource 
  }));
  res.status(200).json({
    status: "success",
     resources: populatedResources,
    
  });
} catch (error) {
  console.error("Error fetching resourses:", error);
  res.status(500).json({
    status: "error",
    message: "Failed to fetch resourses",
  });
}
});

exports.createResource = asyncCatcher(async (req, res, next) => {
  try{
  const resource = await Resource.create(req.body);
  resource.User=req.body.user._id;
  await User.findOneAndUpdate({_id:resource.user_id},{$inc:{points:20}});
  const stats = await Statistics.findOne();
  if (!stats) {
      console.error('No statistics document found');
      return;
  }
  
  stats.total_points += 20;
  
  function updateCategories(array, categoriesToCheck) {
      categoriesToCheck.forEach(category => {
          const foundObject = array.find(obj => obj.category === category);
  
          if (foundObject) {
              console.log('Object found, updating num...');
              foundObject.num += 1;
              console.log('Updated object:', foundObject);
          } else {
              console.log('Category not found, adding new object...');
              const newObject = { category: category, num: 1 };
              array.push(newObject);
              console.log('New object added:', newObject);
          }
      });
  }
  
  console.log('Updating categories...');
  updateCategories(stats.categoriesinfo, resource.categories);
  console.log('Updated stats:', JSON.stringify(stats, null, 2));
  
  try {
      const saveResult = await stats.save();
      console.log('Statistics updated and saved successfully:', saveResult);
  } catch (error) {
      console.error('Error saving statistics:', error);
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

exports.deleteblog=asyncCatcher(async (req, res, next) => {
  try{
  await Blog.findOneAndDelete({_id:req.params.blogID})
  res.json({
    seccess:true,
  })
  const myuser= await User.findOneAndUpdate({_id:req.body.user_id},{$pull:{saves: {$in:[req.params.blogID] } }})

}
  catch(error){
    console.error("Error deleating blog:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete blog",
    });
  }
})
exports.deletecourse=asyncCatcher(async (req, res, next) => {
  try{
  await Course.findOneAndDelete({_id:req.params.courseID})
  res.json({
    seccess:true,
  })
  const myuser= await User.findOneAndUpdate({_id:req.body.user_id},{$pull:{saves: {$in:[req.params.courseID ] } }})

}
  catch(error){
    console.error("Error deleating course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete course",
    });
  }
})
exports.deleteresource=asyncCatcher(async (req, res, next) => {
  try{
  await Resource.findOneAndDelete({_id:req.params.resourceID})
  res.json({
    seccess:true,
  })
  const myuser= await User.findOneAndUpdate({_id:req.body.user_id},{$pull:{saves: {$in:[req.params.resourceID ] } }})

}
  catch(error){
    console.error("Error deleating resource:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete resource",
    });
  }
})
exports.blogaddpoint=asyncCatcher(async (req, res, next) => {
  try{
  res.json({
    seccess:true,
  })
  const myuser= await User.findOneAndUpdate({_id:req.body.user_id},{$inc:{points:1}})

}
  catch(error){
    console.error("Error adding point:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to add point",
    });
  }
})

exports.saveresource=asyncCatcher(async (req, res, next) => {
  try{
const resource=await Resource.findById(req.params.resourceID)


const myuser= await User.findOneAndUpdate({_id:resource.user_id},{$inc:{points:4}});
const myuserr= await User.findOneAndUpdate({_id:req.body.user._id},{$push:{saves:req.params.resourceID }});
res.json({
  seccess:true,
})
}
  catch(error){
    console.error("Error saving resource:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to save resource",
    });
  }
})
exports.saveblog=asyncCatcher(async (req, res, next) => {
  try{
const blog=await Blog.findById(req.params.blogID)
const myuser= await User.findOneAndUpdate({_id:blog.user_id},{$inc:{points:4}});
const myuserr= await User.findOneAndUpdate({_id:req.body.user._id},{$push:{saves:req.params.blogID } }); 
res.json({
  seccess:true,
})
}
  catch(error){
    console.error("Error saving blog:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to save blog",
    });
  }  
})


exports.savecourse=asyncCatcher(async (req, res, next) => {
  try{
const course=await Course.findById(req.params.courseID)


const myuser= await User.findOneAndUpdate({_id:course.user_id},{$inc:{points:4}});
const myuserr= await User.findOneAndUpdate({_id:req.body.user._id},{$push:{saves: {$in:req.paramscourseID } }});
res.json({
  seccess:true,
})
}
  catch(error){
    console.error("Error saving course:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to save course",
    });
  }
})



















