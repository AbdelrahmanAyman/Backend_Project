const User = require("../models/User");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

const getMe = async (req, res) => {   // returns the user's profile
  res.status(200).json({ status: "success", data: { user: req.user } });
};

const updateMe = async (req, res) => {    // edit the profile
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;

    if (req.file) {
      if (user.photo && user.photo !== "default-user.png") {
        deleteUploadedFile("users", user.photo);
      }
      user.photo = req.file.filename;
    }

    await user.save();

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    if (req.file) deleteUploadedFile("users", req.file.filename);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = { getMe, updateMe };