const asyncCatcher = require("./../utils/asyncCatcher");
const AppError = require("../../backend/utils/appError");
const APIFeatures = require("../../backend/utils/apiFeatures");
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
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  asyncCatcher(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
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
