const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: 'egml yudt cyuk quoy'
    },
    // activate in gmail "less secure app option"
  });

  // define the email option

  const mailOptions = {
    from: "ifyouwanatake@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  await transporter.sendMail(mailOptions);
};
///
module.exports = sendEmail;
