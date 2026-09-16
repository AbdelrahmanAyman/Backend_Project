const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({    // gives a unique filename for each upload
  destination: function (req, file, cb) {
    let dest = "uploads/menu";
    if (req.baseUrl.includes("users") || req.baseUrl.includes("auth")) {
      dest = "uploads/users";
    }
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {   // rejects a non image files and check the extension
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const isExtensionValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = file.mimetype.startsWith("image/") && allowedExtensions.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    return cb(null, true);
  }

  cb(new Error("Only images are allowed"), false);
};

const upload = multer({   // limit each file with 5MB
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;