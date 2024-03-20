const asyncCatcher = require("../utils/asyncCatcher");
exports.getUsers = asyncCatcher(async (req, res, next) => {
  const users = await User.find();

  // Send the users data as a response
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
