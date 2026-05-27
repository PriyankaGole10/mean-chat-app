const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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

const uploadToCloudinary = (fileBuffer, mimetype) => {

  return new Promise((resolve, reject) => {

    const resourceType = getResourceType(mimetype);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "real-time-chat-app",
        resource_type: resourceType,
        type: "upload",
        access_mode: "public"
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);

  });

};

module.exports = uploadToCloudinary;