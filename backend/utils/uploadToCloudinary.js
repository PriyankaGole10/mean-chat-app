const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// const path = require("path");

// const baseName = path.parse(originalname).name;

// detect correct Cloudinary resource type
function getResourceType(mimetype) {

  if (!mimetype) return "auto";

  if (mimetype === "application/pdf") return "raw";

  if (mimetype.includes("word") ||
    mimetype.includes("excel") ||
    mimetype.includes("zip") ||
    mimetype.includes("text")) {
    return "raw";
  }

  if (mimetype.startsWith("image/")) return "image";

  if (mimetype.startsWith("video/")) return "video";

  if (mimetype.startsWith("audio/")) return "video";

  return "auto";
}

const uploadToCloudinary = (fileBuffer, mimetype, originalname) => {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceType(mimetype);
    
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const customPublicId = `real-time-chat-app/${uniquePrefix}-${originalname}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: customPublicId,
        resource_type: resourceType
        // REMOVED content_disposition to prevent 401 Unauthorized errors
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;