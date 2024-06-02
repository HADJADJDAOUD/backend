const asyncCatcher = require("../../userAuth/utils/asyncCatcher");
const { Blog } = require("../../userAuth/models/contentModule");
const { Course } = require("../../userAuth/models/contentModule");
const { Resource } = require("../../userAuth/models/contentModule");
const  User  = require("../../userAuth/models/userModule");
const bodyParser=require('body-parser');
const { Int32 } = require("mongodb");
const app=require('express')();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



exports.getsortedusers = asyncCatcher(async (req, res, next) => {
  try {
      const users = await User.find().sort({ points: req.query.sort });
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedfiltredusers = asyncCatcher(async (req, res, next) => {
  try {
    const filter = req.query.filtre ? req.query.filtre.split(',') : [];
      const users = await User.find({ skills: { $in: filter} }).sort({ points: req.query.sort });
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getfilteredusers = asyncCatcher(async (req, res, next) => {
  try {
    const filter = req.query.filtre ? req.query.filtre.split(',') : [];
      const users = await User.find({ skills: { $in: filter } });
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getfilteredblogs = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
    const stats = await Statistics.findOne();
    if (!stats) {
        console.error('No statistics document found');
        return;
    }
    
    stats.total_points += 30;
    console.log('Initial stats:', JSON.stringify(stats, null, 2));
    console.log('Blog categories:', filtre);
    
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
    updateCategories(stats.categoriesinfo, filtre);
    console.log('Updated stats:', JSON.stringify(stats, null, 2));
    
    try {
        const saveResult = await stats.save();
        console.log('Statistics updated and saved successfully:', saveResult);
    } catch (error) {
        console.error('Error saving statistics:', error);
    }
      console.log(filtre);
      const blogs = await Blog.find({ categories: { $in: filtre } });
      res.status(200).json(blogs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedblogs = asyncCatcher(async (req, res, next) => {
  try {
      const blogs = await Blog.find().sort({ points: req.query.sort });
      res.status(200).json(blogs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedfiltredblogs = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      const blogs = await Blog.find({ categories: { $in: filtre } }).sort({ points: req.query.sort });
      const stats = await Statistics.findOne();
if (!stats) {
    console.error('No statistics document found');
    return;
}

stats.total_points += 30;
console.log('Initial stats:', JSON.stringify(stats, null, 2));
console.log('Blog categories:', filtre);

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
updateCategories(stats.categoriesinfo, filtre);
console.log('Updated stats:', JSON.stringify(stats, null, 2));

try {
    const saveResult = await stats.save();
    console.log('Statistics updated and saved successfully:', saveResult);
} catch (error) {
    console.error('Error saving statistics:', error);
}

      res.status(200).json(blogs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsearchedfiltredblogs = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      console.log(req.query.search);
      const searchRegex = new RegExp(req.query.search, 'i');
      const blogs = await Blog.find({
          $or: [
              { title: { $regex: searchRegex } },
              { categories: { $regex: searchRegex } },
              {categories:{$in:filtre}}
          ]
      });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(blogs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});











exports.getfilteredcourses = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      console.log(filtre);
      const courses = await Course.find({ categories: { $in: filtre } });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedcourses = asyncCatcher(async (req, res, next) => {
  try {
      const courses = await Course.find().sort({ points: req.query.sort });
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedfiltredcourses = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      const courses = await Course.find({ categories: { $in: filtre } }).sort({ points: req.query.sort });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsearchedfiltredcourses = asyncCatcher(async (req, res, next) => {
  try {
      console.log(req.query.search);
      const searchRegex = new RegExp(req.query.search, 'i');
      const courses = await Course.find({
          $or: [
              { title: { $regex: searchRegex } },
              { categories: { $regex: searchRegex } }
          ]
      });
      res.status(200).json(courses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});







exports.getfilteredresources = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      console.log(filtre);
      const resources = await Resource.find({ categories: { $in: filtre } });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(resources);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedresources = asyncCatcher(async (req, res, next) => {
  try {
      const resources = await Resource.find().sort({ points: req.query.sort });
      res.status(200).json(resources);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsortedfiltredresources = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      const resources = await Resource.find({ categories: { $in: filtre } }).sort({ points: req.query.sort });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(resources);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

exports.getsearchedfiltredresources = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      console.log(req.query.search);
      const searchRegex = new RegExp(req.query.search, 'i');
      const resources = await Resource.find({
          $or: [
              { title: { $regex: searchRegex } },
              { categories: { $regex: searchRegex } },
              {categories:{$in:filtre}}
          ]
      });
      const stats = await Statistics.findOne();
      if (!stats) {
          console.error('No statistics document found');
          return;
      }
      
      stats.total_points += 30;
      console.log('Initial stats:', JSON.stringify(stats, null, 2));
      console.log('Blog categories:', filtre);
      
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(resources);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});








exports.getsearchedfiltredcourses = asyncCatcher(async (req, res, next) => {
  try {
    const filtre = req.query.filtre ? req.query.filtre.split(',') : [];
      console.log(req.query.search);
      const searchRegex = new RegExp(req.query.search, 'i');
      const cources = await Course.find({
          $or: [
              { title: { $regex: searchRegex } },
              { categories: { $regex: searchRegex } },
              {categories:{$in:filtre}}
          ]
      });
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
      updateCategories(stats.categoriesinfo, filtre);
      console.log('Updated stats:', JSON.stringify(stats, null, 2));
      
      try {
          const saveResult = await stats.save();
          console.log('Statistics updated and saved successfully:', saveResult);
      } catch (error) {
          console.error('Error saving statistics:', error);
      }
      res.status(200).json(cources);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

