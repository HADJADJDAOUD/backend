const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");
const { stringify } = require("querystring");
// const { Experience } = require("./experienceModule");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  media: {
    type: [
      {
        platform: String,
        link: String,
      },
    ],
    default: [],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  userType: {
    type: String,
    enum: ["admin", "brilliant", "user"],
    default: "user",
    select: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  Experience: {
    type: [
      {
        title: String,
        companyName: String,
        EmploymentType: String,
        location: String,
        startDate: String,
        endDate: String,
      },
    ],
    default: [],
  },
  photo: {
    type: String,
    default: "picture.png",
  },
  bgphoto: {
    type: String,
    default: "one_piece.png",
  },
  links: {
    type: Array,
  },
  skills: {
    type: Array,
    default: "there is no skills",
  },

  Education: {
    type: [
      {
        school: String,
        field: String,
        degree: String,
        startDate: String,
        endDate: String,
      },
    ],
    default: [],
  },
  Certification: {
    type: [
      {
        name: String,
        org: String,
        url: String,
        startDate: String,
      },
    ],
    default: [],
  },
  Language: {
    type: [
      {
        language: String,
        proficiency: String,
      },
    ],
    default: [],
  },
  bio: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  verified: {
    type: Boolean,
    default: false,
    select: false,
  },
  points: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 1,
  },
  saves: {
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
