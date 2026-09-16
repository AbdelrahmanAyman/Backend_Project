const express = require("express");
const menuControllers = require("../controllers/menuController");
const upload = require("../middleware/upload");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single("imageUrl");
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }
    next();
  });
};

router.get("/", menuControllers.getAllMenuItems);
router.get("/:id", menuControllers.getMenuItemById);

router.use(protect, restrictTo("admin"));

router.post("/", handleUpload, menuControllers.createMenuItem);
router.patch("/:id", handleUpload, menuControllers.updateMenuItem);
router.delete("/:id", menuControllers.deleteMenuItem);

module.exports = router;