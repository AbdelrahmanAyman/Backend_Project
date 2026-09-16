const path = require("path");
const fs = require("fs").promises;

async function deleteUploadedFile(foldername, filename) {
  if (!filename) return;

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    foldername,
    filename
  );

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.log("Error deleting file:", err.message);
  }
}

module.exports = deleteUploadedFile;