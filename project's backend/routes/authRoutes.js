const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single("photo");
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }
    next();
  });
};

router.post("/signup", handleUpload, authController.signup);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;