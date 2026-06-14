const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload-multer.middleware");


const {
    sendMessage,
    getMessages,
    downloadFile
} = require("../controllers/message.controller");

// SEND MESSAGE
router.post(
    "/send-message",
    protect,
    upload.array("files",10),
    sendMessage
);

// GET MESSAGES
router.get(
    "/get-messages/:conversationId",
    protect,
    getMessages
);



router.get("/download/:messageId/:mediaIndex", downloadFile);




// FUTURE FEATURES
// router.put("/edit/:messageId")
// router.delete("/delete/:messageId")
// router.post("/forward")
// router.post("/react")
// router.post("/upload-media")

module.exports = router;