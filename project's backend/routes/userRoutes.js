const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single("photo");
  uploadSingle(req, res, (err) => {
    if (err) return res.status(400).json({ status: "error", message: err.message });
    next();
  });
};

router.use(protect);
router.get("/me", userController.getMe);
router.patch("/me", handleUpload, userController.updateMe);

module.exports = router;