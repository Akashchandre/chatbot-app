const express = require("express");
const router = express.Router();
const {
  createChatHandler,
  getAllChatsHandler,
  getChatMessagesHandler,
  sendMessageHandler,
  stopGenerationHandler,
   updateChatTitleHandler
} = require("../controllers/chatController");

router.post("/chat", createChatHandler);
router.get("/chats", getAllChatsHandler);
router.get("/chat/:chatId", getChatMessagesHandler);
router.post("/chat/:chatId/message", sendMessageHandler);
router.post("/chat/:chatId/stop", stopGenerationHandler);
router.post("/chat/:chatId/title", updateChatTitleHandler);

module.exports = router;
