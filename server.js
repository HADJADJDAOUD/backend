const dotenv = require("dotenv");
const mongoose = require('mongoose');
dotenv.config({ path: "./config.env" });
const app = require("./app"); // Import the main application logic

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection is succesfull');
  });


const port = process.env.PORT || 3000;


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
