const jwt = require("jsonwebtoken");
const User = require("../models/User");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

const signToken = (id) => {    // creates a signed token containing the user's id
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_IN,
  });
};

const signup = async (req, res) => {   // creates a new account
  try {
    const photo = req.file ? req.file.filename : undefined;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      photo,
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("users", req.file.filename);
    }
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const login = async (req, res) => {   // checking email and password for the login
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {   // returns the currently logged-in user
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
};

module.exports = { signup, login, getMe };