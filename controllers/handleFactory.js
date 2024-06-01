const asyncCatcher = require("./../utils/asyncCatcher");
const AppError = require("./../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
exports.deleteOne = (Model) =>
  asyncCatcher(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      // res.status(404).json({
      //   status: 'failed',
      //   message: `Model with id ${req.params.id} not found`,
      // });
      return next(
        new AppError("unfortunly there is no docemnt  like this ", 404)
      );
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// exports.deleteTour = asyncCatcher(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     // res.status(404).json({
//     //   status: 'failed',
//     //   message: `Tour with id ${req.params.id} not found`,
//     // });
//     return next(new AppError('unfortunly there is no id like this ', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.updateOne = (Model) =>
  asyncCatcher(async (req, res, next) => {
    try {
      // Fetch the current document
      const currentDoc = await Model.findById(req.user._id);

      if (!currentDoc) {
        console.log("No document found with that ID");
        return next(new AppError("No document found with that ID", 404));
      }

      // Log the current document data
      console.log("Current document data:", currentDoc._doc);

      // Prepare the updated data
      const updatedData = { ...currentDoc._doc }; // Create a copy of the current document data

      // Log the incoming request body
      console.log("Incoming request body:", req.body);

      // Update the media links if they are not empty strings
      if (req.body.media && Array.isArray(req.body.media)) {
        updatedData.media = currentDoc.media.map((mediaItem) => {
          const newMediaItem = req.body.media.find(
            (item) => item.platform === mediaItem.platform
          );
          return newMediaItem && newMediaItem.link !== ""
            ? newMediaItem
            : mediaItem;
        });

        // Check for new media platforms not in current media
        req.body.media.forEach((newMediaItem) => {
          if (
            !currentDoc.media.find(
              (mediaItem) => mediaItem.platform === newMediaItem.platform
            )
          ) {
            updatedData.media.push(newMediaItem);
          }
        });
      }

      // Log the updated media data
      console.log("Updated media data:", updatedData.media);

      // Update other fields if they are not empty strings
      for (const key in req.body) {
        if (key !== "media" && req.body[key] !== "") {
          updatedData[key] = req.body[key];
        }
      }

      // Log the updated data to save
      console.log("Updated data to save:", updatedData);

      // Update the document in the database
      const doc = await Model.findByIdAndUpdate(req.user._id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        console.log("Error updating the document");
        return next(new AppError("Error updating the document", 500));
      }

      // Log the successfully updated document
      console.log("Successfully updated document:", doc);

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    } catch (error) {
      console.error("Error in updateOne:", error);
      next(error);
    }
  });

exports.getAll = (Model) =>
  asyncCatcher(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, popOption) =>
  asyncCatcher(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) {
      query = query.populate(popOption);
    }

    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate(popOption);
    if (!doc) {
      return next(new AppError("there is no doc with this id ", 404));
    }
    res.status(200).json({
      status: "succes",
      data: {
        doc,
      },
    });
  });
